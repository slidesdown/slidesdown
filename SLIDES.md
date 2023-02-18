---
# Metadata about the presentation:
title: Slidesdown
author: Jan Christoph Ebersbach
date: 2023-01-20
keywords: slides slideshow slidesdown presentation presentations markup markdown revealjs fontawesome pdf

# Presentation settings:
# Theme, list of supported themes: https://github.com/slidesdown/slidesdown/tree/main/docs/reveal.js/dist/theme
theme: white
# Code highlighting theme, list of supported themes: https://github.com/slidesdown/slidesdown/tree/main/docs/reveal.js/plugin/highlight
highlight-theme: tokyo-night-dark
# Load font awesome pro icons (only works on domain slidesdown.github.io) free icons work everywhere. If both are enabled the pro icons are loaded
fontawesomePro: true
fontawesomeFree: false
# URL to favicon
favicon: /favicon.svg

# Show progress bar
progress: true
# Show controls
controls: true
# Center presentation
center: true
# Create separate pages for fragments
pdfSeparateFragments: false
# Full list of supported settings: https://revealjs.com/config/ or
# https://github.com/hakimel/reveal.js/blob/master/js/config.js
---

# <img src="/logo.svg" alt="logo" style="height: 0.7em; margin: 0" /> Slidesdown

> Slideshows as fast as you can type.
> <small>Created by <a href="mailto:jceb@e-jc.de">Jan Christoph Ebersbach</a>
> and powered by <a href="https://revealjs.com/">reveal.js</a></small>

## Hi!

