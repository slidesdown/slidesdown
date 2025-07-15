#!/usr/bin/env -S just --list --justfile
# Documentation: https://just.systems/man/en/

import 'justlib/default.just'
import 'justlib/bump.just'

# Integration with nodejs package.json scripts, see https://just.systems/man/en/chapter_65.html

export PATH := env('PWD') / 'node_modules/.bin:' + env('PATH')

# Print this help
default:
    @just -l

# Run and watch application for development purposes
[group('development')]
dev:
    yarn run dev

# Update all dependencies
[group('update')]
update-all: update-apexcharts update-revealjs update-revealjs-plugins update-revealjs-pdfexport update-highlight update-mermaid update-chartjs update-pico update-marked update-dompurify update-unocss update-iconify update-mathjax update-reveal-multiplex

# Update mathjax
[group('update')]
update-mathjax:
    #!/usr/bin/env nu
    # Source: https://github.com/mathjax/MathJax-src
    rm -rpf public/vendor/mathjax
    cp -r ./node_modules/mathjax/ public/vendor/mathjax

# Update apexcharts
[group('update')]
update-apexcharts:
    #!/usr/bin/env nu
    # Source: https://github.com/apexcharts/apexcharts.js
    rm -rpf public/vendor/apexcharts
    cp -r ./node_modules/apexcharts/dist/ public/vendor/apexcharts

# Update pico
[group('update')]
update-pico:
    #!/usr/bin/env nu
    # Source: https://github.com/picocss/pico
    let VERSION = "1.5.13"
    curl -Lfo public/css/pico.min.css $"https://unpkg.com/@picocss/pico@($VERSION)/css/pico.min.css"

