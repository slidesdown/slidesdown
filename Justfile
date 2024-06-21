# Documentation: https://just.systems/man/en/

set shell := ["nu", "-c"]

# Integration with nodejs package.json scripts, see https://just.systems/man/en/chapter_65.html

export PATH := env('PWD') / 'node_modules/.bin:' + env('PATH')

# Print this help
default:
    @just -l

# Format Justfile
format:
    @just --fmt --unstable

# Install git commit hooks
githooks:
    #!/usr/bin/env nu
    $env.config = { use_ansi_coloring: false, error_style: "plain" }
    let hooks_folder = '.githooks'
    if (git config core.hooksPath) != $hooks_folder {
      print 'Installing git commit hooks'
      git config core.hooksPath $hooks_folder
      # npm install -g @commitlint/config-conventional
    }
    if not ($hooks_folder | path exists) {
      mkdir $hooks_folder
      "#!/usr/bin/env -S sh\nset -eu\njust test" | save $"($hooks_folder)/pre-commit"
      chmod 755 $"($hooks_folder)/pre-commit"
      "#!/usr/bin/env -S sh\nset -eu\n\nMSG_FILE=\"$1\"\nPATTERN='^(fix|feat|docs|style|chore|test|refactor|ci|build)(\\([a-z0-9/-]+\\))?!?: [a-z].+$'\n\nif ! head -n 1 \"${MSG_FILE}\" | grep -qE \"${PATTERN}\"; then\n\techo \"Your commit message:\" 1>&2\n\tcat \"${MSG_FILE}\" 1>&2\n\techo 1>&2\n\techo \"The commit message must conform to this pattern: ${PATTERN}\" 1>&2\n\techo \"Contents:\" 1>&2\n\techo \"- follow the conventional commits style (https://www.conventionalcommits.org/)\" 1>&2\n\techo 1>&2\n\techo \"Example:\" 1>&2\n\techo \"feat: add super awesome feature\" 1>&2\n\texit 1\nfi"| save $"($hooks_folder)/commit-msg"
      chmod 755 $"($hooks_folder)/commit-msg"
      # if not (".commitlintrc.yaml" | path exists) {
      # "extends:\n  - '@commitlint/config-conventional'" | save ".commitlintrc.yaml"
      # }
      # git add $hooks_folder ".commitlintrc.yaml"
      git add $hooks_folder
    }

# Run and watch application for development purposes
dev:
    yarn dev

# Update all dependencies
update-all: update-apexcharts update-revealjs update-revealjs-plugins update-revealjs-pdfexport update-revealjs-highlight update-mermaid update-chartjs update-pico update-marked update-dompurify update-unocss update-iconify update-mathjax

# Update mathjax
update-mathjax:
    #!/usr/bin/env nu
    # Source: https://github.com/mathjax/MathJax-src
    rm -rpf public/vendor/mathjax
    cp -r ./node_modules/mathjax public/vendor/mathjax

# Update apexcharts
update-apexcharts:
    #!/usr/bin/env nu
    # Source: https://github.com/apexcharts/apexcharts.js
    rm -rpf public/vendor/apexcharts
    cp -r ./node_modules/apexcharts/dist public/vendor/apexcharts

# Update pico
update-pico:
    #!/usr/bin/env nu
    # Source: https://github.com/picocss/pico
    let VERSION = "1.5.12"
    curl -Lfo public/css/pico.min.css $"https://unpkg.com/@picocss/pico@($VERSION)/css/pico.min.css"

