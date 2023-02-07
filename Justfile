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

# Watch plugins and rebuild them
dev-watch:
    cargo-watch -s "npx gulp plugins" -w "${PWD}/public/reveal.js/plugin/markdown/plugin.js" -C "${PWD}/public/reveal.js"

# Update pico
update-pico:
    curl -Lfo public/css/pico.min.css https://unpkg.com/@picocss/pico@v1.5.6/css/pico.min.css

# Update revealjs
update-revealjs:
    if [ -e public/reveal.js.bak ]; then \
        rm -rf public/reveal.js.bak; \
    fi
    mv public/reveal.js public/reveal.js.bak
    # Source: https://github.com/hakimel/reveal.js
    VERSION="4.4.0"; cd public && \
        curl -Lf "https://github.com/hakimel/reveal.js/archive/refs/tags/${VERSION}.tar.gz" -o - | \
        tar xvz && \
        mv "reveal.js-${VERSION}" reveal.js
    cp -r public/reveal.js.bak/plugin/markdown/plugin.js public/reveal.js/plugin/markdown/plugin.js
    cd public/reveal.js && npm install
    # Source: https://github.com/McShelby/reveal-pdfexport
    VERSION="2.0.1"; cd public/reveal.js/plugin && \
        curl -Lf "https://github.com/McShelby/reveal-pdfexport/archive/refs/tags/${VERSION}.tar.gz" -o - | \
        tar xvz && \
        mv "reveal-pdfexport-${VERSION}" pdfexport
    # Source: https://github.com/highlightjs/highlight.js
    VERSION="11.7.0"; cd public/reveal.js/plugin/highlight && \
        curl -Lf "https://github.com/highlightjs/highlight.js/archive/refs/tags/${VERSION}.tar.gz" -o - | \
        tar xvz "highlight.js-${VERSION}/src/styles" && \
        mv "highlight.js-${VERSION}/src/styles/"* . && \
        rm -vrf "highlight.js-${VERSION}"

# Build application
build:
    rm -rf docs
    cd public/reveal.js/ && npx gulp plugins
    yarn build
    rm -rf docs/reveal.js.bak
    find docs/reveal.js/ -mindepth 1 -maxdepth 1 -not -name plugin -not -name dist -not -name LICENSE -exec rm -rf {} +
    cp .CNAME docs/CNAME
