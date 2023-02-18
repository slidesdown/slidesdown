# <img src="./public/favicon.svg" alt="logo" style="height: 0.8em; margin: 0" /> Slidesdown

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

The following programs are used by `slidesdown`:

- [`docker`](https://www.docker.com/) required for offline presentations and
  hot-reloading slides while editing
- [`python3`](https://www.python.org/) required for online presentations via
  [slidesdown.e-jc.de](https://slidesdown.e-jc.de) if the slideshow file shall
  be served from the local computer, i.e. useful for creating slides or when the
  presentation is private and shall not be made accessible publicly via GitHub
- [`decktape`](https://github.com/astefanutti/decktape) or `docker` for
  exporting slideshows as PDF
- `xdg-open`, [`open-cli`](https://github.com/sindresorhus/open-cli) or `open`
  (MacOS) for opening the slideshow in the default browser
- [`curl`](https://curl.se/) for updating the slidesdown script

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
# Full list of supported settings: https://revealjs.com/config/ and https://github.com/hakimel/reveal.js/blob/master/js/config.js
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

# 5. Get the latest version of the script
slidesdown -u

# 6. Explore more options
slidesdown -h
```

## Development

### Required Tools

- [`curl`](https://curl.se/)
- [`gh`](https://github.com/cli/cli) GitHub CLI for creating releases
- [`git-cliff`](https://github.com/orhun/git-cliff) changelog generator
- [`just`](https://just.systems/) task runner
- [`node`](https://nodejs.org/) >=14

### Folder Structure and Important Files

- [`docs/`](./docs) build target folder served at
  [https://slidesdown.e-jc.de](https://slidesdown.e-jc.de) and used in the
  docker image
- [`examples/`](./examples) contains example presentations
- [`index.html`](./index.html) is the presentation template that gets loaded
- [`Justfile`](./Justfile) tasks collection, run `just` to get the list of tasks
- [`public/`](./public) contains external dependencies (not part of git) and
  - [`public/loader.html`](./public/loader.html) presentation loader served at
    [https://slidesdown.e-jc.de/loader.html](https://slidesdown.e-jc.de/loader.html)
  - [`public/learn.html`](./public/learn.html) tutorial served at
    [https://slidesdown.e-jc.de/learn.html](https://slidesdown.e-jc.de/learn.html)
  - [`public/slidesmarkdown.js`](./public/slidesmarkdown.js) Markdown converter
    plugin - this is the core of this project
- [`slidesdown`](./slidesdown) CLI
- [`src/`](./src) contains various scripts for docker and the HTML page
  - [`src/custom-elements.js`](./src/custom-elements.js) contains the custom
    elements that get injected into the presentation, e.g. `<v-box></v-box>`,
    `<h-box></h-box>` and `<columns-2></columns-2>`

### Setup

- Run `yarn` to install all JavaScript depedencies

### Modify Source Code

- Run `just update-all` to (re)download external dependencies to the `public/`
  folder
- Run `just dev` to start the `vite` development server plugin when it gets
  modified

### Build

- Run `just build` to recreate the `docs/` folder
- Run `just build-docker` to build a new docker image

### Release

- Commit all changes
- Create a new tag: `git tag -s vX.Y.Z`
- Push tag and changes: `git push --tags`
- Run `just release` create a new GitHub release, update
  [`CHANGELOG.md`](./CHANGELOG.md), and update tag in
  [`slidesdown`](./slidesdown) script
- Push post release changes: `git push`

## References

- [mdshow](https://github.com/jceb/mdshow) is an older attempt of mine to create
  simple and fast presentations from Markdown files.
- [reveal.js](https://revealjs.com/) provides the presentation framework that's
  the basis for slidesdown.
