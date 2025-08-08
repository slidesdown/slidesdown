// @vitest-environment jsdom

import { assert, beforeEach, describe, expect, test } from "vitest";
import {
  buildMarkedConfiguration,
  convertMarkdownToSlides,
  preProcessSlides,
} from "./slidesdown.js";

const markedOptions = { baseUrl: "https://example.com/slides/" };
const marked = buildMarkedConfiguration({ ...markedOptions });

// Surrounding DIV element that wraps the SECTION tag with the markdown configuration.
let DIV;

// Initial section element that holds the markdown data and configuration options.
// WARNING: Don't use this object after calling preProcessSlides since it will not be attached to the DOM anymore!
let SECTION;

beforeEach(() => {
  // initialize the DOM with a two tags, div > section, and the settings for parsing markdown into slides
  document.body.replaceChildren();
  DIV = document.createElement("DIV");
  SECTION = document.createElement("section");
  SECTION.setAttribute("data-markdown", "<<load-plain-markdown>>");
  SECTION.setAttribute("data-separator", "^(#{1,2} |---$)");
  SECTION.setAttribute("data-separator-vertical", "^(#{3} |\\|\\|\\|$)");
  DIV.appendChild(SECTION);
  document.body.appendChild(DIV);
});

describe("Basic parsing", () => {
  test("When a section with plain markdown data is added, then the section will be replaced with a new section and the markdown will be added inside a script tag.", async () => {
    SECTION.setAttribute("data-markdown-plain", "# hello");
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    expect(DIV.children[0].children[0].textContent).toStrictEqual("# hello");
  });

  test("When a script tag is added inside markdown, then the closing script tag is deleted to prevent the script from running.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      "<script>alert('hacked')</script>",
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    expect(DIV.children[0].children[0].textContent).toStrictEqual(
      "<script>alert('hacked')__SCRIPT_END__",
    );
  });

  test("When a some other tag is added inside markdown, then it is passed through without alteration.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      "<sometag>alert('hacked')</sometag>",
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    expect(DIV.children[0].children[0].textContent).toStrictEqual(
      "<sometag>alert('hacked')</sometag>",
    );
  });

  test("When markdown is provided, then it iss converted into HTML.", async () => {
    SECTION.setAttribute("data-markdown-plain", "# hello");
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(1);
    expect(section.children[0].tagName).toBe("H1");
    expect(section.children[0].textContent).toBe("hello");
  });

  test("When notes are specified, then they are placed in an aside tag.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "",
        "world",
        "",
        "notes:",
        "",
        "say hello world",
        "",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(3);
    expect(section.children[2].tagName).toBe("ASIDE");
    expect(section.children[2].className).toBe("notes");
    expect(section.children[2].children[0].textContent).toBe("say hello world");
  });

  test("When a horizontal separator is in the markdown, then the following content is placed on a separate slide.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "---",
        "world",
        "",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(2);
    const section = DIV.children[1];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(1);
    expect(section.children[0].tagName).toBe("P");
    expect(section.children[0].textContent).toBe("world");
  });

  test("When an element and slide comment, then it adds attributes to the respective HTML elements.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<!-- .slide: class="test-slide" style="color: red;" data-visibility="hidden" -->',
        '<!-- .element:  style="color: green;" class="test-element" -->',
        "- list element",
        '- list element 2 <!-- .element: un-cloak="" class="test-li"  style="color: orange;"-->',
        '<!-- .element: class="test-ul"  style="color: blue;"-->',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.tagName).toBe("SECTION");
    expect(section.getAttributeNames()).toEqual([
      "data-markdown",
      "data-markdown-parsed",
      "id",
      "class",
      "style",
      "data-visibility",
    ]);
    expect(section.className).toBe("test-slide");
    expect(section.style.color).toBe("red");
    expect(section.getAttribute("data-visibility")).toBe("hidden");
    expect(section.children.length).toBe(2);
    expect(section.children[0].tagName).toBe("H1");
    expect(section.children[0].getAttributeNames()).toEqual(["style", "class"]);
    expect(section.children[0].className).toBe("test-element");
    expect(section.children[0].style.color).toBe("green");
    expect(section.children[1].tagName).toBe("UL");
    expect(section.children[1].className).toBe("test-ul");
    expect(section.children[1].style.color).toBe("blue");
    expect(section.children[1].children.length).toBe(2);
    expect(section.children[1].children[1].getAttributeNames()).toEqual([
      "un-cloak",
      "class",
      "style",
    ]);
    expect(section.children[1].children[1].tagName).toBe("LI");
    expect(section.children[1].children[1].className).toBe("test-li");
    expect(section.children[1].children[1].style.color).toBe("orange");
  });

  test("When a level 2 heading is in the markdown, then the following content is placed on a separate slide.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "## hello2",
        "world",
        "",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(2);
    const section = DIV.children[1];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[0].tagName).toBe("H2");
    expect(section.children[0].textContent).toBe("hello2");
    expect(section.children[1].tagName).toBe("P");
    expect(section.children[1].textContent).toBe("world");
  });

  test("When a vertical separator is in the markdown, then the following content is placed on a separate nested slide.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "|||",
        "world",
        "",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.tagName).toBe("SECTION");
    expect(section.children[0].tagName).toBe("SECTION");
    expect(section.children[1].tagName).toBe("SECTION");
    expect(section.children[1].children.length).toBe(1);
    expect(section.children[1].children[0].tagName).toBe("P");
    expect(section.children[1].children[0].textContent).toBe("world");
  });

  test("When a level 3 heading is in the markdown, then the following content is placed on a separate nested slide.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "### hello3",
        "world",
        "",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.tagName).toBe("SECTION");
    expect(section.children[0].tagName).toBe("SECTION");
    expect(section.children[1].tagName).toBe("SECTION");
    expect(section.children[1].children.length).toBe(2);
    expect(section.children[1].children[0].tagName).toBe("H3");
    expect(section.children[1].children[0].textContent).toBe("hello3");
    expect(section.children[1].children[1].tagName).toBe("P");
    expect(section.children[1].children[1].textContent).toBe("world");
  });

  test("When a level 4 heading is in the markdown, then the following content is placed on the same slide.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "#### hello4",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.tagName).toBe("SECTION");
    expect(section.children[0].tagName).toBe("H1");
    expect(section.children[1].tagName).toBe("H4");
    expect(section.children[1].textContent).toBe("hello4");
  });

  test("When code with a langugage is provided, then it is wrapped in a code tag and the language is stored as a class.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "```yaml",
        "code",
        "```",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("PRE");
    expect(section.children[1].children.length).toBe(1);
    expect(section.children[1].children[0].tagName).toBe("CODE");
    expect(section.children[1].children[0].className).toBe("yaml");
  });
});