# Update unocss
update-unocss:
    #!/usr/bin/env nu
    # Source: https://github.com/cure53/DOMPurify
    rm -rpf public/vendor/unocss
    mkdir public/vendor/unocss
    cp -r ./node_modules/@unocss/runtime/*.js public/vendor/unocss/

# Update iconify
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
update-dompurify:
    #!/usr/bin/env nu
    # Source: https://github.com/cure53/DOMPurify
    rm -prf public/vendor/dompurify
    cp -r ./node_modules/dompurify/dist public/vendor/dompurify

# Update mermaid
update-mermaid:
    #!/usr/bin/env nu
    # Source: https://github.com/mermaid-js/mermaid
    rm -rpf public/vendor/mermaid
    cp -r ./node_modules/mermaid/dist public/vendor/mermaid

# Update marked
update-marked:
    #!/usr/bin/env nu
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
    #!/usr/bin/env nu
    # Source: https://github.com/chartjs/Chart.js
    rm -prvf public/vendor/chart.js
    cp -pr ./node_modules/chart.js public/vendor/chart.js
    rm -prvf public/vendor/kurkle
    cp -pr ./node_modules/@kurkle/color/dist public/vendor/kurkle

# Update reveal.js
update-revealjs:
    #!/usr/bin/env nu
    # Source: https://github.com/hakimel/reveal.js
    mkdir public/vendor
    rm -prf public/vendor/reveal.js
    let VERSION = "5.1.0"
    cd public/vendor
    do -c {curl -Lfo - $"https://github.com/hakimel/reveal.js/archive/refs/tags/($VERSION).tar.gz"} | do -c {tar xvz}
    mv $"($env.PWD)/reveal.js-($VERSION)" reveal.js

# Update reveal.js-plugins
update-revealjs-plugins:
    #!/usr/bin/env nu
    # Source: https://github.com/rajgoel/reveal.js-plugins
    mkdir public/vendor
    rm -prf public/vendor/reveal.js-plugins
    let VERSION = "4.2.5"
    cd public/vendor
    do -c {curl -Lfo - $"https://github.com/rajgoel/reveal.js-plugins/archive/refs/tags/($VERSION).tar.gz"} | do -c {tar xvz}
    mv $"($env.PWD)/reveal.js-plugins-($VERSION)" reveal.js-plugins
    cd -
    cp -f ./patches/chalkboard-plugin.js ./public/vendor/reveal.js-plugins/chalkboard/plugin.js

# Update reveal.js-pdfexport
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

# Update reveal.js-highlight
update-revealjs-highlight:
    #!/usr/bin/env nu
    # Source: https://github.com/highlightjs/highlight.js
    mkdir public/vendor
    rm -prf public/vendor/highlight.js
    let VERSION = "11.9.0"
    cd public/vendor
    curl -Lfo - $"https://github.com/highlightjs/highlight.js/archive/refs/tags/($VERSION).tar.gz" | tar xvz $"highlight.js-($VERSION)/src/styles"
    mv $"($env.PWD)/highlight.js-($VERSION)/src/styles" highlight.js
    rm -pvrf $"($env.PWD)/highlight.js-($VERSION)"

# Build application
build:
    #!/usr/bin/env nu
    # Ensure that docs exists by cloning it first if docs shall be published
    # git clone git@github.com:slidesdown/slidesdown.github.io.git published
    rm -prf published/*
    # cd public/vendor/reveal.js/ && npx gulp plugins
    yarn build
    ^find published/vendor/reveal.js/ -mindepth 1 -maxdepth 1 -not -name plugin -not -name dist -not -name LICENSE -exec rm -rf {} +

# Create a new release of this module. LEVEL can be one of: major, minor, patch, premajor, preminor, prepatch, or prerelease.
release LEVEL="patch": update-all
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
    print "\nChangelog:\n"
    git cliff --strip all -u -t $new_version
    input -s $"Version will be bumped from ($current_version) to ($new_version).\nPress enter to confirm.\n"
    open package.json | upsert version $new_version | save -f package.json; git add package.json
    open --raw index.html | str replace -r 'name="generator" content="[^\"]*"' $'name="generator" content="slidesdown ($new_version)"' | save -f index.html; git add index.html
    open --raw slidesdown | str replace -r 'VERSION=.*' $'VERSION="($new_version)"' | save -f slidesdown; git add slidesdown
    git cliff -t $new_version -o CHANGELOG.md
    git add CHANGELOG.md
    git commit -n -m $"Bump version to ($new_version)"
    git tag -s -m $new_version $new_version
    git push --atomic origin refs/heads/main $"refs/tags/($new_version)"
    git cliff --strip all --current | gh release create -F - $new_version slidesdown
    just build-docker
    just push-docker
    if ("published/.git" | path exists) {
      cd published
      git add . | ignore
      git commit -a -m "chore(ci): upstream update" | ignore
      git push | ignore
    }

# Build docker images
build-docker: build
    #!/usr/bin/env nu
    let tag = (git describe --tags --abbrev=0 --dirty)
    docker build -t jceb/slidesdown:latest -t $"jceb/slidesdown:($tag)" .

# Push docker images
push-docker:
    #!/usr/bin/env nu
    docker push jceb/slidesdown:latest
    let tag = (git describe --tags --abbrev=0)
    docker push $"jceb/slidesdown:($tag)"

# Run tests
test:
    # no test yet
