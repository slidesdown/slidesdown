# Documentation: https://just.systems/man/en/

set shell := ["bash", "-eEuo", "pipefail", "-c"]

# Print this help
help:
    @just -l

# Format Justfile
format:
    @just --fmt --unstable

# Run and watch application for development purposes
dev:
    yarn dev

# Update all dependencies
update-all: update-apexcharts update-revealjs update-revealjs-plugins update-revealjs-pdfexport update-revealjs-highlight update-mermaid update-chartjs update-pico update-marked update-dompurify

# Update pico
update-apexcharts:
    # Source: https://github.com/apexcharts/apexcharts.js
    rm -rf public/vendor/apexcharts
    cp -r ./node_modules/apexcharts/dist public/vendor/apexcharts

# Update pico
update-pico:
    # Source: https://github.com/picocss/pico
    VERSION="1.5.10"; \
       curl -Lfo public/css/pico.min.css "https://unpkg.com/@picocss/pico@${VERSION}/css/pico.min.css"

# Update dompurify
update-dompurify:
    # Source: https://github.com/cure53/DOMPurify
    rm -rf public/vendor/dompurify
    cp -r ./node_modules/dompurify/dist public/vendor/dompurify

# Update mermaid
update-mermaid:
    # Source: https://github.com/mermaid-js/mermaid
    rm -rf public/vendor/mermaid
    cp -r ./node_modules/mermaid/dist public/vendor/mermaid

# Update marked
update-marked:
    # Source: https://github.com/markedjs/marked
    rm -rf public/vendor/marked
    cp -r ./node_modules/marked/lib public/vendor/marked
    rm -rf public/vendor/marked-base-url
    cp -r ./node_modules/marked-base-url/src public/vendor/marked-base-url
    rm -rf public/vendor/marked-gfm-heading-id
    cp -r ./node_modules/marked-gfm-heading-id/src public/vendor/marked-gfm-heading-id
    rm -rf public/vendor/github-slugger
    cp -r ./node_modules/github-slugger public/vendor/github-slugger

# Update chartjs
update-chartjs:
    # Source: https://github.com/chartjs/Chart.js
    rm -rvf public/vendor/chart.js
    cp -r ./node_modules/chart.js public/vendor/chart.js
    rm -rvf public/vendor/kurkle
    cp -r ./node_modules/@kurkle/color/dist public/vendor/kurkle

# Update reveal.js
update-revealjs:
    # Source: https://github.com/hakimel/reveal.js
    mkdir -p public/vendor
    rm -rf public/vendor/reveal.js
    VERSION="4.6.0"; cd public/vendor && \
        curl -Lfo - "https://github.com/hakimel/reveal.js/archive/refs/tags/${VERSION}.tar.gz" | \
        tar xvz && \
        mv "reveal.js-${VERSION}" reveal.js

# Update reveal.js-plugins
update-revealjs-plugins:
    # Source: https://github.com/rajgoel/reveal.js-plugins
    mkdir -p public/vendor
    rm -rf public/vendor/reveal.js-plugins
    VERSION="4.2.4"; cd public/vendor && \
        curl -Lfo - "https://github.com/rajgoel/reveal.js-plugins/archive/refs/tags/${VERSION}.tar.gz" | \
        tar xvz && \
        mv "reveal.js-plugins-${VERSION}" reveal.js-plugins

# Update reveal.js-pdfexport
update-revealjs-pdfexport:
    # Source: https://github.com/McShelby/reveal-pdfexport
    mkdir -p public/vendor
    rm -rf public/vendor/reveal-pdfexport
    VERSION="2.0.1"; cd public/vendor && \
        curl -Lfo - "https://github.com/McShelby/reveal-pdfexport/archive/refs/tags/${VERSION}.tar.gz" | \
        tar xvz && \
        mv "reveal-pdfexport-${VERSION}" reveal-pdfexport
    cd public/vendor/reveal-pdfexport && \
      patch -p4 < {{ justfile_directory() }}/src/pdfexport_add_export.patch

# Update reveal.js-highlight
update-revealjs-highlight:
    # Source: https://github.com/highlightjs/highlight.js
    mkdir -p public/vendor
    rm -rf public/vendor/highlight.js
    VERSION="11.8.0"; cd public/vendor && \
        curl -Lfo - "https://github.com/highlightjs/highlight.js/archive/refs/tags/${VERSION}.tar.gz" | \
        tar xvz "highlight.js-${VERSION}/src/styles" && \
        mv "highlight.js-${VERSION}/src/styles" highlight.js && \
        rm -vrf "highlight.js-${VERSION}"

# Build application
build:
    # Ensure that docs exists by cloning it first if docs shall be published
    # git clone git@github.com:slidesdown/slidesdown.github.io.git published
    rm -rf published/*
    # cd public/vendor/reveal.js/ && npx gulp plugins
    yarn build
    find published/vendor/reveal.js/ -mindepth 1 -maxdepth 1 -not -name plugin -not -name dist -not -name LICENSE -exec rm -rf {} +

# Update version tag in script
tag:
    #!/usr/bin/env bash
    set -eEuo pipefail
    TAG="$(git describe --tags --abbrev=0 --exact-match | sed -e 's/^v//')"
    # TAG="0.7.0"
    sed -i -e "s/^VERSION=.*/VERSION='${TAG}'/" slidesdown
    sed -i -e "s/\"version\": \"[^\"]*\"/\"version\": \"${TAG}\"/" package.json
    sed -i -e "s/name=\"generator\" content=\"[^\"]*\"/name=\"generator\" content=\"slidesdown ${TAG}\"/" index.html

# Update changelog
changelog:
    git cliff > CHANGELOG.md

# Post release adjustments
post-release: tag changelog

# Create a new release
release: build-docker push-docker
    TAG="$(git describe --tags --abbrev=0 --exact-match)" && \
        git cliff --strip all --current | \
        gh release create -F - "${TAG}"
    just post-release
    git add -u
    git commit -m "chore(ci): post release changes"
    if [ -e published/.git ]; then \
    cd published; \
    git add . || true; \
    git commit -a -m "chore: upstream update" || true; \
    git push || true; \
    fi

# Build docker images
build-docker: build
    docker build -t jceb/slidesdown:latest -t "jceb/slidesdown:$(git describe --tags --abbrev=0 | sed -e 's/^v//')" .

# Push docker images
push-docker:
    docker push jceb/slidesdown:latest
    docker push "jceb/slidesdown:$(git describe --tags --abbrev=0 | sed -e 's/^v//')"
