#!/usr/bin/env bash
set -euo pipefail
# set -x

echo "Starting multiplex serivce" 1>&2
cd /multiplex
exec npm run start
