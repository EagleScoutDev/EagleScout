#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

openapi-typescript ./openapi_v3.yml -o ./schema.generated.d.ts
