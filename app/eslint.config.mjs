import { defineConfig } from "eslint";

export default defineConfig({
    root: true,
    extends: "@react-native",
    rules: {
        "react/inline-styles": "onx"
    }
});
