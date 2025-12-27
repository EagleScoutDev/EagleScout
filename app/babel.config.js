const prod = process.env.APP_ENV !== "development";

module.exports = function(api) {
    api.cache(true);
    return {
        presets: ["module:@react-native/babel-preset"],
        plugins: [
            ["module-resolver", {
                root: ["./"],
                alias: {
                    "@": "./src",
                },
            }],
            ["react-native-worklets/plugin", {

            }],
            ["module:react-native-dotenv", {
                safeMode: true,
                envName: "APP_ENV",
            }],
            ["babel-plugin-react-compiler", {
                target: "19",
                compilationMode: prod ? "infer" : "annotation",
                panicThreshold: "all_errors"
            }],
        ],
    };
};
