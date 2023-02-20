/*!
 * The reveal.js markdown plugin. Handles parsing of
 * markdown inside of presentations as well as loading
 * of external markdown documents.
 */

import { marked } from "marked";
// TODO: dynamicall import mermaid to only load it when it's needed
import { mermaid } from "mermaid";
// INFO: the esm import would be better so that a dynamic import could be
// performed .. but the plugin doesn't support this yet
import * as Chart from "chart"; // not used because it will set a global name

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

const Plugin = () => {
  // The reveal.js instance this plugin is attached to
  let deck;

  /**
   * Retrieves the markdown contents of a slide section
   * element. Normalizes leading tabs/whitespace.
   */
  function getMarkdownFromSlide(section) {
    // look for a <script> or <textarea data-template> wrapper
    const template = section.querySelector("[data-template]") ||
      section.querySelector("script");

    // strip leading whitespace so it isn't evaluated as code
    let text = (template || section).textContent;

    // restore script end tags
    text = text.replace(new RegExp(SCRIPT_END_PLACEHOLDER, "g"), "</script>");

    const leadingWs = text.match(/^\n?(\s*)/)[1].length,
      leadingTabs = text.match(/^\n?(\t*)/)[1].length;

    if (leadingTabs > 0) {
      text = text.replace(
        new RegExp("\\n?\\t{" + leadingTabs + "}", "g"),
        "\n",
      );
    } else if (leadingWs > 1) {
      text = text.replace(new RegExp("\\n? {" + leadingWs + "}", "g"), "\n");
    }

    return text;
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
   * Inspects the given options and fills out default
   * values for what's not defined.
   */
  function getSlidifyOptions(options) {
    options = options || {};
    options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
    options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
    options.attributes = options.attributes || "";

    return options;
  }

  /**
   * Helper function for constructing a markdown slide.
   */
  function createMarkdownSlide(content, options) {
    options = getSlidifyOptions(options);

    const notesMatch = content.split(new RegExp(options.notesSeparator, "mgi"));

    if (notesMatch.length === 2) {
      content = notesMatch[0] + '<aside class="notes">' +
        marked.parse(notesMatch[1].trim()) + "</aside>";
    }

    // prevent script end tags in the content from interfering
    // with parsing
    content = content.replace(/<\/script>/g, SCRIPT_END_PLACEHOLDER);

    return '<script type="text/template">' + content + "</script>";
  }

  /**
   * Parses a data string into multiple slides based
   * on the passed in separator arguments.
   */
  function slidify(markdown, options) {
    options = getSlidifyOptions(options);

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

    let markdownSections = "";

    // flatten the hierarchical stack, and insert <section data-markdown> tags
    for (let i = 0, len = sectionStack.length; i < len; i++) {
      // vertical
      if (sectionStack[i] instanceof Array) {
        markdownSections += "<section " + options.attributes + ">";

        sectionStack[i].forEach(function (child) {
          markdownSections += "<section data-markdown>" +
            createMarkdownSlide(child, options) + "</section>";
        });

        markdownSections += "</section>";
      } else {
        markdownSections += "<section " + options.attributes +
          " data-markdown>" + createMarkdownSlide(sectionStack[i], options) +
          "</section>";
      }
    }

    return markdownSections;
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
   * Apply metadta to presentation.
   */
  function applyMetadata(metadata) {
    const defaultMetadata = {
      "theme": "white",
      "highlight-theme": "monokai",
      "favicon": "/favicon.svg",
      "fontawesomePro": true,
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
    };
    const defaultURLToStylesheet = (defaultURL) => (word) => {
      if (/^[\w0-9_-]+$/.exec(word)) {
        return loadStylesheet(`${defaultURL}/${word}.css`);
      } else {
        return loadStylesheet(word);
      }
    };
    const applyFunctions = {
      "title": (title) => {
        document.title = title;
      },
      "favicon": loadLink("icon"),
      "theme": defaultURLToStylesheet("/vendor/reveal.js/dist/theme"),
      "highlight-theme": defaultURLToStylesheet(
        "/vendor/highlight.js",
      ),
      "addiontional-stylesheet": loadStylesheet,
      "author": addMeta("author"),
      "date": addMeta("dcterms.date"),
      "keywords": addMeta("keywords"),
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
        return value;
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
        if (fn) {
          fn(mergedMetadata[k]);
        } else {
          if (k in revealjsConfig) {
            revealjsNewConfig[k] = mergedMetadata[k];
          } else {
            console.error(`Ignoring unknown option: ${k}`);
          }
        }
      });
    if (Object.keys(revealjsNewConfig).length > 0) {
      Reveal.configure(revealjsNewConfig);
    }
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

  /**
   * Parses any current data-markdown slides, splits
   * multi-slide markdown into separate sections and
   * handles loading of external markdown.
   */
  function processSlides(scope) {
    return new Promise(function (resolve) {
      const externalPromises = [];

      [].slice.call(
        scope.querySelectorAll(
          "section[data-markdown]:not([data-markdown-parsed])",
        ),
      ).forEach(function (section, _i) {
        if (section.getAttribute("data-markdown").length) {
          externalPromises.push(
            loadExternalMarkdown(section).then(
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
                  // ensuere there's a trailing slash otherwish markered
                  // interprets it differently
                  BASE_URL = base_url.toString() + "/";
                }
                let markdown = xhr.responseText;
                let metadata = {};
                if (section.getAttribute("data-load-metadata") !== null) {
                  const metadataRegExp =
                    /^---\r?\n(?<metadata>(?:#.*|[a-zA-Z0-9-]+:\s.*|\r?\n)*)---(?:\r?\n)?/g;
                  const metadataMatch = metadataRegExp.exec(markdown);
                  if (metadataMatch) {
                    // TODO: a context element would be helpful to be able to
                    // properly set the metadata
                    if (metadataMatch.groups.metadata) {
                      metadata = parseMetadata(metadataMatch.groups.metadata);
                    }
                    markdown = markdown.substring(metadataRegExp.lastIndex);
                  }
                }
                applyMetadata(metadata);
                Reveal.on("ready", (_event) => {
                  hideCustomControlsIfVisiblityChanges(
                    document.querySelector(".controls"),
                  );
                });
                section.outerHTML = slidify(markdown, {
                  separator: section.getAttribute("data-separator"),
                  verticalSeparator: section.getAttribute(
                    "data-separator-vertical",
                  ),
                  notesSeparator: section.getAttribute("data-separator-notes"),
                  attributes: getForwardedAttributes(section),
                });
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
            ),
          );
        } else {
          section.outerHTML = slidify(getMarkdownFromSlide(section), {
            separator: section.getAttribute("data-separator"),
            verticalSeparator: section.getAttribute("data-separator-vertical"),
            notesSeparator: section.getAttribute("data-separator-notes"),
            attributes: getForwardedAttributes(section),
          });
        }
      });

      Promise.all(externalPromises).then(resolve);
    });
  }

  function loadExternalMarkdown(section) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest(),
        url = section.getAttribute("data-markdown");

      const datacharset = section.getAttribute("data-charset");

      // see https://developer.mozilla.org/en-US/docs/Web/API/element.getAttribute#Notes
      if (datacharset != null && datacharset != "") {
        xhr.overrideMimeType("text/html; charset=" + datacharset);
      }

      xhr.onreadystatechange = function (_section, xhr) {
        if (xhr.readyState === 4) {
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
   * Check if a node value has the attributes pattern.
   * If yes, extract it and add that value as one or several attributes
   * to the target element.
   *
   * You need Cache Killer on Chrome to see the effect on any FOM transformation
   * directly on refresh (F5)
   * http://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development/7000899#answer-11786277
   */
  function addAttributeInElement(node, elementTarget, separator) {
    const mardownClassesInElementsRegex = new RegExp(separator, "mg");
    const mardownClassRegex = new RegExp(
      '([^"= ]+?)="([^"]+?)"|(data-[^"= ]+?)(?=[" ])',
      "mg",
    );
    let nodeValue = node.nodeValue;
    let matches,
      matchesClass;
    if ((matches = mardownClassesInElementsRegex.exec(nodeValue)) !== null) {
      const classes = matches[1];
      nodeValue = nodeValue.substring(0, matches.index) +
        nodeValue.substring(mardownClassesInElementsRegex.lastIndex);
      node.nodeValue = nodeValue;
      while ((matchesClass = mardownClassRegex.exec(classes)) !== null) {
        if (matchesClass[2]) {
          elementTarget.setAttribute(matchesClass[1], matchesClass[2]);
        } else {
          elementTarget.setAttribute(matchesClass[3], "");
        }
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
    if (
      element != null && element.childNodes != undefined &&
      element.childNodes.length > 0
    ) {
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
        ) == false
      ) {
        addAttributeInElement(element, section, separatorSectionAttributes);
      }
    }
  }

  /**
   * Converts any current data-markdown slides in the
   * DOM to HTML.
   */
  function convertSlides() {
    const sections = deck.getRevealElement().querySelectorAll(
      "[data-markdown]:not([data-markdown-parsed])",
    );

    let sectionNumber = 0;
    [].slice.call(sections).forEach(function (section) {
      section.setAttribute("data-markdown-parsed", true);

      const notes = section.querySelector("aside.notes");
      const markdown = getMarkdownFromSlide(section);

      section.innerHTML = marked.parse(markdown);
      const firstChild = section.firstElementChild;
      if (firstChild && firstChild.id !== "") {
        section.id = firstChild.id;
        firstChild.id = "";
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
    });

    return Promise.resolve();
  }

  function escapeForHTML(input) {
    return input.replace(/([&<>'"])/g, (char) => HTML_ESCAPE_MAP[char]);
  }

  return {
    id: "markdown",

    /**
     * Starts processing and converting Markdown within the
     * current reveal.js deck.
     */
    init: function (reveal) {
      deck = reveal;

      let { renderer, animateLists, ...markedOptions } =
        deck.getConfig().markdown || {};

      if (!renderer) {
        renderer = new marked.Renderer();

        const defaultCode = (code, language) => {
          // Off by default
          let lineNumbers = "";

          // Users can opt in to show line numbers and highlight
          // specific lines.
          // ```javascript []        show line numbers
          // ```javascript [1,4-8]   highlights lines 1 and 4-8
          if (CODE_LINE_NUMBER_REGEX.test(language)) {
            lineNumbers = language.match(CODE_LINE_NUMBER_REGEX)[1].trim();
            lineNumbers = `data-line-numbers="${lineNumbers}"`;
            language = language.replace(CODE_LINE_NUMBER_REGEX, "").trim();
          }

          // Escape before this gets injected into the DOM to
          // avoid having the HTML parser alter our code before
          // highlight.js is able to read it
          code = escapeForHTML(code);

          return `<pre><code ${lineNumbers} class="${language}">${code}</code></pre>`;
        };
        renderer.code = function (code, language) {
          if (language === "mermaid") {
            // return `<pre class="mermaid">\n${code}\n</pre>`;
            DIAGRAM_COUNTER += 1;
            return mermaid.mermaidAPI.render(
              `mermaid${DIAGRAM_COUNTER}`,
              code,
            );
          } else if (
            [
              "bar",
              "line",
              "bubble",
              "doughnut",
              "pie",
              "polarArea",
              "radar",
              "scatter",
            ].indexOf(language) >= 0
          ) {
            // INFO: height and width are set to work around bug https://github.com/chartjs/Chart.js/issues/5805
            return `<div><canvas data-chart="${language}">
              <!--
              ${code}
              --></canvas></div>`;
          } else {
            return defaultCode(code, language);
          }
        };
      }

      if (animateLists === true) {
        renderer.listitem = (text) => `<li class="fragment">${text}</li>`;
      }

      return processSlides(deck.getRevealElement()).then((slides) => {
        // Marked options: https://marked.js.org/using_advanced#options
        if (!markedOptions.baseUrl) {
          markedOptions.baseUrl = BASE_URL;
        }
        // TODO: add html sanatizer, see https://marked.js.org/using_advanced#options
        marked.setOptions({
          renderer,
          ...markedOptions,
        });
        return convertSlides(slides);
      });
    },

    // TODO: Do these belong in the API?
    processSlides: processSlides,
    convertSlides: convertSlides,
    slidify: slidify,
    marked: marked,
  };
};

export default Plugin;
