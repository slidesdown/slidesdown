---
author: Jan Christoph Ebersbach
date: 2023-01-20
title: slidesdown
keywords: slides slideshow presentations markup markdown revealjs pandoc fontawesome
favicon: /favicon.svg
theme: white
highlight-theme: tokyo-night-dark
# revealjs settings, see list of supported settings: https://revealjs.com/config/
progress: true
---

# slidesdown

> Slideshows as fast as you can type Markdown.

<!-- generated with
!deno run --unstable --allow-read --allow-write https://deno.land/x/remark_format_cli@v0.0.9/remark-format.js --maxdepth 2 %
-->

## Agenda

1. [Introduction](#introduction)
2. [Basics](#basics)
3. [Layouts](#layouts)
4. [Animations](#animations)
5. [Backgrounds](#backgrounds)
6. [Pictures and Icons](#pictures-and-icons)
7. [Advanced Formatting](#advanced-formatting)
8. [Charts](#charts)

## Introduction

### Markdown

`slidesdown` is built to quickly turn ideas into beautiful presentations. The
text-based [markdown format](https://daringfireball.net/projects/markdown/) is
the tool of choice to do just that!

### Features

- Built with [reveal.js](https://revealjs.com/)
- Focus: Stays out of your way
- Professional: Theming and PDF conversion
- Setup: No installation
- Styling: Looks great and offers the power of the browser at your fingertips

### Keybindings

- `<Space>` advance to next slide
- `<Shift-Space>` advance to previous slide
- `<f>` enter full-screen mode
- `<s>` show speaker notes
- `<Esc>` enter slide overview and `<Esc>` to show selected slide
- `<Alt-Left Mouse Button>` or `<Ctrl-Left Mouse Button>` zoom into slide

### Examples

<!-- - [Introduction video to slidesdown](https://youtu.be/ZNXvQGsk_wA) -->

<!-- - [Example PDF](./examples/slides.pdf) -->

- [Presentation](https://slidesdown.e-jc.de/)
- [Markdown](https://github.com/jceb/slidesdown/blob/main/SLIDES.md)

---

See for yourself.

## Basics

### Headings

<h1>h1</h1>
<h2>h2</h2>
<h3>h3</h3>

|||

No heading.

### Next comes a hidden slide

Can you see it?

### Hidden slide

<!-- .slide: data-visibility="hidden" -->

### Text formatting

Regluar, _italic_, **bold**, and <u>underlined</u>.

### Unordered List

- Item 1
- Item 2
- Item 3

### Ordered List

1. Item 1
2. Item 2
3. Item 3

### Images

![](https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640)

### Framed Images

![](https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640)

<!-- .element: class="r-frame" -->

### Links

<column-2>

[A Text link](https://github.com/jceb/slidesdown)

<v-box>

An Image link
[![](https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640)](https://unsplash.com/photos/x9yfTxHpj5w)

</v-box>

<!-- .element: class="50p" -->

</column-2>

### Quotes

> Famous Quote by Someone

### Code Highlighting

```javascript
function hello(msg) {
  alert(`Hello ${msg}`);
}

hello("world!");
```

### Code Highlighting with Line Numbers

```javascript []
function hello(msg) {
  alert(`Hello ${msg}`);
}

hello("world!");
```

### Code Highlighting with highlighted Line

```javascript [2]
function hello(msg) {
  alert(`Hello ${msg}`);
}

hello("world!");
```

### Math formulas

`$$ \sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6} $$`

`$$ e^{\pi i}=-1 $$`

### Table

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

## Layouts

### 1 Column

<!-- .slide: data-auto-animate="1" -->

<v-box  data-id="1">
Column 1

- Item 1
- Item 2
- Item 3

</v-box>

<v-box data-id="2">
Column 2

- Item 1
- Item 2
- Item 3

</v-box>

<v-box data-id="3">
Column 3

- Item 1
- Item 2
- Item 3

</v-box>

### 2 Columns

<!-- .slide: data-auto-animate="1" -->

<column-2>
<v-box  data-id="1">
Column 1

- Item 1
- Item 2
- Item 3

</v-box>

<v-box data-id="2">
Column 2

- Item 1
- Item 2
- Item 3

</v-box>

<v-box data-id="3">
Column 3

- Item 1
- Item 2
- Item 3

</v-box>
</column-2>

### 3 Columns

<!-- .slide: data-auto-animate="1" -->

<column-3>
<v-box  data-id="1">
Column 1

- Item 1
- Item 2
- Item 3

</v-box>

<v-box data-id="2">
Column 2

- Item 1
- Item 2
- Item 3

</v-box>

<v-box data-id="3">
Column 3

- Item 1
- Item 2
- Item 3

</v-box>
</column-3>

### Complex

<!-- .slide: data-auto-animate="1" -->

<grid-box styles="grid-template: 'header header header' 'sidebar main main' / 300px auto">

<v-box style="grid-area: header; background-color: green" data-id="1">
Column 1

- Item 1
- Item 2
- Item 3

</v-box>

<v-box style="grid-area:sidebar; background-color: blue" data-id="2">
Column 2

- Item 1
- Item 2
- Item 3

</v-box>

<v-box style="grid-area: main; background-color: red" data-id="3">
Column 3

- Item 1
- Item 2
- Item 3

</v-box>

</grid-box>

### Complex Sidebar Right

<!-- .slide: data-auto-animate="1" -->

<grid-box styles="grid-template: 'header header header' 'main main sidebar' / 1fr 1fr 300px">

<v-box style="grid-area: header; background-color: green" data-id="1">
Column 1

- Item 1
- Item 2
- Item 3

</v-box>

<v-box style="grid-area:sidebar; background-color: blue" data-id="2">
Column 2

- Item 1
- Item 2
- Item 3

</v-box>

<v-box style="grid-area: main; background-color: red" data-id="3">
Column 3

- Item 1
- Item 2
- Item 3

</v-box>

</grid-box>

## Animations

### Incremental Lists

- Item 1 <!-- .element: class="fragment" -->
- Item 2 <!-- .element: class="fragment" -->
- Item 3 <!-- .element: class="fragment" -->

### Fragments

<column-2>
<img src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640" />
<img src="https://images.unsplash.com/photo-1587613864521-9ef8dfe617cc?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640" />
<!-- .element: class="fragment" -->
</column-2>

<div>

### Breaks

- Item 1

<div class="fragment">

- Item 2
- Item 3

<div>

### Animated List

<!-- .slide: data-auto-animate="1" -->

- Item 1
- Item 3
- Item 4

### Animated List

<!-- .slide: data-auto-animate="1" -->

- Item 1
- Item 2
- Item 3
- Item 4

### Animated Colored Boxes

<!-- .slide: data-auto-animate="1" -->

<column-3>
<div data-id="1" class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>
<div data-id="2" class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div data-id="3" class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>
</column-3>

### Animated Colored Boxes

<!-- .slide: data-auto-animate="1" -->

<column-3>
<div data-id="3" class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>
<div data-id="2" class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div data-id="1" class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>
</column-3>

## Backgrounds

### Slide with background image

<!-- .slide: data-background-image="https://images.unsplash.com/photo-1499892477393-f675706cbe6e?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640" -->

### Slide with colored background

<!-- .slide: data-background-color="#78a5e9" -->

## Pictures and Icons

### Picture

![](https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1\&q=80\&fm=jpg\&crop=entropy\&cs=tinysrgb\&w=640)

### Font Awesome Icon

<i class="fa-solid fa-face-smile"></i>

## Advanced Formatting

### Colored <span style="color: #78a5e9">text</span>

### Font Awesome Icon with Color

<span style="font-size: 8rem; color: purple;">
<i class="fa-solid fa-face-smile"></i>
</span>

### Font Awesome Stacked Icons

<div class="display: flex; align-items: center; justify-content: space-around;"
<span class="fa-stack fa-2x">
<i class="fab fa-twitter fa-stack-1x fa-inverse"></i> </span>
<span class="fa-stack fa-2x"> <i class="fas fa-circle fa-stack-2x"></i>
<i class="fas fa-flag fa-stack-1x fa-inverse"></i> </span>
<span class="fa-stack fa-2x"> <i class="fas fa-square-full fa-stack-2x"></i>
<i class="fas fa-terminal fa-stack-1x fa-inverse"></i> </span>
<span class="fa-stack fa-4x"> <i class="fas fa-square fa-stack-2x"></i>
<i class="fas fa-terminal fa-stack-1x fa-inverse"></i> </span>
<span class="fa-stack fa-2x"> <i class="fas fa-camera fa-stack-1x"></i>
<i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i> </span>
</div>

### FontAwesome Bullet Icons

<ul class="fa-ul" style="list-style-type: none;">
  <li><span class="fa-li c-primary"><i class="fad fa-badge-check"></i></span> Regular bullet icon</li>
  <li><span class="fa-li c-primary"><i class="fad fa-recycle"></i></span> Regular bullet icon</li>
  <li><span class="fa-li" style="font-size: 0.7em; left: -2.5em;">
    <span class="fa-stack c-primary" >
    <i class="fad fa-digging fa-stack-1x"></i>
    <i class="fas fa-ban fa-stack-2x" style="color: Tomato; opacity: 0.8;"></i>
    </span>
    </span> Stacked bullet icon</li>
</ul>

### Box Shadow

<column-2>

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

</column-2>

### Colored Boxes

<column-3>
<div class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>
<div class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>
</column-3>

### Font Awesome Buttons

<column-3>
<div class="flex align-center justify-around box-8rem radius-10p box-shadow-trbl" style=" background-color: lightblue; color: yellow"><i class="fas fa-thumbs-up"></i></div>
<div class="fs-4 flex align-center justify-around box-10rem radius-20p box-shadow-rbl" style=" background-color: pink; color: darkred;"><i class="fas fa-thumbtack"></i></div>
<div class="fs-7 flex align-center justify-around box-12rem radius-50p box-shadow-rb" style=" background-color: lightgreen; color: darkgreen;"><i class="fas fa-headphones"></i></div>
</column-3>

### Picture Buttons

<column-4>
<div class="box-8rem radius-10p overflow-hidden background-cover box-shadow-trbl" style='background-image: url("https://images.unsplash.com/photo-1595537725181-0f127e2feeb2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-10rem radius-20p overflow-hidden background-cover box-shadow-rbl" style='background-image: url("https://images.unsplash.com/photo-1595589982168-77b64bc1b485?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-12rem radius-30p overflow-hidden background-cover box-shadow-rb" style='background-image: url("https://images.unsplash.com/photo-1595586964632-b215dfbc064a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-14rem radius-50p overflow-hidden background-cover box-shadow-bl" style='background-image: url("https://images.unsplash.com/photo-1595508064774-5ff825ff0f81?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
</column-4>

## Charts

TODO

via [chart.js](https://www.chartjs.org/)

### Area Chart

<canvas id="vxKmkEqKlZJ5MK1P0Wdk"></canvas>

<script>
var ctx = document.getElementById('vxKmkEqKlZJ5MK1P0Wdk').getContext('2d');
const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
];
new Chart(
  ctx,
  {
    type: 'bar',
    data: {
      labels: data.map(row => row.year),
      datasets: [
        {
          label: 'Acquisitions by year',
          data: data.map(row => row.count)
        }
      ]
    }
  }
);
console.log("go chart")
</script>

### Bar Chart

<canvas id="9d3663d5deb049029436214b48685aab"></canvas>

<script>
var ctx = document.getElementById('9d3663d5deb049029436214b48685aab').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
</script>

### Radar chart

<canvas id="ec647c7adf104ff0a6c0ce7ca78a5665"></canvas>

<script>
// Die Daten richtig einzubauen ist nicht so einfach, da eine
// Transformationsfunktion gebraucht wird, um die Label zu extrahieren und
// dann auch die Daten zu extrahieren .. das ist nicht so einfach zu erreichen.
var ctx = document.getElementById('ec647c7adf104ff0a6c0ce7ca78a5665').getContext('2d');
var myRadarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
      datasets: [
      {
        label: 'First',
        data: [20, 10, 4, 2],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Second',
        data: [12, 12, 12, 3],
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
      ]
    },
    options: {
      scale: {
          angleLines: {
              display: false
          },
          ticks: {
              suggestedMin: 0,
              suggestedMax: 20
          }
      }
    },
});

</script>

---

<h2>Thank you</h2>

<h3>for using <a href="https://github.com/jceb/slidesdown">slidesdown</a></h3>
