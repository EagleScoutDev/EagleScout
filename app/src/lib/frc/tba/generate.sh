#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

openapi-typescript https://www.thebluealliance.com/swagger/api_v3.json -o ./schema.generated.d.ts
