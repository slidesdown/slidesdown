// @vitest-environment jsdom

import { assert, expect, test, beforeEach, describe } from 'vitest'
import { buildMarkedConfiguration, convertMarkdownToSlides, preProcessSlides } from './slidesdown'

const markedOptions = { baseUrl: "https://example.com/slides/" }
const marked = buildMarkedConfiguration({ ...markedOptions })

// Surrounding DIV element that wraps the SECTION tag with the markdown configuration.
let DIV;

// Initial section element that holds the markdown data and configuration options.
// WARNING: Don't use this object after calling preProcessSlides since it will not be attached to the DOM anymore!
let SECTION;

beforeEach(() => {
  // initialize the DOM with a two tags, div > section, and the settings for parsing markdown into slides
  document.body.replaceChildren();
  DIV = document.createElement("DIV")
  SECTION = document.createElement("section")
  SECTION.setAttribute("data-markdown", "<<load-plain-markdown>>")
  SECTION.setAttribute("data-separator", "^(#{1,2} |---$)")
  SECTION.setAttribute("data-separator-vertical", "^(#{3} |\\|\\|\\|$)")
  DIV.appendChild(SECTION)
  document.body.appendChild(DIV)
})

describe('Basic parsing', () => {
  test('When a section with plain markdown data is added, then the section will be replaced with a new section and the markdown will be added inside a script tag.', async () => {
    SECTION.setAttribute("data-markdown-plain", "# hello")
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    expect(DIV.children[0].children[0].textContent).toStrictEqual("# hello")
  })

  test('When a script tag is added inside markdown, then the closing script tag is deleted to prevent the script from running.', async () => {
    SECTION.setAttribute("data-markdown-plain", "<script>alert('hacked')</script>")
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    expect(DIV.children[0].children[0].textContent).toStrictEqual("<script>alert('hacked')__SCRIPT_END__")
  })

  test('When a some other tag is added inside markdown, then it is passed through without alteration.', async () => {
    SECTION.setAttribute("data-markdown-plain", "<sometag>alert('hacked')</sometag>")
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    expect(DIV.children[0].children[0].textContent).toStrictEqual("<sometag>alert('hacked')</sometag>")
  })

  test('When markdown is provided, then it iss converted into HTML.', async () => {
    SECTION.setAttribute("data-markdown-plain", "# hello")
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(1)
    expect(section.children[0].tagName).toBe("H1")
    expect(section.children[0].textContent).toBe("hello")
  })

  test('When notes are specified, then they are placed in an aside tag.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "",
      "world",
      "",
      "notes:",
      "",
      "say hello world",
      "",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(3)
    expect(section.children[2].tagName).toBe("ASIDE")
    expect(section.children[2].className).toBe("notes")
    expect(section.children[2].children[0].textContent).toBe("say hello world")
  })

  test('When a horizontal separator is in the markdown, then the following content is placed on a separate slide.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "---",
      "world",
      "",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(2)
    const section = DIV.children[1];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(1)
    expect(section.children[0].tagName).toBe("P")
    expect(section.children[0].textContent).toBe("world")
  })

  test('When a level 2 heading is in the markdown, then the following content is placed on a separate slide.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "## hello2",
      "world",
      "",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(2)
    const section = DIV.children[1];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[0].tagName).toBe("H2")
    expect(section.children[0].textContent).toBe("hello2")
    expect(section.children[1].tagName).toBe("P")
    expect(section.children[1].textContent).toBe("world")
  })

  test('When a vertical separator is in the markdown, then the following content is placed on a separate nested slide.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "|||",
      "world",
      "",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.tagName).toBe("SECTION")
    expect(section.children[0].tagName).toBe("SECTION")
    expect(section.children[1].tagName).toBe("SECTION")
    expect(section.children[1].children.length).toBe(1)
    expect(section.children[1].children[0].tagName).toBe("P")
    expect(section.children[1].children[0].textContent).toBe("world")
  })

  test('When a level 3 heading is in the markdown, then the following content is placed on a separate nested slide.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "### hello3",
      "world",
      "",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.tagName).toBe("SECTION")
    expect(section.children[0].tagName).toBe("SECTION")
    expect(section.children[1].tagName).toBe("SECTION")
    expect(section.children[1].children.length).toBe(2)
    expect(section.children[1].children[0].tagName).toBe("H3")
    expect(section.children[1].children[0].textContent).toBe("hello3")
    expect(section.children[1].children[1].tagName).toBe("P")
    expect(section.children[1].children[1].textContent).toBe("world")
  })

  test('When a level 4 heading is in the markdown, then the following content is placed on the same slide.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "#### hello4",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.tagName).toBe("SECTION")
    expect(section.children[0].tagName).toBe("H1")
    expect(section.children[1].tagName).toBe("H4")
    expect(section.children[1].textContent).toBe("hello4")
  })

  test('When code with a langugage is provided, then it is wrapped in a code tag and the language is stored as a class.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "```yaml",
      "code",
      "```",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("PRE")
    expect(section.children[1].children.length).toBe(1)
    expect(section.children[1].children[0].tagName).toBe("CODE")
    expect(section.children[1].children[0].className).toBe("yaml")
  })
})

