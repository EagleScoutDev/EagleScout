#!/usr/bin/env bash

node ./src/ui/icons/generate.script.mjs
./src/lib/db/statbotics/generate.sh
./src/lib/db/tba/generate.sh
