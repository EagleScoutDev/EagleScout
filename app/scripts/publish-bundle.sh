#!/usr/bin/env bash

npx stallion publish-bundle --platform=ios --custom-bundle-path=dist/ios "$@"
npx stallion publish-bundle --platform=android --custom-bundle-path=dist/ios "$@"
