# <img src="./public/favicon.svg" alt="logo" style="height: 0.8em; margin: 0" /> slidesdown

Slideshows as fast as you can type.

[Slidesdown](https://slidesdown.e-jc.de) is powered by the incredible
[reveal.js presentation framework](https://revealjs.com/).

## Learn

Visit [slidesdown.e-jc.de/learn.html](https://slidesdown.e-jc.de/learn.html) to
get started.

## Usage

### Online Viewer

Visit [slidesdown.e-jc.de/loader.html](https://slidesdown.e-jc.de/loader.html)
and enter the URL to your Markdown presentation, e.g.
`github.com/jceb/slidesdown/SLIDES.md`.

### CLI

Slidesdown provides a CLI to quickly open files on your computer in the Online
Viewer or a Viewer hosted in a local Docker container.

#### Installation

```bash
sudo curl -L https://raw.githubusercontent.com/jceb/slidesdown/main/slidesdown -o /usr/local/bin/slidesdown; sudo chmod a+x /usr/local/bin/slidesdown
```

#### Usage

```bash
# 1. Create a SLIDES.md file in your current directory
cat >SLIDES.md <<EOF
---
# Metadata useful for SEO
author: Your Name
date: 2023-01-20
title: Presentation Title
keywords: some keyword that help seo

# Show progress bar
progress: true
# Show controls
controls: true
# Center presentation
center: true
# Create separate pages for fragments
# Full list of supported settings: https://revealjs.com/config/
---

# My first markdown slideshow

Author: Your Name

## Agenda

1. Markdown is easy to read
2. Markdown is easy to write
3. Let's use it for presentations

## The End

Thank you for your time.
EOF

# 2. Open file in slidesdown Online Viewer (python3 required)
slidesdown

# 3. There's also an offline viewer available that requires Docker
slidesdown -d

# 4. Export slides as PDF
slidesdown -e

# 5. Explore more options
slidesdown -h
```

## References

- [mdshow](https://github.com/jceb/mdshow) is an older attempt of mine to create
  simple and fast presentations from Markdown files.
- [reveal.js](https://revealjs.com/) provides the presentation framework that's
  the basis for slidesdown.
