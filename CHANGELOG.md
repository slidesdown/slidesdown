# Changelog

All notable changes to this project will be documented in this file.

## [1.2.7] - 2025-08-07

### Bug Fixes

- Correct parsing of comments and add more tests

### Documentation

- Add complex slide grid example
- Update example in readme

### Features

- Add support for data-background-image path rebasing
- Add support for relative paths in data-preview-image attributes

### Miscellaneous Tasks

- Minor performance improvements when processing markdown data
- Add tests to verify security of comments

## [1.2.6] - 2025-08-06

### Bug Fixes

- Restore .element comment functionality

### Documentation

- Add slidesdown hint at the beginning of the presentation file
- Improve highlighting of headings

### Miscellaneous Tasks

- Remove unused fontawesome settings

## [1.2.5] - 2025-08-04

### Bug Fixes

- Prevent code injection via comments

### Documentation

- Add embedded youtube video example

### Features

- Allow additional attributes to support  all features of embedded youtube videos

## [1.2.4] - 2025-08-01

### Bug Fixes

- Add copyright holder to license

### Features

- Enable the use of iframes to embed video, etc

### Miscellaneous Tasks

- Remove deleted custom elements in dompurify

## [1.2.3] - 2025-07-29

### Miscellaneous Tasks

- Update dependencies

## [1.2.2] - 2025-07-22

### Documentation

- Correct link to charts slide
- Clarify CLI dependencies

### Miscellaneous Tasks

- Update dependencies

## [1.2.1] - 2025-07-17

### Bug Fixes

- Replace local images with links
- Restore proper handling of comment instructions

### Documentation

- Add more background images

## [1.2.0] - 2025-07-17

### Bug Fixes

- Convert all figures to webp
- Correct rebasing of image sources

### Miscellaneous Tasks

- Update slogan
- [**breaking**] Remove apexcharts in favor of better performing echarts

## [1.1.0] - 2025-07-16

### Bug Fixes

- Use minified echarts script
- Correctly load minified echarts script

### Documentation

- Remove broken gantt chart
- Update gradients and agenda
- Update screenshots

### Miscellaneous Tasks

- [**breaking**] Remove custom elements and custom styles

## [1.0.2] - 2025-07-16

### Documentation

- Cleanup examples

## [1.0.1] - 2025-07-16

### Documentation

- Add more example charts

### Features

- Optimize apexchart configuration

## [1.0.0] - 2025-07-16

### Bug Fixes

- Reduce font size of figure captions and items in sub lists

### Features

- Add support for sr.ht, however support is broken due to sr.ht!
- Add SEO data

### Miscellaneous Tasks

- Disable animations during resize
- [**breaking**] Remove chart.js due to blurry charts
- [**breaking**] Replace slidesdown CLI with slidesdown.nu CLI

## [0.19.2] - 2025-07-16

### Features

- Add apache echarts

## [0.19.1] - 2025-07-15

### Bug Fixes

- Support -v switch and correct image reference

### Miscellaneous Tasks

- Bump slidesdown.nu version
- Remove colon from slide
- Update dependencies and fix blackboard plugin

### Styling

- Reformat code

## [0.19.0] - 2025-06-20

### Bug Fixes

- Correct URL expansion for export

### Features

- Implement slidesdown script in nushell
- Implement support for publishing slides

### Miscellaneous Tasks

- Add justlib
- Update dependencies
- Harden docker vite configuration
- Deprecate slidesdown CLI in favor of slidesdown.nu

## [0.18.11] - 2025-02-16

### Miscellaneous Tasks

- Update dependencies

## [0.18.10] - 2025-02-04

### Bug Fixes

- Allow traffic from trycloudflare.com

### Miscellaneous Tasks

- Update dependencies

## [0.18.9] - 2025-01-28

### Miscellaneous Tasks

- Update configuration
- Update pacakges

## [0.18.8] - 2024-12-03

### Bug Fixes

- Allow export without presence of SLIDES.md

### Features

- Add reference to more supported options in front-matter #14

### Miscellaneous Tasks

- Update dependencies

## [0.18.7] - 2024-10-15

### Bug Fixes

- Correct support for target attribute

## [0.18.6] - 2024-10-15

### Features

- Add support for target attribute in anchor tags

## [0.18.5] - 2024-10-14

### Bug Fixes

- Pass reveal command to decktape

## [0.18.4] - 2024-10-08

### Miscellaneous Tasks

- Strip quotes and whitespace from strings

## [0.18.3] - 2024-10-08

### Miscellaneous Tasks

- Update dependencies

## [0.18.2] - 2024-09-27

### Miscellaneous Tasks

- Update dependencies
- Update dependencies

## [0.18.1] - 2024-09-25

### Miscellaneous Tasks

- Update remark-format version
- Source local environment configuration
- Update dependencies

## [0.18.0] - 2024-08-18

### Bug Fixes

- Correct typo in export command

### Documentation

- Update feature list and add images to presentation

### Features

- Update decktape container image
- Auto accept terms of service for cloudflare tunnels

### Miscellaneous Tasks

- Update dependencies

