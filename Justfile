# Documentation: https://just.systems/man/en/

set shell := ["nu", "-c"]

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
update-all: update-apexcharts update-revealjs update-revealjs-plugins update-revealjs-pdfexport update-revealjs-highlight update-mermaid update-chartjs update-pico update-marked update-dompurify update-unocss

# Update pico
update-apexcharts:
    # Source: https://github.com/apexcharts/apexcharts.js
    rm -rpf public/vendor/apexcharts
    cp -r ./node_modules/apexcharts/dist public/vendor/apexcharts

# Update pico
update-pico:
    # Source: https://github.com/picocss/pico
    let VERSION = "1.5.10"; curl -Lfo public/css/pico.min.css $"https://unpkg.com/@picocss/pico@($VERSION)/css/pico.min.css"

# Update unocss
update-unocss:
    # Source: https://github.com/cure53/DOMPurify
    rm -rpf public/vendor/unocss
    mkdir public/vendor/unocss
    cp -r ./node_modules/@unocss/runtime/full.global.js public/vendor/unocss/

# Update dompurify
update-dompurify:
    # Source: https://github.com/cure53/DOMPurify
    rm -prf public/vendor/dompurify
    cp -r ./node_modules/dompurify/dist public/vendor/dompurify

# Update mermaid
update-mermaid:
    # Source: https://github.com/mermaid-js/mermaid
    rm -rpf public/vendor/mermaid
    cp -r ./node_modules/mermaid/dist public/vendor/mermaid

# Update marked
update-marked:
    # Source: https://github.com/markedjs/marked
    rm -prf public/vendor/marked
    cp -pr ./node_modules/marked/lib public/vendor/marked
    rm -prf public/vendor/marked-base-url
    cp -pr ./node_modules/marked-base-url/src public/vendor/marked-base-url
    rm -prf public/vendor/marked-gfm-heading-id
    cp -pr ./node_modules/marked-gfm-heading-id/src public/vendor/marked-gfm-heading-id
    rm -prf public/vendor/github-slugger
    cp -pr ./node_modules/github-slugger public/vendor/github-slugger

# Update chartjs
update-chartjs:
    # Source: https://github.com/chartjs/Chart.js
    rm -prvf public/vendor/chart.js
    cp -pr ./node_modules/chart.js public/vendor/chart.js
    rm -prvf public/vendor/kurkle
    cp -pr ./node_modules/@kurkle/color/dist public/vendor/kurkle

# Update reveal.js
update-revealjs:
    # Source: https://github.com/hakimel/reveal.js
    mkdir -p public/vendor
    rm -prf public/vendor/reveal.js
    let VERSION = "4.6.0"; cd public/vendor; curl -Lfo - $"https://github.com/hakimel/reveal.js/archive/refs/tags/($VERSION).tar.gz" | tar xvz; mv $"reveal.js-($VERSION)" reveal.js

# Update reveal.js-plugins
update-revealjs-plugins:
    # Source: https://github.com/rajgoel/reveal.js-plugins
    mkdir -p public/vendor
    rm -prf public/vendor/reveal.js-plugins
    let VERSION = "4.2.4"; cd public/vendor; curl -Lfo - $"https://github.com/rajgoel/reveal.js-plugins/archive/refs/tags/($VERSION).tar.gz" | tar xvz; mv $"reveal.js-plugins-($VERSION)" reveal.js-plugins

# Update reveal.js-pdfexport
update-revealjs-pdfexport:
    # Source: https://github.com/McShelby/reveal-pdfexport
    mkdir -p public/vendor
    rm -prf public/vendor/reveal-pdfexport
    let VERSION = "2.0.1"; cd public/vendor; curl -Lfo - $"https://github.com/McShelby/reveal-pdfexport/archive/refs/tags/($VERSION).tar.gz" | tar xvz; mv $"reveal-pdfexport-($VERSION)" reveal-pdfexport
    cd public/vendor/reveal-pdfexport; patch -p4 < "{{ justfile_directory() }}/src/pdfexport_add_export.patch"

# Update reveal.js-highlight
update-revealjs-highlight:
    # Source: https://github.com/highlightjs/highlight.js
    mkdir -p public/vendor
    rm -prf public/vendor/highlight.js
    let VERSION = "11.8.0"; cd public/vendor; curl -Lfo - $"https://github.com/highlightjs/highlight.js/archive/refs/tags/($VERSION).tar.gz" | tar xvz $"highlight.js-($VERSION)/src/styles"; mv $"highlight.js-($VERSION)/src/styles" highlight.js; rm -pvrf $"highlight.js-($VERSION)"

# Build application
build:
    # Ensure that docs exists by cloning it first if docs shall be published
    # git clone git@github.com:slidesdown/slidesdown.github.io.git published
    rm -prf published/*
    # cd public/vendor/reveal.js/ && npx gulp plugins
    yarn build
    ^find published/vendor/reveal.js/ -mindepth 1 -maxdepth 1 -not -name plugin -not -name dist -not -name LICENSE -exec rm -rf {} +

# Create a new release of this module. LEVEL can be one of: major, minor, patch, premajor, preminor, prepatch, or prerelease.
release LEVEL="patch":
    #!/usr/bin/env nu
    if (git rev-parse --abbrev-ref HEAD) != "main" {
      print -e "ERROR: A new release can only be created on the main branch."
      exit 1
    }
    if (git status --porcelain | wc -l) != "0" {
      print -e "ERROR: Repository contains uncommited changes."
      exit 1
    }
    let current_version = (git describe | str replace -r "-.*" "" | npx semver $in)
    let new_version = ($current_version | npx semver -i "{{ LEVEL }}" $in)
    print "Changelog:\n"
    git cliff --strip all -u -t $new_version
    input -s $"Version will be bumped from ($current_version) to ($new_version).\nPress enter to confirm.\n"
    open package.json | upsert version $new_version | save -f package.json; git add package.json
    open --raw index.html | str replace -r 'name="generator" content="[^\"]*"' $'name="generator" content="slidesdown ($new_version)"' | save -f index.html; git add index.html
    open --raw slidesdown | str replace -r '^VERISION=.*' $'VERSION="($new_version)"' | save -f slidesdown; git add slidesdown
    git cliff -t $new_version -o CHANGELOG.md
    git add CHANGELOG.md
    git commit -m $"Bump version to ($new_version)"
    git tag -s -m $new_version $new_version
    git push --atomic origin refs/heads/main $"refs/tags/($new_version)"
    git cliff --strip all --current | gh release create -F - $new_version slidesdown
    just build-docker
    just push-docker
    if (published/.git | path exists) {
      cd published
      git add . | ignore
      git commit -a -m "chore: upstream update" | ignore
      git push | ignore
    }

# Build docker images
build-docker: build
    docker build -t jceb/slidesdown:latest -t "jceb/slidesdown:$(git describe --tags --abbrev=0 | sed -e 's/^v//')" .

# Push docker images
push-docker:
    docker push jceb/slidesdown:latest
    docker push "jceb/slidesdown:$(git describe --tags --abbrev=0 | sed -e 's/^v//')"
