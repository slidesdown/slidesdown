# Changelog

All notable changes to this project will be documented in this file.

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