# Update unocss
[group('update')]
update-unocss:
    #!/usr/bin/env nu
    # Source: https://github.com/cure53/DOMPurify
    rm -rpf public/vendor/unocss
    mkdir public/vendor/unocss
    cp -r ./node_modules/@unocss/runtime/*.js public/vendor/unocss/

# Update iconify
[group('update')]
update-iconify:
    #!/usr/bin/env nu
    # Source: https://github.com/iconify/icon-sets
    rm -rpf public/vendor/@iconify-json
    mkdir public/vendor/@iconify-json
    let sourcedir = "node_modules/@iconify/json/json"
    glob $"($sourcedir)/*.json" | path basename | parse "{name}.{extension}" | par-each {|iconset|
      mkdir $"public/vendor/@iconify-json/($iconset.name)"
      cp $"($sourcedir)/($iconset.name).($iconset.extension)" $"public/vendor/@iconify-json/($iconset.name)/icons.json"
    }

# Update dompurify
[group('update')]
update-dompurify:
    #!/usr/bin/env nu
    # Source: https://github.com/cure53/DOMPurify
    rm -prf public/vendor/dompurify
    cp -r ./node_modules/dompurify/dist/ public/vendor/dompurify

# Update mermaid
[group('update')]
update-mermaid:
    #!/usr/bin/env nu
    # Source: https://github.com/mermaid-js/mermaid
    rm -rpf public/vendor/mermaid
    cp -r ./node_modules/mermaid/dist/ public/vendor/mermaid

# Update marked
[group('update')]
update-marked:
    #!/usr/bin/env nu
    # Source: https://github.com/markedjs/marked
    rm -prf public/vendor/marked
    cp -pr ./node_modules/marked/lib/ public/vendor/marked
    rm -prf public/vendor/marked-base-url
    cp -pr ./node_modules/marked-base-url/src/ public/vendor/marked-base-url
    rm -prf public/vendor/marked-gfm-heading-id
    cp -pr ./node_modules/marked-gfm-heading-id/src/ public/vendor/marked-gfm-heading-id
    rm -prf public/vendor/github-slugger
    cp -pr ./node_modules/github-slugger/ public/vendor/github-slugger
    # cp -pr ./node_modules/.deno/node_modules/github-slugger/ public/vendor/github-slugger

# Update chartjs
[group('update')]
update-chartjs:
    #!/usr/bin/env nu
    # Source: https://github.com/chartjs/Chart.js
    rm -prvf public/vendor/chart.js
    cp -pr ./node_modules/chart.js/ public/vendor/chart.js
    rm -prvf public/vendor/kurkle
    cp -pr ./node_modules/@kurkle/color/dist/ public/vendor/kurkle
    # cp -pr ./node_modules/.deno/node_modules/@kurkle/color/dist/ public/vendor/kurkle

# Update reveal.js
[group('update')]
update-revealjs:
    #!/usr/bin/env nu
    # Source: https://github.com/hakimel/reveal.js
    mkdir public/vendor
    rm -prf public/vendor/reveal.js
    let VERSION = "5.2.1"
    cd public/vendor
    do -c {curl -Lfo - $"https://github.com/hakimel/reveal.js/archive/refs/tags/($VERSION).tar.gz"} | do -c {tar xvz}
    mv $"($env.PWD)/reveal.js-($VERSION)" reveal.js

# Update reveal.js-plugins
[group('update')]
update-revealjs-plugins:
    #!/usr/bin/env nu
    # Source: https://github.com/rajgoel/reveal.js-plugins
    mkdir public/vendor
    rm -prf public/vendor/reveal.js-plugins
    let VERSION = "4.6.0"
    cd public/vendor
    do -c {curl -Lfo - $"https://github.com/rajgoel/reveal.js-plugins/archive/refs/tags/($VERSION).tar.gz"} | do -c {tar xvz}
    mv $"($env.PWD)/reveal.js-plugins-($VERSION)" reveal.js-plugins
    cd -
    cp -f ./patches/chalkboard-plugin.js ./public/vendor/reveal.js-plugins/chalkboard/plugin.js

# Update reveal.js-pdfexport
[group('update')]
update-revealjs-pdfexport:
    #!/usr/bin/env nu
    # Source: https://github.com/McShelby/reveal-pdfexport
    mkdir public/vendor
    rm -prf public/vendor/reveal-pdfexport
    let VERSION = "2.0.1"
    cd public/vendor
    do -c {curl -Lfo - $"https://github.com/McShelby/reveal-pdfexport/archive/refs/tags/($VERSION).tar.gz"} | do -c {tar xvz}
    mv $"($env.PWD)/reveal-pdfexport-($VERSION)" reveal-pdfexport
    cd reveal-pdfexport; open --raw "{{ justfile_directory() }}/src/pdfexport_add_export.patch" | do -c {patch -p4}

# Update highlight
[group('update')]
update-highlight:
    #!/usr/bin/env nu
    # Source: https://github.com/highlightjs/highlight.js
    mkdir public/vendor
    rm -prf public/vendor/highlight.js
    cp -r node_modules/highlight.js/styles/ public/vendor/highlight.js

# Update reveal-multiplex
[group('update')]
update-reveal-multiplex:
    #!/usr/bin/env nu
    # Source: https://github.com/reveal/multiplex
    mkdir public/vendor
    rm -prf public/vendor/multiplex
    mkdir public/vendor/multiplex
    cp -pr ./multiplex/client.js public/vendor/multiplex
    cp -pr ./multiplex/master.js public/vendor/multiplex

# Build application
[group('development')]
build: test
    #!/usr/bin/env nu
    # Ensure that docs exists by cloning it first if docs shall be published
    # git clone git@github.com:slidesdown/slidesdown.github.io.git published
    rm -prf published/*
    # cd public/vendor/reveal.js/ && npx gulp plugins
    yarn run build
    ^find published/vendor/reveal.js/ -mindepth 1 -maxdepth 1 -not -name plugin -not -name dist -not -name LICENSE -exec rm -rf {} +

# Sets new version in files files, called by `just bump`
[group('ci')]
[private]
_bump_files CURRENT_VERSION NEW_VERSION: update-all build
    #!/usr/bin/env nu
    open package.json | upsert version "{{ NEW_VERSION }}" | save -f package.json; git add package.json
    open manifest.json | upsert version "{{ NEW_VERSION }}" | save -f manifest.json; git add manifest.json
    open --raw index.html | str replace -r 'name="generator" content="[^\"]*"' $'name="generator" content="slidesdown {{ NEW_VERSION }}"' | save -f index.html; git add index.html
    open --raw slidesdown | str replace -r 'VERSION=.*' $'VERSION="{{ NEW_VERSION }}"' | save -f slidesdown; git add slidesdown
    open --raw slidesdown.nu | str replace -r 'let VERSION = .*' $'let VERSION = "{{ NEW_VERSION }}"' | save -f slidesdown.nu; git add slidesdown.nu
    open --raw Dockerfile | str replace -r '(LABEL org.opencontainers.image.ref.name)=.*' $'${1}="slidesdown/slidesdown:{{ NEW_VERSION }}"' | str replace -r '(LABEL org.opencontainers.image.version)=.*' $'${1}="{{ NEW_VERSION }}"' | str replace -r '(LABEL org.opencontainers.image.revision)=.*' $'${1}="{{ NEW_VERSION }}"' | save -f Dockerfile; git add Dockerfile
    if ("published/.git" | path exists) {
      cd published
      git add . | ignore
      git commit -a -m "chore(ci): upstream update" | ignore
      git push | ignore
    }

# Build updated docker image and push it
[group('release')]
release: docker-build docker-push

# Build docker images
[group('development')]
docker-build: build
    #!/usr/bin/env nu
    let tag = (git describe --tags --abbrev=0 --dirty)
    docker build -t slidesdown/slidesdown:latest -t $"slidesdown/slidesdown:($tag)" .

# Push docker images
[group('development')]
docker-push:
    #!/usr/bin/env nu
    docker push slidesdown/slidesdown:latest
    let tag = (git describe --tags --abbrev=0)
    docker push $"slidesdown/slidesdown:($tag)"

# Run tests
[group('development')]
test:
    yarn run test --run --no-color --dir public
