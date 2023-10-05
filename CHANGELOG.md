# Changelog

All notable changes to this project will be documented in this file.

## [0.8.2] - 2023-10-05

### Bug Fixes

- Correct heights

### Documentation

- Add link to demo page

### Miscellaneous Tasks

- Post release changes
- Update dependencies

## [0.8.1] - 2023-10-05

### Bug Fixes

- Include styles in HorizontalFlexBox

### Documentation

- Add frontpage image

### Miscellaneous Tasks

- Post release changes
- Update dependencies
- Minor adjustment of slides

## [0.8.0] - 2023-09-14

### Bug Fixes

- Minor fixes
- Update to latest version

### Documentation

- Update toc
- Correct broken markdown
- Add more CLI examples and add slide publishing section

### Features

- Add template option
- Add generator meta tag
- [**breaking**] Switch to on demand imports

### Miscellaneous Tasks

- Post release changes

## [0.7.0] - 2023-09-13

### Bug Fixes

- Remove custom loaders
- Generate IDs for markdown headings

### Documentation

- Correct link in file structure

### Features

- Dynamically import mermaid when needed
- Make mermaid charts be initialized after revealjs
- Add apexchart plugin

### Miscellaneous Tasks

- Post release changes
- Update dependencies

### Refactor

- [**breaking**] Require namespace for chartjs charts

## [0.6.2] - 2023-09-12

### Miscellaneous Tasks

- Post release changes
- Update revealjs to verion 4.6.0

## [0.6.1] - 2023-09-12

### Bug Fixes

- Correct version update script that breaks package.json

### Features

- Add dompurify to sanitize HTML output

### Miscellaneous Tasks

- Post release changes

## [0.6.0] - 2023-09-12

### Bug Fixes

- Image masking for Chrome
- [**breaking**] Correct ids and semantic tags of header and footer components
- [**breaking**] Listen on localhost only instead of all interfaces
- Update plugins and correct broken mermaid integration

### Documentation

- Correct links to figures
- Display more information when updating the cli
- Reformat docs

### Features

- Add support for simplified URL handling of gist.github.com

### Miscellaneous Tasks

- Post release changes

## [0.5.7] - 2023-07-20

### Bug Fixes

- Correct escaping issue

## [0.5.6] - 2023-07-20

### Bug Fixes

- Display correct default image tag
- Update and fix mermaid dependency

### Miscellaneous Tasks

- Post release changes
- Update version in package.json as well

## [0.5.5] - 2023-07-14

### Bug Fixes

- Correct typos
- Use tagged decktape version

### Features

- Add repository license
- Add gradient text examples
- Add references to licenses of third party components

### Miscellaneous Tasks

- Post release changes
- Update to version 4.5.0
- Change to free fontawesome icons
- Update dependencies
- Bump version to 0.5.5

### Examples

- Update order of attributes

## [0.5.4] - 2023-02-20

### Documentation

- Add gradient background example

### Features

- Make metadata available in CSS variables
- Add layout components for header and footer

### Miscellaneous Tasks

- Post release changes

## [0.5.3] - 2023-02-20

### Bug Fixes

- Only strip /slides/ directory in python server

### Documentation

- Make auto-formatting work again for SLIDES.md

### Features

- Print script version upon completion

### Miscellaneous Tasks

- Post release changes

### Refactor

- Move all external plugins to public/vendor/

## [0.5.2] - 2023-02-18

### Bug Fixes

- Correct image name

### Miscellaneous Tasks

- Post release changes

## [0.5.1] - 2023-02-18

### Bug Fixes

- Correct container image name

### Miscellaneous Tasks

- Post release changes
- Add automation for pushing published changes upstream

## [0.5.0] - 2023-02-18

### Documentation

- Add more code samples
- Add missing examples for boxes

### Features

- Add rename and update styles

### Miscellaneous Tasks

- Post release changes

## [0.4.7] - 2023-02-18

### Miscellaneous Tasks

- Post release changes
- Add image labels
- Undo github packages because of the low free limits

## [0.4.6] - 2023-02-18

### Miscellaneous Tasks

- Post release changes
- Migrate to github packages

## [0.4.5] - 2023-02-18

### Miscellaneous Tasks

- Post release changes
- Clean up and extend metadata

## [0.4.4] - 2023-02-18

### Miscellaneous Tasks

- Migrate github references to organization
- Optimize docker and git ignore files

## [0.4.3] - 2023-02-18

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
- Correct relative URL computation
- Remove temporary file and don't throw exceptions on exit
- Don't fail if URL can't be opened
- Correct fontawesomePro loader
- Correct script reference
- Update references to themes
- Correct URL to non-docker file and add urlencoding
- Prevent duplicate inclusion of fontawesome icons
- Hide custom controls in print view
- Serve local files also with prefix /slides
- Include release notes in release
- Match metadata only at the beginning of the file
- Only allow settings that are part of revealjs' config
- Correct temp name when updating script
- Make export work via docker
- Try to make charts more crisp
- Change loading order to avoid race conditions with mermaid
- Correct pico download
- Add pdfexport patch
- Correct typo in filename
- Remove docs/ from build process

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
- Add blackboard and drawing feature references
- Make links to figures relative
- List script requirements
- Add development instructions
- Add reference to custom elements
- Remove unused cargo-watch dependency
- Update description of development process
- Describe release process
- Add code examples to example presentation
- Add more examples

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
- Make fontawesome pro kit optional
- Add docker container and CLI
- Add update command option
- Use either local decktape installation or docker
- Add website link
- Tag docker images with git tag add push target
- Add fontawesomeFree option that works everywhere
- Revert mermaid update and implement charts via code guards
- Always show button to hide custom controls
- Control visibility of customcontrols with controls metadata
- Use version tagged docker image
- Add update-pico as dependency to target update-all
- Add tag target to update script tag
- Add changelog generation and release mechanism
- Avoid errors by updating through a trap
- Prefer global revealjs controls setting
- Hide customcontrols if visibility changes
- Add link to loader and mitigate the <c-p>

### Miscellaneous Tasks

- Move dist/ to docs/
- Update configuration
- Rename repository
- Adjust domain name
- Rename repository
- Remove value and just leave placeholder
- Set default favicon for presentations
- Change to e-jc.de domain
- Simplify example
- Unignore plugin
- Cleanup unnecessary pwd command
- Set default title to slidesdown
- Make favicon text white
- Increase font size
- [**breaking**] Move public/reveal.js-master to public/reveal.js
- Add debug output
- Print error messages with script name
- Bump version
- Remove extended metadata options
- Update slides in examples folder during build
- Bump version to 9.4.0
- Add switch to print version information
- Add flake configuration
- Ignore TODO.md
- Adjust order of steps in the release process
- Include link to revealjs config source
- Post release changes
- Post release changes
- Post release changes
- Post release changes
- Remove black border from draw screenshot
- Post release changes
- Remove unused cargo-watch dependency
- Add legacy hint to docs/
- Remove references to e-jc.de

### Refactor

- Extract initialization into s separate source file
- Migrate from bulma to picocss
- Extract icons into external files
- Provide pico locally
- [**breaking**] Rename column-X to columns-X
- Optimize loading of references
- Load mermaid through a loader

<!-- generated by git-cliff -->
