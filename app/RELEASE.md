## OTA Release
1. Version bump
2. Make sure your working directory is `app/`
3. Do ```npm run prebuild```
4. Do ```npm run bundle```
5. Do ```source .env && npm run publish-bundle -- --upload-path="$STALLION_PROJECT/$STALLION_BUCKET" --release-note="[RELEASE NOTES HERE]"```

## Full Release
1. Version bump
2. Make sure your working directory is `app/`
3. Do ```npm run prebuild```
4. iOS
   5. Do ```xed ios```
   6. In Xcode, set the run configuration to `Release` under `EagleScout > Edit Scheme...`
   7. Do `Product > Archive` and wait for the build to finish
   8. Do `Window > Organizer` and distribute the app from there
   9. Know how to use appstoreconnect
