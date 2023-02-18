# Changelog

All notable changes to this project will be documented in this file.

## [0.4.2] - 2023-02-16

### Bug Fixes

- Try to make charts more crisp
- Change loading order to avoid race conditions with mermaid

### Miscellaneous Tasks

- Post release changes
- Remove black border from draw screenshot

## [0.4.1] - 2023-02-16

### Features

- Add link to loader and mitigate the <c-p>

### Miscellaneous Tasks

- Post release changes

## [0.4.0] - 2023-02-16

### Bug Fixes

- Correct temp name when updating script
- Make export work via docker

### Miscellaneous Tasks

- Post release changes

## [0.3.6] - 2023-02-16

### Bug Fixes

- Match metadata only at the beginning of the file
- Only allow settings that are part of revealjs' config

### Features

- Prefer global revealjs controls setting
- Hide customcontrols if visibility changes

### Miscellaneous Tasks

- Post release changes

## [0.3.5] - 2023-02-16

### Features

- Avoid errors by updating through a trap

### Miscellaneous Tasks

- Adjust order of steps in the release process
- Include link to revealjs config source

### Refactor

- Load mermaid through a loader

## [0.3.4] - 2023-02-16

### Bug Fixes

- Include release notes in release

## [0.3.3] - 2023-02-16

### Features

- Add update-pico as dependency to target update-all
- Add tag target to update script tag
- Add changelog generation and release mechanism

### Miscellaneous Tasks

- Add switch to print version information
- Add flake configuration
- Ignore TODO.md

## [0.3.2] - 2023-02-15

### Features

- Control visibility of customcontrols with controls metadata
- Use version tagged docker image

## [0.3.1] - 2023-02-15

### Features

- Always show button to hide custom controls

## [0.3.0] - 2023-02-15

### Bug Fixes

- Correct URL to non-docker file and add urlencoding
- Prevent duplicate inclusion of fontawesome icons
- Hide custom controls in print view
- Serve local files also with prefix /slides

### Features

- Revert mermaid update and implement charts via code guards

### Miscellaneous Tasks

- Bump version to 9.4.0

## [0.2.4] - 2023-02-14

### Documentation

- Add development instructions
- Add reference to custom elements

### Features

- Add fontawesomeFree option that works everywhere

### Miscellaneous Tasks

- Remove extended metadata options
- Update slides in examples folder during build

## [0.2.3] - 2023-02-11

### Bug Fixes

- Update references to themes

## [0.2.2] - 2023-02-11

### Miscellaneous Tasks

- Bump version

## [0.2.1] - 2023-02-11

### Bug Fixes

- Remove temporary file and don't throw exceptions on exit
- Don't fail if URL can't be opened
- Correct fontawesomePro loader
- Correct script reference

### Documentation

- List script requirements

### Features

- Add update command option
- Use either local decktape installation or docker
- Add website link
- Tag docker images with git tag add push target

### Miscellaneous Tasks

- Print error messages with script name

## [0.2.0] - 2023-02-11

### Bug Fixes

- Correct relative URL computation

### Documentation

- Add blackboard and drawing feature references
- Add missing figures in build
- Make links to figures relative

### Features

- Make fontawesome pro kit optional
- Add docker container and CLI

### Miscellaneous Tasks

- Add debug output

### Refactor

- [**breaking**] Rename column-X to columns-X
- Optimize loading of references

## [0.1.0] - 2023-02-07

### Bug Fixes

- Correct URL computation and move SLIDES.md to /
- Make reference relative
- Add config
- Prevent SLIDES.md from being rendered by github
- Use raw markdown directly from github
- Set favicon on all pages
- Correct link to presentation
- Correct variable definition, const to let
- Correct plugin order so that markdown is loaded first
- Change title to slidesdown

### Documentation

- Add detailed readme
- Correct slides
- Add styles and web components
- Cleanup slides
- Update titles
- Cleanup first slides
- Remove animation from layout
- Add slidesdown logo to readme and slides
- Correct path to logo
- Update toc
- Update and rearrange slides
- Extend features and examples
- Unify claim and references
- Unify claim

### Features

- Add first version of mdslides
- Enable all available plugins
- Enable google analytics
- Add support for chart.js
- Integrate more highlight.js styles
- Optimize icon colors
- Add github icon
- Assign heading ID to section to support linking to slides by name
- Add support for relative resources in markdown
- Reference theme and highlight-theme by word or URL
- Add dynamic grid box compoent
- Add support for setting revealjs settings
- Add custom slidesdown favicon
- Add logo
- [**breaking**] Change vertical slide identifier from +++ to |||
- Tighten validation of metadata contents
- Add feature PDF export
- Add chalkboard and custom controls plugins
- Add chart plugin
- Add support for mermaid diagrams

### Miscellaneous Tasks

- Move dist/ to docs/
- Add include config
- Update configuration
- Rename repository
- Adjust domain name
- Rename repository
- Remove value and just leave placeholder
- Add changes to docs
- Set default favicon for presentations
- Change to e-jc.de domain
- Simplify example
- Unignore plugin
- Cleanup unnecessary pwd command
- Set default title to slidesdown
- Make favicon text white
- Increase font size
- [**breaking**] Move public/reveal.js-master to public/reveal.js

### Refactor

- Extract initialization into s separate source file
- Migrate from bulma to picocss
- Extract icons into external files
- Provide pico locally

<!-- generated by git-cliff -->