describe('Relative URL rewriting', () => {
  test('When a relative image reference is provided as markdown, then it is made absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "![](./test.png)",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("P")
    expect(section.children[1].children[0].tagName).toBe("IMG")
    expect(section.children[1].children[0].src).toBe(`${markedOptions.baseUrl}test.png`)
  })

  test('When a relative image reference within double quotes is provided, then it is made absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      '<img src="./test.png" />',
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("IMG")
    expect(section.children[1].src).toBe(`${markedOptions.baseUrl}test.png`)
  })

  test('When a relative image reference within single quotes is provided, then it is made absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "<img src='./test.png' />",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("IMG")
    expect(section.children[1].src).toBe(`${markedOptions.baseUrl}test.png`)
  })

  test('When an absolute image reference is provided, then it is stays absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      '<img src="https://test.example.com/test.png" />',
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("IMG")
    expect(section.children[1].src).toBe("https://test.example.com/test.png")
  })

  test('When an absolute image reference is provided in markdown, then it is stays absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "![](https://test.example.com/test.png)",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("P")
    expect(section.children[1].children[0].tagName).toBe("IMG")
    expect(section.children[1].children[0].src).toBe("https://test.example.com/test.png")
  })

  test('When a relative anchor reference is provided as markdown, then it is made absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "[](./test.png)",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("P")
    expect(section.children[1].children[0].tagName).toBe("A")
    expect(section.children[1].children[0].href).toBe(`${markedOptions.baseUrl}test.png`)
  })

  test('When a relative anchor reference within double quotes is provided, then it is made absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      '<a href="./test.png">a</a>',
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("P")
    expect(section.children[1].children[0].tagName).toBe("A")
    expect(section.children[1].children[0].href).toBe(`${markedOptions.baseUrl}test.png`)
  })

  test('When a relative anchore reference within single quotes is provided, then it is made absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "<a href='./test.png'>a</a>",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("P")
    expect(section.children[1].children[0].tagName).toBe("A")
    expect(section.children[1].children[0].href).toBe(`${markedOptions.baseUrl}test.png`)
  })

  test('When an absolute image reference is provided, then it is stays absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      '<a href="https://test.example.com/test.png">a</a>',
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("P")
    expect(section.children[1].children[0].tagName).toBe("A")
    expect(section.children[1].children[0].href).toBe("https://test.example.com/test.png")
  })

  test('When an absolute anchor reference is provided in markdown, then it is stays absolute.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      "[](https://test.example.com/test.png)",
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("P")
    expect(section.children[1].children[0].tagName).toBe("A")
    expect(section.children[1].children[0].href).toBe("https://test.example.com/test.png")
  })
})

describe('Security', () => {
  test('When a dangerous attribute is provided, then it is removed.', async () => {
    SECTION.setAttribute("data-markdown-plain", [
      "# hello",
      '<img src="https://test.example.com/test.png" onclick="alert(1)" onClick="alert(1)" />',
    ].join("\n"))
    const metadata = await preProcessSlides(DIV)
    expect(metadata).toStrictEqual({})
    await convertMarkdownToSlides(DIV, marked)
    expect(DIV.children.length).toBe(1)
    const section = DIV.children[0];
    assert.instanceOf(section, HTMLElement, "we have an HTML element");
    expect(section.children.length).toBe(2)
    expect(section.children[1].tagName).toBe("IMG")
    expect(section.children[1].src).toBe("https://test.example.com/test.png")
    expect(section.children[1].getAttribute("onclick")).toBe(null)
    expect(section.children[1].getAttribute("onClick")).toBe(null)
  })
})
