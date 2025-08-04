/*!
 * The reveal.js markdown plugin. Handles parsing of
 * markdown inside of presentations as well as loading
 * of external markdown documents.
 */

import { marked } from "marked";
import { baseUrl } from "marked-base-url";
import { gfmHeadingId } from "marked-gfm-heading-id";
import DOMPurify from "dompurify";

// const log = (msg) => (res) => {
//   console.log(`${msg}: ${res}`);
//   return res;
// };

const DEFAULT_SLIDE_SEPARATOR = "\r?\n---\r?\n",
  DEFAULT_NOTES_SEPARATOR = "notes?:",
  DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR = "\\\.element\\\s*?(.+?)$",
  DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR = "\\\.slide:\\\s*?(\\\S.+?)$";

const SCRIPT_END_PLACEHOLDER = "__SCRIPT_END__";

const CODE_LINE_NUMBER_REGEX = /\[([\s\d,|-]*)\]/;

const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

let BASE_URL = "";

let DIAGRAM_COUNTER = 0;

const SANITIZE = (string) =>
  // Documentation: https://github.com/cure53/DOMPurify?tab=readme-ov-file#can-i-configure-dompurify
  DOMPurify.sanitize(
    string,
    {
      ADD_TAGS: [
        "#comment", // comments are vital for configuring revealjs
        "foreignObject", // unfortunately some mermaid diagrams use it, despite being a potential security risk: https://github.com/cure53/DOMPurify/issues/469
        "iframe", // allow iframes to support youtube videos
      ],
      ADD_ATTR: [
        "target",
        "allow", // required for youtube videos
        "allowfullscreen", // required for youtube videos
      ],
    },
  );

/**
 * Check if a node value has the attributes pattern.
 * If yes, extract it and add that value as one or several attributes
 * to the target element.
 *
 * You need Cache Killer on Chrome to see the effect on any FOM transformation
 * directly on refresh (F5)
 * http://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development/7000899#answer-11786277
 */
function addAttributeInElement(node, elementTarget, separator) {
  const attrsInNode = new RegExp(separator, "mg");
  const attrsRegex = new RegExp(
    // attributes are limited to prevent code injection
    "(?:^|\s)(?<attr>class|style|data-[a-z-]+)=(?:\"(?<dval>[^\"]+?)\"|'(?<sval>[^']+?)')",
    "gm",
  );
  let matches,
    matchesAttrs;
  if ((matches = attrsInNode.exec(node.nodeValue)) !== null) {
    const classes = matches[1];
    node.nodeValue = node.nodeValue.substring(0, matches.index) +
      node.nodeValue.substring(attrsInNode.lastIndex);
    while ((matchesAttrs = attrsRegex.exec(classes)) !== null) {
      elementTarget.setAttribute(
        matchesAttrs.groups.attr,
        matchesAttrs.groups.dval || matchesAttrs.groups.sval || "",
      );
    }
    return true;
  }
  return false;
}

/**
 * Add attributes to the parent element of a text node,
 * or the element of an attribute node.
 */
function addAttributes(
  section,
  element,
  previousElement,
  separatorElementAttributes,
  separatorSectionAttributes,
) {
  if (element?.childNodes && element.childNodes.length > 0) {
    let previousParentElement = element;
    for (let i = 0; i < element.childNodes.length; i++) {
      const childElement = element.childNodes[i];
      if (i > 0) {
        let j = i - 1;
        while (j >= 0) {
          const aPreviousChildElement = element.childNodes[j];
          if (
            typeof aPreviousChildElement.setAttribute == "function" &&
            aPreviousChildElement.tagName != "BR"
          ) {
            previousParentElement = aPreviousChildElement;
            break;
          }
          j = j - 1;
        }
      }
      let parentSection = section;
      if (childElement.nodeName == "section") {
        parentSection = childElement;
        previousParentElement = childElement;
      }
      if (
        typeof childElement.setAttribute == "function" ||
        childElement.nodeType == Node.COMMENT_NODE
      ) {
        addAttributes(
          parentSection,
          childElement,
          previousParentElement,
          separatorElementAttributes,
          separatorSectionAttributes,
        );
      }
    }
  }
  if (element.nodeType == Node.COMMENT_NODE) {
    if (
      addAttributeInElement(
        element,
        previousElement,
        separatorElementAttributes,
      ) ===
        false
    ) {
      addAttributeInElement(element, section, separatorSectionAttributes);
    }
  }
}