## [0.17.2] - 2024-08-02

### Bug Fixes

- Trigger reloads only for certain file extensions

### Features

- Show multiplex url since the service is always started

## [0.17.1] - 2024-08-01

### Bug Fixes

- Correct version update in Dockerfile

## [0.17.0] - 2024-08-01

### Bug Fixes

- Correct initialization order to properly support relative references in a and img tags
- Trigger page reloads for every file that changes

### Documentation

- Correct reference to slidesdown plugin and deprecate custom-elements
- Update release process
- Correct link to slidesdown plugin

### Features

- Add support for publishing presentations via cloudflare tunnels
- [**breaking**] Prefix environment variables with SLIDESDOWN_
- Add additional metadata to docker container
- Add support for multiplexing / advancing viewers slides

### Miscellaneous Tasks

- Migrate slidesdown image to slidesdown organization

## [0.16.0] - 2024-07-30

### Bug Fixes

- Correct relative URL rebasing for single quote references
- Avoid language class being added if it's empty
- Use code blocks for special characters that interfer with slidesdown

### Miscellaneous Tasks

- Update dependencies
- Migrate to marked's new renderer
- Replace all custom element examples with unocss
- Limit test execution to public folder
- Update dependencies

### Refactor

- Add unit tests for slidesdown.js

## [0.15.0] - 2024-07-12

### Features

- Add PDF title, subject and author from YAML frontmatter
- Add support for more well-known meta tags

## [0.14.0] - 2024-06-26

### Bug Fixes

- Add truncated remainder of html code and make img and a tag matching non-greedy

### Miscellaneous Tasks

- Update dependencies

### Styling

- Reformat code

## [0.13.2] - 2024-06-26

### Bug Fixes

- Correct rebasing that broke references that needed no rebasing

## [0.13.0] - 2024-06-21

### Features

- Switch to node 20 - LTS

### Miscellaneous Tasks

- Use ci scope for git commit in CI jobs

## [0.12.0] - 2024-06-21

### Bug Fixes

- Run update before testing existence of slides file
- Correct repository URL
- Correct path translation to local filesystem
- Ignore git hooks upon release

### Documentation

- Correct link to themes
- Add references to unocss and icons

### Features

- Run node beneath tini in docker container

### Miscellaneous Tasks

- Update markdown toc generation tool
- Update to nixos 24.05
- Add git commit hooks
- Update dependencies

## [0.11.1] - 2024-03-15

### Bug Fixes

- Remove newline characters in base64 value

### Documentation

- Update example in readme

### Features

- Add support for base64url encoding

## [0.11.0] - 2024-03-14

### Bug Fixes

- Correct handling of relative paths

### Documentation

- Remove fontawesome from default configuration

### Features

- Add support for base64 encoding slides in the URL

### Miscellaneous Tasks

- Update decktape

## [0.10.1] - 2024-03-13

### Bug Fixes

- Rebase references in nested img and a tags

## [0.10.0] - 2024-03-13

### Bug Fixes

- Restore notes feature

### Features

- Rebase a and img references on base url

### Miscellaneous Tasks

- Set NODE_ENV to produciton in dockerfile
- Reformat code
- Add speaker notes to slides
- Print changelog on new line

## [0.9.3] - 2024-03-06

### Miscellaneous Tasks

- Expose port 8080
- Delete cache after installation

## [0.9.2] - 2024-03-06

### Miscellaneous Tasks

- Update packages and reduce image size

## [0.9.1] - 2024-03-05

### Bug Fixes

- Migrate to mathjax3

### Miscellaneous Tasks

- Update all dependencies before a release

## [0.9.0] - 2024-03-05

### Bug Fixes

- Install dependencies via yarn
- Use pen on blackboard icon
- Reavtivate chalkboard plugin
- Correct ci and fix arrows in chalkboard
- Use grid for stacking icons

### Documentation

- Add links to icon library and styles

### Features

- Add uspport for iconify icons via unocss
- Serve mathjax locally

### Miscellaneous Tasks

- Update dependencies
- [**breaking**] Disable fontawesome loading by default
- Migrate example slides to unocss icons
- Update dependencies

## [0.8.10] - 2024-02-26

### Miscellaneous Tasks

- Reduce default resolution to 1600x900

## [0.8.9] - 2024-02-26

### Bug Fixes

- Correct setting version

## [0.8.8] - 2024-02-26

### Bug Fixes

- Correctly set script version

## [0.8.7] - 2024-02-26

### Bug Fixes

- Correct error in release task

## [0.8.6] - 2024-02-26

### Miscellaneous Tasks

- Correct build of docker images

## [0.8.5] - 2024-02-26

### Bug Fixes

- Build new docker image when releasing a new version

### Miscellaneous Tasks

- Add git-cliff configuration

## [0.8.4] - 2024-02-26

### Features

- Add unocss for styling
- Add support for custom templates
- Add support for a custom export file name

### Miscellaneous Tasks

- Post release changes
- Update dependencies
- Migrate Justfile to nu

## [0.8.3] - 2023-10-05

### Miscellaneous Tasks

- Post release changes
- Update plugins

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
