---
title: slidesdown
date: 2023-01-20
keywords: slides slideshow presentations markup markdown revealjs pandoc fontawesome
favicon: /favicon.svg
theme: /reveal.js-master/dist/theme/white.css
highlight-theme: /reveal.js-master/plugin/highlight/monokai.css
author: Jan Christoph Ebersbach
---

# slidesdown

<h2>Slideshows as fast as you can type Markdown.</h2>

## Agenda

1. Intro slidesdown
2. Basics
3. Incremental Display
4. Backgrounds
5. Pictures and Icons
6. Advanced Formatting
7. Charts

## Intro slidesdown

henl

> Turn markdown files into beautiful presentations quickly.

### Markdown

`slidesdown` is built to quickly turn ideas into beautiful presentations. The
text-based [markdown format](https://daringfireball.net/projects/markdown/) is
the tool of choice to do just that!

### Features

- Built with [reveal.js 4.0](https://revealjs.com/) and
  [pandoc 2.9](https://pandoc.org/)
- Focus: stays out of the way
- Enterprise: theming and PDF conversion
- Setup: super fast
- Presentation: looks great and offers the power of the browser at your
  fingertips

### Keybindings

- `<Space>` advance to next slide
- `<Shift-Space>` advance to previous slide
- `<f>` enter full-screen mode
- `<s>` show speaker notes
- `<Esc>` enter slide overview and `<Esc>` to show selected slide
- `<Alt-Left Mouse Button>` or `<Ctrl-Left Mouse Button>` zoom into slide

### Examples

- [Introduction video to slidesdown](https://youtu.be/ZNXvQGsk_wA)
- [Example HTML presentation](https://slidesdown.41ppl.com/)
- [Example PDF](./examples/slides.pdf)
- [Example Markdown](https://github.com/jceb/slidesdown/blob/main/SLIDES.md)

---

See for yourself.

## Basics

### Headings

<h1>h1</h1>
<h2>h2</h2>

#### h3

---

No heading.

### Hidden slide{data-visibility="hidden"}

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

### Links

- [Text link](https://github.com/jceb/slidesdown)
- Image link:
  [![](https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640)](https://unsplash.com/photos/x9yfTxHpj5w)

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

<pre>
<code class="javascript" data-line-numbers>function hello(msg) {
  alert(`Hello ${msg}`)
}

hello('world!');</code></pre>

### Code Highlighting with highlighted Line

<pre>
<code class="javascript" data-line-numbers=2>function hello(msg) {
  alert(`Hello ${msg}`)
}

hello('world!');</code></pre>

### Math formulas

`$$ \sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6} $$`

`$$ e^{\pi i}=-1 $$`

### Table

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

### Columns

:::::: {.flex .align-center .justify-around}

::: Col1

- Column 1
- Column 1
- Column 1

:::

::: Col2

- Column 2
- Column 2
- Column 2

:::

::: Col3

- Column 3
- Column 3
- Column 3

:::

::::::

## Animation

### Incremental Lists

::: incremental

- Item 1
- Item 2
- Item 3

:::

### Fragments

:::::: {.flex .align-center}
![](https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640){width=50%}

::: fragment
![](https://images.unsplash.com/photo-1587613864521-9ef8dfe617cc?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640){width=50%}
:::

::::::

### Breaks

- Item 1

. . .

- Item 2
- Item 3

### Animated List{data-auto-animate=1}

- Item 1
- Item 3
- Item 4

### Animated List{data-auto-animate=1}

- Item 1
- Item 2
- Item 3
- Item 4

### Animated Colored Boxes

### Animated Colored Boxes{data-auto-animate=1}

:::::: {.flex .align-center .justify-around}

<div data-id="1" class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>
<div data-id="2" class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div data-id="3" class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>

::::::

### Animated Colored Boxes{data-auto-animate=1}

:::::: {.flex .align-center .justify-around}

<div data-id="3" class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>
<div data-id="2" class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div data-id="1" class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>

::::::

## Backgrounds

### Slide with background image{data-background-image="https://images.unsplash.com/photo-1499892477393-f675706cbe6e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640"}

### Slide with colored background{data-background-color="#78a5e9"}

## Pictures and Icons

### Picture

![](https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640){width=50%}

### Font Awesome Icon

<i class="fa-solid fa-face-smile"></i>

## Advanced Formatting

### Colored <span style="color: #78a5e9">text</span>

### Font Awesome Icon with Color

<span style="font-size: 8rem; color: purple;">
<i class="fa-solid fa-face-smile"></i>
</span>

### Font Awesome Stacked Icons

::: {.flex .justify-around .align-center}
<span class="fa-stack fa-2x">
<i class="fas fa-square fa-stack-2x"></i>
<i class="fab fa-twitter fa-stack-1x fa-inverse"></i>
</span>
<span class="fa-stack fa-2x">
<i class="fas fa-circle fa-stack-2x"></i>
<i class="fas fa-flag fa-stack-1x fa-inverse"></i>
</span>
<span class="fa-stack fa-2x">
<i class="fas fa-square-full fa-stack-2x"></i>
<i class="fas fa-terminal fa-stack-1x fa-inverse"></i>
</span>
<span class="fa-stack fa-4x">
<i class="fas fa-square fa-stack-2x"></i>
<i class="fas fa-terminal fa-stack-1x fa-inverse"></i>
</span>
<span class="fa-stack fa-2x">
<i class="fas fa-camera fa-stack-1x"></i>
<i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>
</span>

:::

### FontAwesome Bullet Icons

<ul class="fa-ul" style="list-style-type: none;">
  <li><span class="fa-li c-primary">![](fad fa-badge-check)</span> Regular bullet icon</li>
  <li><span class="fa-li c-primary">![](fad fa-recycle)</span> Regular bullet icon</li>
  <li><span class="fa-li" style="font-size: 0.7em; left: -2.5em;">
    <span class="fa-stack c-primary" >
    <i class="fad fa-digging fa-stack-1x"></i>
    <i class="fas fa-ban fa-stack-2x" style="color: Tomato; opacity: 0.8;"></i>
    </span>
    </span> Stacked bullet icon</li>
</ul>

### Box Shadow

::: {.box-shadow-trbl}

Shadow top, right, bottom, left.

:::

::: {.box-shadow-rbl}

Shadow right, bottom, left.

:::

::: {.box-shadow-rb}

Shadow right, bottom.

:::

::: {.box-shadow-bl}

Shadow bottom, left.

:::

### Colored Boxes

:::::: {.flex .align-center .justify-around}

<div class="box-8rem radius-10p" style="background-color: lightblue; color: yellow">App 1</div>
<div class="box-10rem radius-20p" style="background-color: pink; color: darkred;">App 2</div>
<div class="box-12rem radius-50p" style="background-color: lightgreen; color: darkgreen;">Circle</div>
::::::

### Font Awesome Buttons

:::::: {.flex .align-center .justify-around .margin-tb-5rem}

<div class="flex align-center justify-around box-8rem radius-10p box-shadow-trbl" style=" background-color: lightblue; color: yellow">![](fas fa-thumbs-up)</div>
<div class="fs-4 flex align-center justify-around box-10rem radius-20p box-shadow-rbl" style=" background-color: pink; color: darkred;">![](fas fa-thumbtack)</div>
<div class="fs-7 flex align-center justify-around box-12rem radius-50p box-shadow-rb" style=" background-color: lightgreen; color: darkgreen;">![](fas fa-headphones)</div>
::::::

### Picture Buttons

:::::: {.flex .align-center .justify-around .margin-tb-6rem}

<div class="box-8rem radius-10p overflow-hidden background-cover box-shadow-trbl" style='background-image: url("https://images.unsplash.com/photo-1595537725181-0f127e2feeb2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-10rem radius-20p overflow-hidden background-cover box-shadow-rbl" style='background-image: url("https://images.unsplash.com/photo-1595589982168-77b64bc1b485?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-12rem radius-30p overflow-hidden background-cover box-shadow-rb" style='background-image: url("https://images.unsplash.com/photo-1595586964632-b215dfbc064a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
<div class="box-14rem radius-50p overflow-hidden background-cover box-shadow-bl" style='background-image: url("https://images.unsplash.com/photo-1595508064774-5ff825ff0f81?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640");'></div>
::::::

## Charts

via [chart.js](https://www.chartjs.org/)

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

## Thank you

<h3>for using [slidesdown](https://github.com/jceb/slidesdown)</h3>
