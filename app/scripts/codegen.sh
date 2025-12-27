#!/usr/bin/env bash

node ./src/ui/icons/generate.script.mjs
./src/lib/frc/statbotics/generate.sh
./src/lib/frc/tba/generate.sh