/**
 * Inspects the given options and fills out default
 * values for what's not defined.
 * @param {object} options Slidify options.
 * @returns {object} Returns options with added default values.
 */
function addSlidifyDefaultOptions(options) {
  options = options || {};
  options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
  options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
  options.attributes = options.attributes || "";
  return options;
}

export function buildMarkedConfiguration(markedOptions) {
  // Marked options: https://marked.js.org/using_advanced#options
  // baseUrl for html elements a and img
  let base_url;
  if (!markedOptions.baseUrl) {
    base_url = BASE_URL;
    marked.use(baseUrl(BASE_URL));
  } else {
    base_url = markedOptions.baseUrl;
    marked.use(baseUrl(markedOptions.baseUrl));
    delete markedOptions.baseUrl;
  }
  marked.use(gfmHeadingId());
  markedOptions.async = true;
  markedOptions.useNewRenderer = true;
  const a_href_regex =
    /((<a[^>]*? href=")([^"]*?)("[^>]*?>)|(<a[^>]*? href=')([^']+?)('[^>]*?>))/gi;
  // TODO: apply img src also to data-preview-image
  const img_src_regex =
    /((<img[^>]*? src=")([^"]*?)("[^>]*?>)|(<img[^>]*? src=')([^']+?)('[^>]*?>))/gi;
  const isUrl = /^https?:\/\//;
  const isAbsolute = /^\//;
  const isLocal = /^#/;
  const isRelative = /^(\.\.\/|\.\/)/;
  const markedConfig = {
    ...markedOptions,
    renderer: {
      code: (text) => {
        return text.text;
      },
    },
    walkTokens: (token) => {
      if (token.type === "html") {
        let text = [];
        let last_index = 0;
        let remainder = "";
        for (const match of token.text.matchAll(img_src_regex)) {
          const matchOffset = match[2] ? 0 : 3;
          text.push(token.text.substring(last_index, match.index));
          const ref = match[3 + matchOffset];
          const needsRebase =
            !(isUrl.test(ref) || isAbsolute.test(ref) || isLocal.test(ref));
          // const needsRebase = isRelative.test(ref);
          if (needsRebase) {
            text.push(
              `${match[2 + matchOffset]}${base_url}${match[3 + matchOffset]}${
                match[4 + matchOffset]
              }`,
            );
          } else {
            text.push(
              `${match[2 + matchOffset]}${match[3 + matchOffset]}${
                match[4 + matchOffset]
              }`,
            );
          }
          last_index = match.index + match[0].length;
        }
        if (text.length) {
          remainder = token.text.substring(last_index, token.text.length);
          token.text = text.join("") + remainder;
        }
        text = [];
        last_index = 0;
        for (const match of token.text.matchAll(a_href_regex)) {
          text.push(token.text.substring(last_index, match.index));
          const matchOffset = match[2] ? 0 : 3;
          const ref = match[3 + matchOffset];
          // const needsRebase = !(isUrl.test(ref) || isAbsolute.test(ref) || isLocal.test(ref))
          const needsRebase = isRelative.test(ref);
          if (needsRebase) {
            text.push(
              `${match[2 + matchOffset]}${base_url}${match[3 + matchOffset]}${
                match[4 + matchOffset]
              }`,
            );
          } else {
            text.push(
              `${match[2 + matchOffset]}${match[3 + matchOffset]}${
                match[4 + matchOffset]
              }`,
            );
          }
          last_index = match.index + match[0].length;
        }
        if (text.length) {
          remainder = token.text.substring(last_index, token.text.length);
          token.text = text.join("") + remainder;
        }
      } else if (token.type === "code") {
        token.text = codeHandler(token.text, token.lang);
      }
    },
  };
  if (markedOptions.animateLists === true) {
    markedConfig.renderer.listitem = (text) =>
      `<li class="fragment">${text}</li>`;
  }
  marked.use(markedConfig);
  return marked;
}

function codeHandler(code, language) {
  if (language === "mermaid") {
    // INFO: height and width are set to work around bug https://github.com/chartjs/Chart.js/issues/5805
    DIAGRAM_COUNTER += 1;
    return `<div data-mermaid-id="mermaid-${DIAGRAM_COUNTER}" data-mermaid="${
      btoa(code)
    }"></div>`;
  } else if (language === "echarts") {
    return `<div style="width: 100px; height: 100px; width: clamp(100px, 100%, 100vw); height: clamp(100px, 100%, 100vh);" data-echarts=${
      btoa(code)
    }></div>`;
  } else {
    return SANITIZE(defaultCodeHandler(code, language));
  }
}

/**
 * Converts any current data-markdown slides in the
 * DOM to HTML.
 * @param {Element} section Section element that will receive the markdown data.
 * @param {object} marked Marked parser with embedded configuration.
 * @returns {Promise<object>} Returns options with added default values.
 */
export function convertMarkdownToSlides(startElement, marked) {
  const sections = startElement.querySelectorAll(
    "[data-markdown]:not([data-markdown-parsed])",
  );
  let sectionNumber = 0;
  const promises = [];
  [].slice.call(sections).forEach((section) => {
    const parse = async function (section) {
      section.setAttribute("data-markdown-parsed", true);
      const notes = section.querySelector("aside.notes");
      const markdown = getMarkdownFromSlide(section);
      // convert markdown to HTML
      section.innerHTML = SANITIZE(await marked.parse(markdown));
      const firstChild = section.firstElementChild;
      if (firstChild && firstChild.id !== "") {
        section.id = firstChild.id;
        firstChild.removeAttribute("id");
      } else {
        section.id = `${sectionNumber}`;
      }
      addAttributes(
        section,
        section,
        null,
        section.getAttribute("data-element-attributes") ||
          section.parentNode.getAttribute("data-element-attributes") ||
          DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR,
        section.getAttribute("data-attributes") ||
          section.parentNode.getAttribute("data-attributes") ||
          DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR,
      );
      // If there were notes, we need to re-add them after
      // having overwritten the section's HTML
      if (notes) {
        section.appendChild(notes);
      }
      sectionNumber += 1;
    };
    promises.push(parse(section));
  });
  return Promise.all(promises);
}

/**
 * Helper function for constructing a markdown slide.
 * @param {string} content Markdown content.
 * @param {object} options Slidify options.
 * @returns {Promise<string>} Script tag with markdown content as text template.
 */
async function createMarkdownSlide(content, options) {
  options = addSlidifyDefaultOptions(options);
  const notesMatch = content.split(new RegExp(options.notesSeparator, "mgi"));
  if (notesMatch.length === 2) {
    content = notesMatch[0] + '<aside class="notes">' +
      SANITIZE(await marked.parse(notesMatch[1].trim())) + "</aside>";
  }
  // prevent script end tags in the content from interfering
  // with parsing
  // FIXME: maybe let dom purifier take care of this
  content = content.replace(/<\/script>/g, SCRIPT_END_PLACEHOLDER);
  return '<script type="text/template">' + content + "</script>";
}

function defaultCodeHandler(code, language) {
  // Off by default
  let lineNumbers = "";
  // Users can opt in to show line numbers and highlight
  // specific lines.
  // ```javascript []        show line numbers
  // ```javascript [1,4-8]   highlights lines 1 and 4-8
  if (language && CODE_LINE_NUMBER_REGEX.test(language)) {
    lineNumbers = language.match(CODE_LINE_NUMBER_REGEX)[1].trim();
    lineNumbers = `data-line-numbers="${lineNumbers}"`;
    language = language.replace(CODE_LINE_NUMBER_REGEX, "").trim();
  }
  // Escape before this gets injected into the DOM to
  // avoid having the HTML parser alter our code before
  // highlight.js is able to read it
  code = escapeForHTML(code);
  if (language) {
    return `<pre><code ${lineNumbers} class="${language}">${code}</code></pre>`;
  } else {
    return `<pre><code ${lineNumbers}>${code}</code></pre>`;
  }
}

function escapeForHTML(input) {
  return input.replace(/([&<>'"])/g, (char) => HTML_ESCAPE_MAP[char]);
}

/**
 * Given a markdown slide section element, this will
 * return all arguments that aren't related to markdown
 * parsing. Used to forward any other user-defined arguments
 * to the output markdown slide.
 */
function getForwardedAttributes(section) {
  const attributes = section.attributes;
  const result = [];
  for (let i = 0, len = attributes.length; i < len; i++) {
    const name = attributes[i].name,
      value = attributes[i].value;
    // disregard attributes that are used for markdown loading/parsing
    if (/data\-(markdown|separator|vertical|notes)/gi.test(name)) continue;
    if (value) {
      result.push(name + '="' + value + '"');
    } else {
      result.push(name);
    }
  }
  return result.join(" ");
}

/**
 * Retrieves the markdown contents of a slide section
 * element. Normalizes leading tabs/whitespace.
 * @param {Element} section Section element that will receive the markdown data.
 * @returns {object} Returns markdown.
 */
function getMarkdownFromSlide(section) {
  // look for a <script> or <textarea data-template> wrapper
  const template = section.querySelector("textarea[data-template]") ||
    section.querySelector("script");
  // strip leading whitespace so it isn't evaluated as code
  let markdown = (template || section).textContent;
  // restore script end tags
  markdown = markdown.replace(
    new RegExp(SCRIPT_END_PLACEHOLDER, "g"),
    "</script>",
  );
  const leadingWs = markdown.match(/^\n?(\s*)/)[1].length,
    leadingTabs = markdown.match(/^\n?(\t*)/)[1].length;
  if (leadingTabs > 0) {
    markdown = markdown.replace(
      new RegExp("\\n?\\t{" + leadingTabs + "}", "g"),
      "\n",
    );
  } else if (leadingWs > 1) {
    markdown = markdown.replace(
      new RegExp("\\n? {" + leadingWs + "}", "g"),
      "\n",
    );
  }
  return markdown;
}

/**
 * Hide customcontrols if visibility of controls changes.
 */
function hideCustomControlsIfVisiblityChanges(element) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const style = window.getComputedStyle(mutation.target, null);
      const display = style?.getPropertyValue("display");
      if (display === "none") {
        document.documentElement.style.setProperty(
          "--display-customcontrols",
          "none",
        );
      }
    });
  });
  if (element) {
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["style"],
    });
  } else {
    console.error(
      "hideCustomControlsIfVisiblityChanges, can't observe null element",
    );
  }
}

