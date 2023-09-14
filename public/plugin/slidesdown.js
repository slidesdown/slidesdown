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
  DOMPurify.sanitize(
    string,
    {
      ADD_TAGS: [
        "#comment", // comments are vital for configuring revealjs
        "foreignObject", // unfortunately some mermaid diagrams use it, despite being a potential security risk: https://github.com/cure53/DOMPurify/issues/469
      ],
      CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: (tagName) =>
          [
            "fa-i",
            "flex-box",
            "v-box",
            "h-box",
            "grid-box",
            "columns-2",
            "columns-3",
            "columns-4",
            "columns-5",
            "columns-6",
          ].includes(tagName),
        attributeNameCheck: (name) =>
          ["class", "styles", "style"].includes(name),
      },
    },
  );

const Plugin = () => {
  // The reveal.js instance this plugin is attached to
  let deck;

  /**
   * Retrieves the markdown contents of a slide section
   * element. Normalizes leading tabs/whitespace.
   */
  function getMarkdownFromSlide(section) {
    // console.log("getMarkdownFromSlide");
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
    // console.log("getForwardedAttributes");
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
    // console.log("getSlidifyOptions");
    options = options || {};
    options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
    options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
    options.attributes = options.attributes || "";

    return options;
  }

  /**
   * Helper function for constructing a markdown slide.
   */
  async function createMarkdownSlide(content, options) {
    // console.log("reateMarkdownSlide");
    options = getSlidifyOptions(options);

    const notesMatch = content.split(new RegExp(options.notesSeparator, "mgi"));

    if (notesMatch.length === 2) {
      content = notesMatch[0] + '<aside class="notes">' +
        SANITIZE(await this.marked.parse(notesMatch[1].trim())) + "</aside>";
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
    // console.log("slidify");
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
        // console.log("sectionStack array");
        const section_promises = [];
        sectionStack[i].forEach(function (child) {
          section_promises.push(
            createMarkdownSlide(child, options).then((content) =>
              "<section data-markdown>" + content +
              "</section>"
            ),
          );
        });
        promises.push(
          new Promise((resolve) => {
            Promise.all(section_promises).then((
              res,
            ) =>
              resolve(
                "<section " + options.attributes + ">" + res.join("") +
                  "</section>",
              )
            );
          }),
        );
      } else {
        // console.log("sectionStack misc");
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

  /**
   * Parse metadata from a string into an object.
   */
  function parseMetadata(metadataString) {
    // console.log("parseMetadata");
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
    // console.log("applyMetadata");
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
      "title": (title) => {
        document.title = title;
        document.documentElement.style.setProperty(
          "--slideshow-title",
          `"${title}"`,
        );
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
    // console.log("hideCustomControlsIfVisiblityChanges");
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
  async function processSlides(scope) {
    // console.log("processSlides");
    const externalPromises = [];

    [].slice.call(
      scope.querySelectorAll(
        "section[data-markdown]:not([data-markdown-parsed])",
      ),
    ).forEach(function (section, _i) {
      if (section.getAttribute("data-markdown").length) {
        const promise = loadExternalMarkdown(section).then(
          // Finished loading external file
          async function (xhr, _url) {
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
            section.outerHTML = await slidify(markdown, {
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
        );
        externalPromises.push(promise);
      } else {
        const promise = slidify(
          getMarkdownFromSlide(section, {
            separator: section.getAttribute("data-separator"),
            verticalSeparator: section.getAttribute("data-separator-vertical"),
            notesSeparator: section.getAttribute("data-separator-notes"),
            attributes: getForwardedAttributes(section),
          }).then((res) => {
            section.outerHTML = res;
          }),
        );
        externalPromises.push(promise);
      }
    });

    await Promise.all(externalPromises);
  }

  function loadExternalMarkdown(section) {
    // console.log("loadExternalMarkdown");
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
   * Check if a node value has the attributes pattern.
   * If yes, extract it and add that value as one or several attributes
   * to the target element.
   *
   * You need Cache Killer on Chrome to see the effect on any FOM transformation
   * directly on refresh (F5)
   * http://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development/7000899#answer-11786277
   */
  function addAttributeInElement(node, elementTarget, separator) {
    // console.log("addAttributeInElement");
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
    // console.log("addAttributes");
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
  function convertSlides(marked) {
    const sections = deck.getRevealElement().querySelectorAll(
      "[data-markdown]:not([data-markdown-parsed])",
    );

    let sectionNumber = 0;
    const promises = [];
    [].slice.call(sections).forEach((section) => {
      const parse = async function (section) {
        section.setAttribute("data-markdown-parsed", true);

        const notes = section.querySelector("aside.notes");
        const markdown = getMarkdownFromSlide(section);

        section.innerHTML = SANITIZE(await marked.parse(markdown));
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
      };
      promises.push(parse(section));
    });

    return Promise.all(promises);
  }

  function escapeForHTML(input) {
    // console.log("escapeForHTML");
    return input.replace(/([&<>'"])/g, (char) => HTML_ESCAPE_MAP[char]);
  }

  return {
    id: "markdown",

    /**
     * Starts processing and converting Markdown within the
     * current reveal.js deck.
     */
    init: function (reveal) {
      // console.log("init");
      deck = reveal;

      let { renderer, animateLists, ...markedOptions } =
        deck.getConfig().markdown || {};

      const defaultCodeHandler = (code, language) => {
        // console.log("defaultCodeHandler");
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

      const codeHandler = (code, language) => {
        // console.log("codeHandler", code, language);
        if (language === "mermaid") {
          // INFO: height and width are set to work around bug https://github.com/chartjs/Chart.js/issues/5805
          DIAGRAM_COUNTER += 1;
          return `<div data-mermaid-id="mermaid-${DIAGRAM_COUNTER}" data-mermaid="${
            btoa(code)
          }"></div>`;
        } else if (language === "chartjs") {
          // INFO: maybe set height and width are to work around bug https://github.com/chartjs/Chart.js/issues/5805
          return `<div><div style="display: flex; align-items: center; justify-content: center; position: relative; width: 100%; height: 100%;"><canvas data-chartjs=${
            btoa(code)
          }></canvas></div></div>`;
        } else if (
          language === "apexchart"
        ) {
          // INFO: height and width are set to work around bug https://github.com/chartjs/Chart.js/issues/5805
          return `<div data-apexchart=${btoa(code)}></div>`;
        } else {
          return DOMPurify.sanitize(defaultCodeHandler(code, language));
        }
      };

      return processSlides(deck.getRevealElement()).then(() => {
        // Marked options: https://marked.js.org/using_advanced#options
        if (!markedOptions.baseUrl) {
          marked.use(baseUrl(BASE_URL));
        } else {
          marked.use(baseUrl(markedOptions.baseUrl));
          delete markedOptions.baseUrl;
        }
        marked.use(gfmHeadingId());
        markedOptions.async = true;

        const markedConfig = {
          ...markedOptions,
          renderer: {
            code: (text, _lang, _escaped) => {
              // console.log("calling renderer", escaped, lang, text);
              return text;
            },
          },
          walkTokens: (token) => {
            if (token.type === "code") {
              token.text = codeHandler(token.text, token.lang);
            }
          },
        };
        if (animateLists === true) {
          markedConfig.renderer.listitem = (text) =>
            `<li class="fragment">${text}</li>`;
        }
        this.marked.use(markedConfig);
        return convertSlides(this.marked);
      });
    },

    marked: marked,
  };
};

export default Plugin;
