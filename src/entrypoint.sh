#!/usr/bin/env bash
set -euo pipefail
set -x

SLIDES="${1:-${SLIDES:-SLIDES.md}}"
ROOT_DIRECTORY="/srv"
SLIDES_DIRECTORY="${ROOT_DIRECTORY}/slides"

cd "${ROOT_DIRECTORY}"
echo "import slides from './slides/${SLIDES}';" >"loader.js"
tini npm run dev
