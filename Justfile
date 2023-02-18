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

# Update all dependencies
update-all: update-revealjs update-mermaid update-chartjs update-pico update-marked

# Update pico
update-pico:
    VERSION="1.5.6"; \
       curl -Lfo public/css/pico.min.css "https://unpkg.com/@picocss/pico@${VERSION}/css/pico.min.css"

# Update mermaid
update-mermaid:
    # Source: https://github.com/mermaid-js/mermaid
    mkdir -p public/mermaid
    VERSION="9.3.0"; \
        curl -Lfo public/mermaid/mermaid.js "https://cdn.jsdelivr.net/npm/mermaid@${VERSION}/dist/mermaid.esm.min.mjs"
    # curl -Lfo public/mermaid/mermaid.js "https://cdn.jsdelivr.net/npm/mermaid@${VERSION}/dist/mermaid.min.js"

# Update marked
update-marked:
    # Source: https://github.com/markedjs/marked
    mkdir -p public/marked
    VERSION="4.2.12"; \
        curl -Lfo public/marked/marked.js "https://cdn.jsdelivr.net/npm/marked@${VERSION}/lib/marked.umd.min.js"

# Update chartjs
update-chartjs:
    # Source: https://github.com/chartjs/Chart.js
    rm -rvf public/chart.js
    mkdir -p public/chart.js
    VERSION="4.2.1"; cd public/chart.js && \
        curl -Lfo - "https://github.com/chartjs/Chart.js/releases/download/v${VERSION}/chart.js-${VERSION}.tgz" | \
        tar xvz package/LICENSE.md package/dist && \
        mv -t . package/LICENSE.md package/dist && \
        rmdir package

# Update revealjs
update-revealjs:
    # Source: https://github.com/hakimel/reveal.js
    rm -rf public/reveal.js
    VERSION="4.4.0"; cd public && \
        curl -Lfo - "https://github.com/hakimel/reveal.js/archive/refs/tags/${VERSION}.tar.gz" | \
        tar xvz && \
        mv "reveal.js-${VERSION}" reveal.js
    # Source: https://github.com/rajgoel/reveal.js-plugins
    VERSION="4.1.5"; cd public/reveal.js/plugin && \
        curl -Lfo - "https://github.com/rajgoel/reveal.js-plugins/archive/refs/tags/${VERSION}.tar.gz" | \
        tar xvz && \
        find "reveal.js-plugins-${VERSION}" -mindepth 1 -maxdepth 1 -type d -exec mv -t . {} + && \
        rm -rvf "reveal.js-plugins-${VERSION}"
    # Source: https://github.com/McShelby/reveal-pdfexport
    VERSION="2.0.1"; cd public/reveal.js/plugin && \
        curl -Lfo - "https://github.com/McShelby/reveal-pdfexport/archive/refs/tags/${VERSION}.tar.gz" | \
        tar xvz && \
        mv "reveal-pdfexport-${VERSION}" pdfexport
    patch -p0 < src/pdfexport_add_export.patch
    # Source: https://github.com/highlightjs/highlight.js
    VERSION="11.7.0"; cd public/reveal.js/plugin/highlight && \
        curl -Lfo - "https://github.com/highlightjs/highlight.js/archive/refs/tags/${VERSION}.tar.gz" | \
        tar xvz "highlight.js-${VERSION}/src/styles" && \
        mv "highlight.js-${VERSION}/src/styles/"* . && \
        rm -vrf "highlight.js-${VERSION}"

# Build application
build:
    # Ensure that docs exists by cloning it first if docs shall be published
    # git clone git@github.com:slidesdown/slidesdown.github.io.git published
    rm -rf published/*
    # cd public/reveal.js/ && npx gulp plugins
    yarn build
    find published/reveal.js/ -mindepth 1 -maxdepth 1 -not -name plugin -not -name dist -not -name LICENSE -exec rm -rf {} +

# Update version tag in script
tag:
    TAG="$(git describe --tags --abbrev=0 --exact-match | sed -e 's/^v//')" && \
      sed -i -e "s/^VERSION=.*/VERSION='${TAG}'/" slidesdown

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

# Build docker images
build-docker:
    docker build -t jceb/slidesdown:latest -t "jceb/slidesdown:$(git describe --tags --abbrev=0 | sed -e 's/^v//')" .

# Push docker images
push-docker:
    docker push jceb/slidesdown:latest
    docker push "jceb/slidesdown:$(git describe --tags --abbrev=0 | sed -e 's/^v//')"