function loadExternalMarkdown(section) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    const url = section.getAttribute("data-markdown");
    const datacharset = section.getAttribute("data-charset");
    // see https://developer.mozilla.org/en-US/docs/Web/API/element.getAttribute#Notes
    if (datacharset != null && datacharset != "") {
      xhr.overrideMimeType("text/html; charset=" + datacharset);
    }
    xhr.onreadystatechange = function (_section, xhr) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        // file protocol yields status code 0 (useful for local debug, mobile applications etc.)
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
          resolve(xhr, url);
        } else {
          reject(xhr, url);
        }
      }
    }.bind(this, section, xhr);
    xhr.open("GET", url, true);
    try {
      xhr.send();
    } catch (e) {
      console.warn(
        "Failed to get the Markdown file " + url +
          ". Make sure that the presentation and the file are served by a HTTP server and the file can be found there. " +
          e,
      );
      resolve(xhr, url);
    }
  });
}

/**
 * Parse metadata from a string into an object.
 */
function parseMetadata(metadataString) {
  return metadataString.split(/\r?\n/)
    .map((line) => line.split(/^([^:]+?):\s/).map((res) => res.trim()))
    .filter((entry) => entry.length > 2)
    .filter((entry) => !entry[1].startsWith("#")) // remove comments
    .map((entry) => ({ [entry[1]]: entry[2] }))
    .reduce(
      (acc, current) => Object.assign(acc, current),
      {},
    );
}