describe("Relative URL rewriting", () => {
  test("When a relative image reference is provided as markdown, then it is made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "![](./test.png)",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("P");
    expect(section.children[1].children[0].tagName).toBe("IMG");
    expect(section.children[1].children[0].src).toBe(
      `${markedOptions.baseUrl}test.png`,
    );
  });

  test("When a relative image reference within double quotes is provided, then it is made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<img src="./test.png" />',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("IMG");
    expect(section.children[1].src).toBe(`${markedOptions.baseUrl}test.png`);
  });

  test("When a relative image reference within single quotes is provided, then it is made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "<img src='./test.png' />",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("IMG");
    expect(section.children[1].src).toBe(`${markedOptions.baseUrl}test.png`);
  });

  test("When a relative image reference without a leading ./ is provided, then it is made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "<img src='test.png' />",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("IMG");
    expect(section.children[1].src).toBe(`${markedOptions.baseUrl}test.png`);
  });

  test("When a relative image and data-preview-image reference is provided, then they are made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "<img src='test.png' data-preview-image='test-large.png' />",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("IMG");
    expect(section.children[1].src).toBe(`${markedOptions.baseUrl}test.png`);
    expect(section.children[1].getAttribute("data-preview-image")).toBe(
      `${markedOptions.baseUrl}test-large.png`,
    );
  });
  test("When an absolute image reference is provided, then it is stays absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<img src="https://test.example.com/test.png" />',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("IMG");
    expect(section.children[1].src).toBe("https://test.example.com/test.png");
  });

  test("When an absolute image reference is provided in markdown, then it is stays absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "![](https://test.example.com/test.png)",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("P");
    expect(section.children[1].children[0].tagName).toBe("IMG");
    expect(section.children[1].children[0].src).toBe(
      "https://test.example.com/test.png",
    );
  });

  test("When a relative anchor reference is provided as markdown, then it is made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "[](./test.png)",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("P");
    expect(section.children[1].children[0].tagName).toBe("A");
    expect(section.children[1].children[0].href).toBe(
      `${markedOptions.baseUrl}test.png`,
    );
  });

  test("When a relative anchor reference within double quotes is provided, then it is made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<a href="./test.png">a</a>',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("P");
    expect(section.children[1].children[0].tagName).toBe("A");
    expect(section.children[1].children[0].href).toBe(
      `${markedOptions.baseUrl}test.png`,
    );
  });

  test("When a relative anchore reference within single quotes is provided, then it is made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "<a href='./test.png'>a</a>",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("P");
    expect(section.children[1].children[0].tagName).toBe("A");
    expect(section.children[1].children[0].href).toBe(
      `${markedOptions.baseUrl}test.png`,
    );
  });

  test("When an absolute image reference is provided, then it is stays absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<a href="https://test.example.com/test.png">a</a>',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("P");
    expect(section.children[1].children[0].tagName).toBe("A");
    expect(section.children[1].children[0].href).toBe(
      "https://test.example.com/test.png",
    );
  });

  test("When an absolute anchor reference is provided in markdown, then it is stays absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        "[](https://test.example.com/test.png)",
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("P");
    expect(section.children[1].children[0].tagName).toBe("A");
    expect(section.children[1].children[0].href).toBe(
      "https://test.example.com/test.png",
    );
  });

  test("When a relative path to a background image is set via data-background-image, then it is made absolute.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<!-- .slide: data-background-image="./test.png" class="test" -->',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.className).toBe("test");
    expect(section.getAttribute("data-background-image")).toBe(
      `${markedOptions.baseUrl}test.png`,
    );
  });

  test("When a URL is to provided, it is never rebased", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<img src="https://test.example.com/test.png" />',
        '<a href="https://test.example.com/test.png">link</a>',
        '<a href="tel:0123458789">tel</a>',
        '<a href="mailto:mail@example.com">mail</a>',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    expect(section.children.length).toBe(5);
    expect(section.children[1].getAttribute("src")).toBe(
      "https://test.example.com/test.png",
    );
    expect(section.children[2].getAttribute("href")).toBe(
      "https://test.example.com/test.png",
    );
    expect(section.children[3].getAttribute("href")).toBe("tel:0123458789");
    expect(section.children[4].getAttribute("href")).toBe(
      "mailto:mail@example.com",
    );
  });
});

