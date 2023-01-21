# Documentation: https://just.systems/man/en/

set shell := ["bash", "-euo", "pipefail", "-c"]

# Print this help
help:
    @just -l

# Format Justfile
format:
    @just --fmt --unstable

# Run and watch application for development purposes
dev:
    yarn dev

# Update revealjs
update-revealjs:
    curl -Lo public/master.zip https://github.com/hakimel/reveal.js/archive/master.zip
    if [ -e public/reveal.js-master.bak ]; then \
    rm -rf public/reveal.js-master.bak; \
    fi
    mv public/reveal.js-master public/reveal.js-master.bak
    cd public && unzip master.zip
    rm public/master.zip
    cp -r public/reveal.js-master.bak/plugin/markdown/plugin.js public/reveal.js-master/plugin/markdown/plugin.js
    cd public/reveal.js-master && npm install

# Build application
build:
    rm -rf docs
    cd public/reveal.js-master/ && npx gulp plugins
    yarn build
    rm -rf docs/reveal.js-master.bak
    find docs/reveal.js-master/ -mindepth 1 -maxdepth 1 -not -name plugin -not -name dist -not -name LICENSE -exec rm -rf {} +
    cp SLIDES.md docs/
    cp .CNAME docs/CNAME
    cp ._config.yml docs/_config.yml