/**
 * Prepares markdown data to be converted into HTML.
 * @param {Element} section Section element that will receive the markdown data.
 * @param {string} markdown Markdown data.
 * @returns {Promise<object>} Returns discovered metadata.
 */
async function preProcessMarkdown(section, markdown) {
  let metadata = {};
  if (section.getAttribute("data-load-metadata") !== null) {
    const metadataRegExp =
      /^---\r?\n(?<metadata>(?:#.*|[a-zA-Z0-9-]+:\s.*|\r?\n)*)---(?:\r?\n)?/g;
    const metadataMatch = metadataRegExp.exec(markdown);
    if (metadataMatch) {
      // TODO: a context element would be helpful to be able to
      // properly set metadata
      if (metadataMatch.groups.metadata) {
        metadata = parseMetadata(metadataMatch.groups.metadata);
      }
      markdown = markdown.substring(metadataRegExp.lastIndex);
    }
  }
  section.outerHTML = await slidify(markdown, {
    separator: section.getAttribute("data-separator"),
    verticalSeparator: section.getAttribute("data-separator-vertical"),
    notesSeparator: section.getAttribute("data-separator-notes"),
    attributes: getForwardedAttributes(section),
  });
  return metadata;
}

/**
 * Parses any current data-markdown slides, splits
 * multi-slide markdown into separate sections and
 * handles loading of external markdown.
 * @param {Node} scope Node to process slides from.
 * @returns {Promise<object>} Gathered metadata.
 */
export function preProcessSlides(scope) {
  const externalPromises = [];
  [].slice.call(
    scope.querySelectorAll(
      "section[data-markdown]:not([data-markdown-parsed])",
    ),
  ).forEach(function (section, _i) {
    if (section.getAttribute("data-markdown") === "<<load-plain-markdown>>") {
      // Directly parse markdown from an attribute that stores the markdown content
      externalPromises.push(
        preProcessMarkdown(
          section,
          section.getAttribute("data-markdown-plain"),
        ),
      );
    } else if (section.getAttribute("data-markdown").length) {
      // Load external markdown from a URL that's provided in the data-markdown attriute and then parse it
      const promise = loadExternalMarkdown(section).then(
        // Finished loading external file
        function (xhr, _url) {
          if (!BASE_URL) {
            // TODO: add support for multiple markdown elements
            const base_url = new URL(xhr.responseURL);
            const base_path = base_url.pathname.split(/\//);
            base_url.pathname = base_path.splice(0, base_path.length - 1)
              .join(
                "/",
              );
            // ensure there's a trailing slash otherwish markered
            // interprets it differently
            BASE_URL = base_url.toString() + "/";
          }
          return preProcessMarkdown(section, xhr.responseText);
        },
        // Failed to load markdown
        function (xhr, url) {
          section.outerHTML = '<section data-state="alert">' +
            "ERROR: The attempt to fetch " + url +
            " failed with HTTP status " + xhr.status + "." +
            "Check your browser's JavaScript console for more details." +
            "<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>" +
            "</section>";
        },
      );
      externalPromises.push(promise);
    } else {
      // Load from script and textarea tags
      const promise = slidify(
        getMarkdownFromSlide(section).then((res) => {
          section.outerHTML = res;
        }),
        {
          separator: section.getAttribute("data-separator"),
          verticalSeparator: section.getAttribute("data-separator-vertical"),
          notesSeparator: section.getAttribute("data-separator-notes"),
          attributes: getForwardedAttributes(section),
        },
      );
      externalPromises.push(promise);
    }
  });
  return Promise.all(externalPromises).then((metadatas) => {
    // Collect metadata in an object. The last value overwrites the first.
    return metadatas.reduce((acc, v) => Object.assign(acc, v), {});
  });
}

/**
 * Parses a data string into multiple slides based on the passed in separator arguments.
 * @param {string} markdown Markdown content.
 * @param {object} options Slidify options.
 * @returns {Promise<string>} Updated markdown with added section teags.
 */
function slidify(markdown, options) {
  options = addSlidifyDefaultOptions(options);
  // FIXME: migrate these separators into custom marked parser to get away from regexp
  const separatorRegex = new RegExp(
      options.separator +
        (options.verticalSeparator ? "|" + options.verticalSeparator : ""),
      "mg",
    ),
    horizontalSeparatorRegex = new RegExp(options.separator),
    verticalSeparatorRegex = new RegExp(
      options.verticalSeparator ? "|" + options.verticalSeparator : "",
    );
  let matches,
    lastIndex = 0,
    isHorizontal,
    wasHorizontal = true,
    content;
  const sectionStack = [];
  // iterate until all blocks between separators are stacked up
  while ((matches = separatorRegex.exec(markdown)) !== null) {
    // determine direction (horizontal by default)
    isHorizontal = horizontalSeparatorRegex.test(matches[0]);
    if (!isHorizontal && wasHorizontal) {
      // create vertical stack
      sectionStack.push([]);
    }
    // pluck slide content from markdown input
    content = markdown.substring(lastIndex, matches.index);
    // skip empty slides
    if (content.trim().length > 0) {
      if (isHorizontal && wasHorizontal) {
        // add to horizontal stack
        sectionStack.push(content);
      } else {
        // add to vertical stack
        sectionStack[sectionStack.length - 1].push(content);
      }
    }
    if (
      (horizontalSeparatorRegex.test(matches[0]) ||
        verticalSeparatorRegex.test(matches[0])) &&
      matches[0].match(/^#{1,3} /) !== null
    ) {
      // include the heading indicator if the separators were configured to
      // match the heading
      lastIndex = separatorRegex.lastIndex - matches[0].length;
    } else {
      lastIndex = separatorRegex.lastIndex;
    }
    wasHorizontal = isHorizontal;
  }
  // add the remaining slide
  (wasHorizontal ? sectionStack : sectionStack[sectionStack.length - 1]).push(
    markdown.substring(lastIndex),
  );
  const promises = [];
  // flatten the hierarchical stack, and insert <section data-markdown> tags
  for (let i = 0, len = sectionStack.length; i < len; i++) {
    // vertical
    if (sectionStack[i] instanceof Array) {
      const section_promises = [];
      sectionStack[i].forEach(function (child) {
        section_promises.push(
          createMarkdownSlide(child, options).then((content) =>
            "<section data-markdown>" + content + "</section>"
          ),
        );
      });
      promises.push(
        new Promise((resolve) => {
          Promise.all(section_promises).then((res) =>
            resolve(
              "<section " + options.attributes + ">" + res.join("") +
                "</section>",
            )
          );
        }),
      );
    } else {
      promises.push(
        createMarkdownSlide(sectionStack[i], options).then((content) =>
          "<section " + options.attributes + " data-markdown>" + content +
          "</section>"
        ),
      );
    }
  }
  return Promise.all(promises).then((res) => res.join(""));
}

const Plugin = () => {
  // The reveal.js instance this plugin is attached to
  let deck;

  /**
   * Apply metadta to presentation.
   */
  function applyMetadata(metadata) {
    const defaultMetadata = {
      "theme": "white",
      "highlight-theme": "monokai",
      "favicon": "/favicon.svg",
      "fontawesomePro": false,
      "fontawesomeFree": false,
      // changed revealjs defaults
      "hash": true,
    };
    const loadLink = (relation) => (reference) => {
      const stylesheet = document.createElement("link");
      stylesheet.rel = relation;
      stylesheet.href = reference;
      document.head.appendChild(stylesheet);
    };
    const loadStylesheet = loadLink("stylesheet");
    const loadScript = (scriptReference, crossorirgin) => (load) => {
      if (!load) {
        return load;
      }
      const script = document.createElement("script");
      script.src = scriptReference;
      if (crossorirgin) {
        script.crossorirgin = crossorirgin;
      }
      document.body.appendChild(script);
    };
    const addMeta = (name) => (content) => {
      const meta = document.createElement("meta");
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
      document.documentElement.style.setProperty(
        `--slideshow-${name == "dcterms.date" ? "date" : name}`,
        `"${content}"`,
      );
    };
    const defaultURLToStylesheet = (defaultURL) => (word) => {
      if (/^[\w0-9_-]+$/.exec(word)) {
        return loadStylesheet(`${defaultURL}/${word}.css`);
      } else {
        return loadStylesheet(word);
      }
    };
    const applyFunctions = {
      // List of Meta tags: https://gist.github.com/lancejpollard/1978404
      "title": (title) => {
        document.title = title;
        document.documentElement.style.setProperty(
          "--slideshow-title",
          `"${title}"`,
        );
        addMeta("og:title")(title);
      },
      "favicon": loadLink("icon"),
      "theme": defaultURLToStylesheet("/vendor/reveal.js/dist/theme"),
      "highlight-theme": defaultURLToStylesheet(
        "/vendor/highlight.js",
      ),
      "addiontional-stylesheet": loadStylesheet,
      "Cache-Control": addMeta("Cache-Control"),
      "abstract": addMeta("abstract"),
      "author": addMeta("author"),
      "category": addMeta("category"),
      "classification": addMeta("Classification"),
      "copyright": addMeta("copyright"),
      "coverage": addMeta("coverage"),
      "date": addMeta("dcterms.date"),
      "description": (desc) =>
        S.map((fn) => fn(desc))([
          addMeta("description"),
          addMeta("og:description"),
        ]),
      "designer": addMeta("designer"),
      "directory": addMeta("directory"),
      "distribution": addMeta("distribution"),
      "expires": addMeta("Expires"),
      "identifier-url": addMeta("identifier-URL"),
      "keywords": addMeta("keywords"),
      "language": addMeta("language"),
      "owner": addMeta("owner"),
      "pragma": addMeta("Pragma"),
      "rating": addMeta("rating"),
      "reply-to": addMeta("reply-to"),
      "revised": addMeta("revised"),
      "revisit-after": addMeta("revisit-after"),
      "robots": addMeta("robots"),
      "subject": addMeta("subject"),
      "summary": addMeta("summary"),
      "topic": addMeta("topic"),
      "url": (url) =>
        S.map((fn) => fn(url))([addMeta("url"), addMeta("og:url")]),
      "fontawesomePro": loadScript(
        "https://kit.fontawesome.com/fec85b2437.js",
        "anonymous",
      ),
      "fontawesomeFree": loadScript(
        "https://kit.fontawesome.com/ce15cd202d.js",
        "anonymous",
      ),
      "_customcontrols": () => {
        // ignore the _customcontrols visibility setting
      },
      "plugins": () => {
        // ignore plugins setting as it's managed by revealjs
      },
      "customcontrols": () => {
        // ignore customcontrols setting as it's managed by customcontrols
      },
      "dependencies": () => {
        // ignore dependencies setting as it's managed by revealjs
      },
    };
    const parseType = (value) => {
      if (value === "true") {
        return true;
      } else if (value === "false") {
        return false;
      } else if (value === "null") {
        return null;
      } else if (/^-?[0-9]+$/.exec(value)) {
        return Number.parseInt(value);
      } else if (/^\[(?:(, )?(?<quote>['"])[a-z-]\k<quote>)*\]$/.exec(value)) {
        // parse list of strings as this is the other format support by revealjs
        return JSON.parse(value);
      } else {
        if (typeof value === "string") {
          // strip quotes and whitespace
          return value.replaceAll(
            /(^[ \t]*[\'\"]?[ \t]*)|([ \t]*[\'\"]?[ \t]*$)/g,
            "",
          );
        } else {
          return value;
        }
      }
    };

    const revealjsConfig = deck.getConfig();
    const _mergedMetadata = [defaultMetadata, metadata].reduce(
      (acc, v) => Object.assign(acc, v),
      {},
    );
    const mergedMetadata = {};
    Object.keys(_mergedMetadata)
      .map((k) => {
        mergedMetadata[k] = parseType(_mergedMetadata[k]);
      });
    if (mergedMetadata.fontawesomePro) {
      mergedMetadata.fontawesomeFree = false;
    }
    if (mergedMetadata.fontawesomeFree) {
      mergedMetadata.fontawesomePro = false;
    }
    if (
      // since revealjsConfig.controls is true by default, only decktape and
      // similar tools are able to override it .. so prefer whatever these tools
      // have configured
      revealjsConfig.controls && (
        mergedMetadata?._customcontrols ||
        (mergedMetadata?._customcontrols !== false &&
          mergedMetadata?.controls)
      )
    ) {
      document.documentElement.style.setProperty(
        "--display-customcontrols",
        "block",
      );
    } else {
      document.documentElement.style.setProperty(
        "--display-customcontrols",
        "none",
      );
    }
    const revealjsNewConfig = {};
    Object.keys(mergedMetadata)
      .map((k) => {
        const fn = applyFunctions[k];
        const value = mergedMetadata[k];
        if (fn) {
          fn(value);
        } else {
          if (k in revealjsConfig) {
            revealjsNewConfig[k] = value;
          } else {
            console.error(`Ignoring unknown option: ${k}`);
          }
        }
      });
    if (Object.keys(revealjsNewConfig).length > 0) {
      Reveal.configure(revealjsNewConfig);
    }
  }

  return {
    id: "slidesdown",
    marked: marked,

    /**
     * Starts processing and converting Markdown within the
     * current reveal.js deck.
     */
    init: function (reveal) {
      deck = reveal;
      let { renderer, ...markedOptions } = deck.getConfig().markdown || {};

      deck.on("ready", (_event) => {
        hideCustomControlsIfVisiblityChanges(
          document.querySelector(".controls"),
        );
      });

      // Markdown processing steps:
      // 1. preProcessSlides discovers section tags with a data-markdown attribute an turns it into script tags of type
      //    data/html. In this step, slides are also separated into different section tags
      // 2. applyMetadata takes all YAML frontmatter metadata found the markdown data and applies it to revealjs'
      //    configuration.
      // 3. convertMarkdownToSlides converts all markdown into HTML.
      // 4. Control his handed over to revealjs to display the slides.
      return preProcessSlides(deck.getRevealElement()).then((metadata) => {
        this.marked = buildMarkedConfiguration(markedOptions);
        applyMetadata(metadata);
        return convertMarkdownToSlides(deck.getRevealElement(), this.marked);
      });
    },
  };
};

export default Plugin;