Slidesdown makes it simple to quickly turning an idea into a beautiful
presentation. A [Markdown file](https://slidesdown.github.io/learn.html) is all
you need!

<!-- generated with
!deno run --unstable --allow-read --allow-write https://deno.land/x/remark_format_cli@v0.1.0/remark-format.js --maxdepth 2 %
-->

## Agenda

1. [Introduction](#introduction)
2. [See for yourself..](#see-for-yourself)
3. [Basics](#basics)
4. [Layouts](#layouts)
5. [Animations](#animations)
6. [Backgrounds](#backgrounds)
7. [Pictures and Icons](#pictures-and-icons)
8. [Advanced Formatting](#advanced-formatting)
9. [Charts](#charts)
10. [Diagrams](#diagrams)

## Introduction

### Features

- Setup: No installation
- Focus: Just write Markdown
- Sharable: [Create links](https://slidesdown.github.io/loader.html) to your
  slides
- Offline First:
  [CLI avaiable](https://github.com/slidesdown/slidesdown/blob/main/README.md) for
  offline presentations
- Professional: PDF export and Custom Themes
- Versionable: Store all files in `git`
- Charts and Diagrams: via [chart.js](https://www.chartjs.org/) and
  [mermaid.js](https://mermaid.js.org/)

### Learn how it works

<!-- - [Introduction video to slidesdown](https://youtu.be/ZNXvQGsk_wA) -->

- [Guide to Slidesdown](https://slidesdown.github.io/learn.html)
- Learn by example from other
  [presentations](https://github.com/slidesdown/slidesdown/blob/main/examples)

### Keyboard Shortcuts

- `<Space>` advances to next slide
- `<Shift-Space>` goes to previous slide
- `<f>` enters full-screen mode
- `<s>` shows speaker notes
- `<.>` pauses slideshow
- `<e>` toggles print view
- `<Esc>` toggles slide overview
- `<Alt-Left Mouse Button>` or `<Ctrl-Left Mouse Button>` zooms into slide

### Draw on Slides

![draw](./docs/figures/draw.png)

### Open Blackboard

![blackboard](./docs/figures/blackboard.png)

## See for yourself..

## Basics

### Headings

<columns-2>

<div>
  <h1>h1</h1>
  <h2>h2</h2>
  <h3>h3</h3>
</div>

```markdown
 # h1

 ## h2

 ### h3
```

</columns-2>

|||

<grid-box styles="grid-template: 'left' 'code' / 1fr">

Slide without heading.
<!-- .element: style="grid-area: left;" -->

```markdown
 <!-- Horizontal slide -->
 ---
 content

 <!-- Vertical slide -->
 |||
 content
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### Next comes a hidden slide

<grid-box styles="grid-template: 'left' 'code' / 1fr">

Can you see it?
<!-- .element: style="grid-area: left;" -->

```markdown
 ### Hidden slide

<!-- .slide: data-visibility="hidden" -->
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### Hidden slide

<!-- .slide: data-visibility="hidden" -->

### Text formatting

<grid-box styles="grid-template: 'left' 'code' / 1fr">

Regluar, _italic_, **bold**, and <u>underlined</u>.
<!-- .element: style="grid-area: left;" -->

```markdown
Regluar, _italic_, **bold**, and <u>underlined</u>.
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### Unordered List

<grid-box styles="grid-template: 'left' 'code' / 1fr">

- Item 1
- Item 2
- Item 3
<!-- .element: style="grid-area: left;" -->

```markdown
- Item 1
- Item 2
- Item 3
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### Ordered List

<grid-box styles="grid-template: 'left' 'code' / 1fr">

1. Item 1
2. Item 2
3. Item 3
<!-- .element: style="grid-area: left;" -->

```markdown
1. Item 1
2. Item 2
3. Item 3
```
<!-- .element: style="grid-area: code;" -->

### Links

<grid-box styles="grid-template: 'left right' 'code code' / 1fr 1fr">

[Text link](https://github.com/slidesdown/slidesdown)
<!-- .element: style="grid-area: left;" -->

<v-box  style="grid-area: right;">
<figure>

[![A picture](https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640) <!-- .element: style="width: 30%" -->](https://unsplash.com/photos/x9yfTxHpj5w)
<figcaption>Picture link</figcaption>
</figure>
</v-box>

```markdown
[Text link](https://github.com/slidesdown/slidesdown)

Picture link

[![A picture](https://...)](https://...)
```
<!-- .element: style="grid-area: code;" -->

</grid-box>

### Quotes

<grid-box styles="grid-template: 'left' 'code' / 1fr">

> A famous quote
<!-- .element: style="grid-area: left;" -->

```markdown
> A famous quote
```
<!-- .element: style="grid-area: code;" -->

</grid-box>

### Code Highlighting

<grid-box styles="grid-template: 'left' 'code' / 1fr">

```javascript
function hello(msg) {
  alert(`Hello ${msg}`);
}

hello("world!");
```
<!-- .element: style="grid-area: left;" -->

```markdown
 ` ``javascript
 function hello(msg) {
   alert(`Hello ${msg}`);
 }

 hello("world!");
 ` ``
```
<!-- .element: style="grid-area: code;" -->

</grid-box>

### Code Highlighting with highlighted Line

<grid-box styles="grid-template: 'left' 'code' / 1fr">

```javascript[2]
function hello(msg) {
  alert(`Hello ${msg}`);
}

hello("world!");
```
<!-- .element: style="grid-area: left;" -->

```markdown
 ` ``javascript[2]
 function hello(msg) {
   alert(`Hello ${msg}`);
 }

 hello("world!");
 ` ``
```
<!-- .element: style="grid-area: code;" -->

</grid-box>

### Math formulas

<grid-box styles="grid-template: 'left' 'code' / 1fr">

<article>

`$$ \sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6} $$`

`$$ e^{\pi i}=-1 $$`
</article>
<!-- .element: style="grid-area: left;" -->

```markdown
`$$ \sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6} $$`

`$$ e^{\pi i}=-1 $$`
```
<!-- .element: style="grid-area: code;" -->

</grid-box>


### Table

<grid-box styles="grid-template: 'left' 'code' / 1fr">

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| column 3 is   | right-aligned | $1600 |
| column 2 is   |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

<!-- .element: style="grid-area: left;" -->

```markdown
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| column 3 is   | right-aligned | $1600 |
| column 2 is   |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```
<!-- .element: style="grid-area: code;" -->

</grid-box>

## Layouts

### 1 Column

<grid-box styles="grid-template: 'left code' / 2fr 3fr">

<article>
<v-box>
Shopping List

- Bread
- Milk
- Butter

</v-box>

<v-box>
Task List

- Sleep
- Eat
- Work

</v-box>

<v-box>
Bucket List

- ...

</v-box>
</article>

<!-- .element: style="grid-area: left;" -->

```markdown
<v-box>
Shopping List

- Bread
- Milk
- Butter

</v-box>

<v-box>
Task List

- Sleep
- Eat
- Work

</v-box>

<v-box>
Bucket List

- ...

</v-box>
```
<!-- .element: style="grid-area: code;" -->

</grid-box>

### 2 Columns

<grid-box styles="grid-template: 'left code' / 3fr 2fr">

<article>
<columns-2>
<v-box>
Shopping List

- Bread
- Milk
- Butter

</v-box>

<v-box>
Task List

- Sleep
- Eat
- Work

</v-box>

<v-box>
Bucket List

- ...

</v-box>
</columns-2>
</article>
<!-- .element: style="grid-area: left;" -->

```markdown
<columns-2>
<v-box>
Shopping List

- Bread
- Milk
- Butter

</v-box>

<v-box>
Task List

- Sleep
- Eat
- Work

</v-box>

<v-box>
Bucket List

- ...

</v-box>
</columns-2>
```
<!-- .element: style="grid-area: code;" -->

</grid-box>

### 3 Columns

<grid-box styles="grid-template: 'left' 'code' / 1fr">

<columns-3>
<v-box>
Shopping List

- Bread
- Milk
- Butter

</v-box>

<v-box>
Task List

- Sleep
- Eat
- Work

</v-box>

<v-box>
Bucket List

- NYC
- Tokyo
- Singapore

</v-box>
</columns-3>
<!-- .element: style="grid-area: left;" -->

```markdown
<columns-3>
...
</columns-3>
```
<!-- .element: style="grid-area: code;" -->

### Complex

<grid-box styles="grid-template: 'left code' / 50% 50%">
<grid-box styles="grid-template: 'header header header' 'sidebar main main' / 300px auto">

<v-box style="grid-area: header; background-color: green">
Shopping List

- Bread
- Milk
- Butter

</v-box>

<v-box style="grid-area:sidebar; background-color: blue">
Task List

- Sleep
- Eat
- Work

</v-box>

<v-box style="grid-area: main; background-color: red">
Bucket List

- NYC
- Tokyo
- Singapore

</v-box>
</grid-box>
<!-- .element: style="grid-area: left;" -->

```markdown
<grid-box styles="grid-template: 'header header header' 'sidebar main main' / 300px auto">

<v-box style="grid-area: header; background-color: green">
Shopping List

- Bread
- Milk
- Butter

</v-box>

<v-box style="grid-area:sidebar; background-color: blue">
Task List

- Sleep
- Eat
- Work

</v-box>

<v-box style="grid-area: main; background-color: red">
Bucket List

- NYC
- Tokyo
- Singapore

</v-box>
</grid-box>
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

## Animations

### Incremental Lists

<grid-box styles="grid-template: 'left' 'code' / 1fr">

- Item 1 <!-- .element: class="fragment" -->
- Item 2 <!-- .element: class="fragment" -->
- Item 3 <!-- .element: class="fragment" -->
<!-- .element: style="grid-area: left;" -->

```markdown
- Item 1 <!-- .element: class="fragment" -->
- Item 2 <!-- .element: class="fragment" -->
- Item 3 <!-- .element: class="fragment" -->
```
</grid-box>

### Fragments

<grid-box styles="grid-template: 'left' 'code' / 1fr">
<columns-2 styles="justify-items: center">
<img src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640" style="width: 30%;" />
<img src="https://images.unsplash.com/photo-1587613864521-9ef8dfe617cc?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640" style="width: 30%;" />
<!-- .element: class="fragment" -->
</columns-2>
<!-- .element: style="grid-area: left;" -->

```markdown
<columns-2 styles="justify-items: center">
<img src="https://..." />
<img src="https://..." />
<!-- .element: class="fragment" -->
</columns-2>
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### Animated List


<grid-box styles="grid-template: 'left' 'code' / 1fr">

<!-- .slide: data-auto-animate="1" -->

- Item 1
- Item 3
- Item 4

```markdown
<!-- .slide: data-auto-animate="1" -->

- Item 1
- Item 3
- Item 4
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### Animated List

<grid-box styles="grid-template: 'left' 'code' / 1fr">

<!-- .slide: data-auto-animate="1" -->

- Item 1
- Item 2
- Item 3
- Item 4

```markdown
<!-- .slide: data-auto-animate="1" -->

- Item 1
- Item 2
- Item 3
- Item 4
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### Animated Colored Boxes

<!-- .slide: data-auto-animate="1" -->

<columns-3>
<div data-id="1" class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>
<div data-id="2" class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div data-id="3" class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>
</columns-3>

### Animated Colored Boxes

<!-- .slide: data-auto-animate="1" -->

<columns-3>
<div data-id="3" class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>
<div data-id="2" class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div data-id="1" class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>
</columns-3>

## Backgrounds

### Slide with background image

<!-- .slide: data-background-image="https://images.unsplash.com/photo-1499892477393-f675706cbe6e?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640" -->

```markdown
<!-- .slide: data-background-image="https://..." -->
```

### Slide with colored background

<!-- .slide: data-background-color="#78a5e9" -->

```markdown
<!-- .slide: data-background-color="#78a5e9" -->
```

## Pictures and Icons

### Picture

<grid-box styles="grid-template: 'left' 'code' / 1fr">

![tennis](https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640)
<!-- .element: style="grid-area: left;" -->

```markdown
![tennis](https://...)
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### Framed Picture

<grid-box styles="grid-template: 'left' 'code' / 1fr">

<div style="display: flex; justify-content: center; grid-area: left;">

![fish](https://images.unsplash.com/photo-1555983341-918bc5fa8495?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640)
<!-- .element: class="r-frame" style="height: 30%; width: 30%"  -->
</div>

```markdown
![fish](https://....)
<!-- .element: class="r-frame" -->
```
<!-- .element: style="grid-area: code;" -->
<grid-box>

### Font Awesome Icon

<i class="fa-solid fa-face-smile"></i>

```markdown
<i class="fa-solid fa-face-smile"></i>
```

### Font Awesome Icon with Color

<span style="font-size: 8rem; color: purple;">
<i class="fa-solid fa-face-smile"></i>
</span>

```markdown
<span style="font-size: 8rem; color: purple;">
<i class="fa-solid fa-face-smile"></i>
</span>
```

### Font Awesome Stacked Icons

<grid-box styles="grid-template: 'left' 'code' / 1fr">
<columns-2 styles="justify-items: center; grid-area: left;">
<div class="fa-stack fa-2x">
<i class="fas fa-circle fa-stack-2x"></i>
<i class="fas fa-flag fa-stack-1x fa-inverse"></i>
</div>

<div class="fa-stack fa-2x">
<i class="fas fa-camera fa-stack-1x"></i>
<i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>
</div>
</columns-2>

```markdown
<columns-2 styles="justify-items: center;">
<div class="fa-stack fa-2x">
<i class="fas fa-circle fa-stack-2x"></i>
<i class="fas fa-flag fa-stack-1x fa-inverse"></i>
</div>

<div class="fa-stack fa-2x">
<i class="fas fa-camera fa-stack-1x"></i>
<i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>
</div>
</columns-2>
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

### FontAwesome Bullet Icons

<grid-box styles="grid-template: 'left' 'code' / 100%; justify-items: center">
<ul class="fa-ul" style="list-style-type: none; grid-area: left;">
  <li><span class="fa-li c-primary"><i class="fad fa-badge-check"></i></span> Regular bullet icon</li>
  <li><span class="fa-li c-primary"><i class="fad fa-recycle"></i></span> Regular bullet icon</li>
  <li><span class="fa-li" style="font-size: 0.7em; left: -2.5em;">
    <span class="fa-stack c-primary">
    <i class="fad fa-digging fa-stack-1x"></i>
    <i class="fas fa-ban fa-stack-2x" style="color: Tomato; opacity: 0.8;"></i>
    </span>
    </span> Stacked bullet icon</li>
</ul>

```markdown
<ul class="fa-ul" style="list-style-type: none;">
<li><span class="fa-li c-primary"><i class="fad fa-badge-check"></i></span> ...</li>
<li><span class="fa-li c-primary"><i class="fad fa-recycle"></i></span> ...</li>
<li><span class="fa-li" style="font-size: 0.7em; left: -2.5em;">
<span class="fa-stack c-primary">
<i class="fad fa-digging fa-stack-1x"></i>
<i class="fas fa-ban fa-stack-2x" style="color: Tomato; opacity: 0.8;"></i>
</span>
</span> Stacked bullet icon</li>
</ul>
```
<!-- .element: style="grid-area: code;" -->
</grid-box>

## Advanced Formatting

### Colored <span style="color: #78a5e9">text</span>

### Box Shadow

<columns-2>

<span class="box-shadow-trbl">
Shadow top, right, bottom, left.
</span>

<span class="box-shadow-rbl">
Shadow right, bottom, left.
</span>

<span class="box-shadow-rb">
Shadow right, bottom.
</span>

<span class="box-shadow-bl">
    Shadow bottom, left.
</span>

</columns-2>

### Colored Boxes

<columns-3>
<div class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>
<div class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>
</columns-3>

### Font Awesome Buttons

<columns-3>
<div class="flex align-center justify-around box-8rem radius-10p box-shadow-trbl" style=" background-color: lightblue; color: yellow"><i class="fas fa-thumbs-up"></i></div>
<div class="fs-4 flex align-center justify-around box-10rem radius-20p box-shadow-rbl" style=" background-color: pink; color: darkred;"><i class="fas fa-thumbtack"></i></div>
<div class="fs-7 flex align-center justify-around box-12rem radius-50p box-shadow-rb" style=" background-color: lightgreen; color: darkgreen;"><i class="fas fa-headphones"></i></div>
</columns-3>

### Picture Buttons

<columns-4>
<div class="box-8rem radius-10p overflow-hidden background-cover box-shadow-trbl" style='background-image: url("https://images.unsplash.com/photo-1595537725181-0f127e2feeb2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-10rem radius-20p overflow-hidden background-cover box-shadow-rbl" style='background-image: url("https://images.unsplash.com/photo-1595589982168-77b64bc1b485?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-12rem radius-30p overflow-hidden background-cover box-shadow-rb" style='background-image: url("https://images.unsplash.com/photo-1595586964632-b215dfbc064a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-14rem radius-50p overflow-hidden background-cover box-shadow-bl" style='background-image: url("https://images.unsplash.com/photo-1595508064774-5ff825ff0f81?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
</columns-4>

## Charts

via [chart.js](https://www.chartjs.org/)

### Polar Area Chart

```polarArea
{
  "data": {
    "labels": [
      "Red",
      "Green",
      "Yellow",
      "Grey",
      "Blue"
    ],
    "datasets": [
      {
        "label": "My First Dataset",
        "data": [
          11,
          16,
          7,
          3,
          14
        ],
        "backgroundColor": [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
          "rgb(201, 203, 207)",
          "rgb(54, 162, 235)"
        ]
      }
    ]
  }
}
```

### Line Chart

```line
{
 "data": {
  "labels": ["January","February","March","April","May","June","July"],
  "datasets":[
   {
    "data":[65,59,80,81,56,55,40],
    "label":"My first dataset","backgroundColor":"rgba(20,220,220,.8)"
   },
   {
    "data":[28,48,40,19,86,27,90],
    "label":"My second dataset","backgroundColor":"rgba(220,120,120,.8)"
   }
  ]
 }
}
```

### Bar Chart

```bar
{
  "data": {
    "labels": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July"
    ],
    "datasets": [
      {
        "label": "My First Dataset",
        "data": [
          65,
          59,
          80,
          81,
          56,
          55,
          40
        ],
        "borderWidth": 1
      }
    ]
  }
}
```

### Radar chart

```radar
{
  "data": {
    "labels": [
      "Eating",
      "Drinking",
      "Sleeping",
      "Designing",
      "Coding",
      "Cycling",
      "Running"
    ],
    "datasets": [
      {
        "label": "My First Dataset",
        "data": [
          65,
          59,
          90,
          81,
          56,
          55,
          40
        ],
        "fill": true,
        "backgroundColor": "rgba(255, 99, 132, 0.2)",
        "borderColor": "rgb(255, 99, 132)",
        "pointBackgroundColor": "rgb(255, 99, 132)",
        "pointBorderColor": "#fff",
        "pointHoverBackgroundColor": "#fff",
        "pointHoverBorderColor": "rgb(255, 99, 132)"
      },
      {
        "label": "My Second Dataset",
        "data": [
          28,
          48,
          40,
          19,
          96,
          27,
          100
        ],
        "fill": true,
        "backgroundColor": "rgba(54, 162, 235, 0.2)",
        "borderColor": "rgb(54, 162, 235)",
        "pointBackgroundColor": "rgb(54, 162, 235)",
        "pointBorderColor": "#fff",
        "pointHoverBackgroundColor": "#fff",
        "pointHoverBorderColor": "rgb(54, 162, 235)"
      }
    ]
  }
}
```

## Diagrams

via [mermaid.js](https://mermaid.js.org/)

### Flowchart

<columns-2>

```mermaid
graph LR
  A --- B
  B-->C
  B-->D;
```

```mermaid
graph TD
    A[Enter Chart Definition] --> B(Preview)
    B --> C{decide}
    C --> D[Keep]
    C --> E[Edit Definition]
    E --> B
    D --> F[Save Image and Code]
    F --> B
```

</columns-2>

### Sequence Diagram

```mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
```

### State Diagram

```mermaid
stateDiagram-v2
  [*] --> Still
  Still --> [*]
  Still --> Moving
  Moving --> Still
  Moving --> Crash
  Crash --> [*]
```

### Entity Relationship Diagram

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
```

### User Journey Diagram

```mermaid
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
```

### Gantt Chart

```mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
```

### Git Graph

```mermaid
gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
```

---

<h1>Thank you</h1>

<h2>for using <a href="https://github.com/slidesdown/slidesdown">Slidesdown</a></h2>
