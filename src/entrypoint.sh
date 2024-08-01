#!/usr/bin/env bash
set -euo pipefail
# set -x

# SLIDES="${1:-${SLIDES:-SLIDES.md}}"
# ROOT_DIRECTORY="/srv"
# SLIDES_DIRECTORY="${ROOT_DIRECTORY}/slides"

/multiplex.sh &
PID=$!
trap "kill '${PID}'" 1 2 3 15

npm run dev
