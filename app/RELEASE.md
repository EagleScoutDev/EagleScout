## OTA Release
1. Version bump
2. Make sure your working directory is in `app/`
3. Do ```npm run prebuild```
4. Do ```npm run bundle```
5. Do ```source .env && npm run publish-bundle -- --upload-path="$STALLION_PROJECT/$STALLION_BUCKET" --release-note="[RELEASE NOTES HERE]"```