describe("Security", () => {
  test("When a dangerous attribute is provided, then it is removed.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<img src="https://test.example.com/test.png" onclick="alert(1)" onClick="alert(1)" />',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2);
    expect(section.children[1].tagName).toBe("IMG");
    expect(section.children[1].src).toBe("https://test.example.com/test.png");
    expect(section.children[1].getAttribute("onclick")).toBe(null);
  });

  test("When a dangerous attribute is provided inside an element comment, then it is removed.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<!-- .element: class="test" onclick="alert(\'hacked\')" -->',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(1);
    expect(section.tagName).toBe("SECTION");
    expect(section.className).toBe("");
    expect(section.getAttribute("onclick")).toBe(null);
    expect(section.children[0].tagName).toBe("H1");
    expect(section.children[0].className).toBe("test");
    expect(section.children[0].getAttribute("onclick")).toBe(null);
  });

  test("When a dangerous attribute is provided inside a slide comment, then it is removed.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<!-- .slide: class="test" onclick="alert(\'hacked\')" -->',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(1);
    expect(section.tagName).toBe("SECTION");
    expect(section.className).toBe("test");
    expect(section.getAttribute("onclick")).toBe(null);
    expect(section.children[0].tagName).toBe("H1");
    expect(section.children[0].className).toBe("");
    expect(section.children[0].getAttribute("onclick")).toBe(null);
  });

  test("When a dangerous attribute is provided inside an element and slide comment, then it is removed.", async () => {
    SECTION.setAttribute(
      "data-markdown-plain",
      [
        "# hello",
        '<!-- .slide: class="test-slide" onclick="alert(\'hacked-slide\')" -->',
        '<!-- .element: class="test-element" onclick="alert(\'hacked-element\')" -->',
      ].join("\n"),
    );
    const metadata = await preProcessSlides(DIV);
    expect(metadata).toStrictEqual({});
    await convertMarkdownToSlides(DIV, marked);
    expect(DIV.children.length).toBe(1);
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(1);
    expect(section.tagName).toBe("SECTION");
    expect(section.className).toBe("test-slide");
    expect(section.getAttribute("onclick")).toBe(null);
    expect(section.children[0].tagName).toBe("H1");
    expect(section.children[0].className).toBe("test-element");
    expect(section.children[0].getAttribute("onclick")).toBe(null);
  });
});
