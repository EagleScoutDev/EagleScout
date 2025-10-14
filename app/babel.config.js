const prod = process.env.NODE_ENV !== "development";

module.exports = {
    presets: ["module:@react-native/babel-preset"],
    plugins: [
        ["module:react-native-dotenv", {
            safeMode: true,
        }],
        ["react-native-reanimated/plugin", {

        }],
        ...(prod ? [["babel-plugin-react-compiler", {
            target: "19",
            compilationMode: "annotation",
            panicThreshold: "all_errors"
        }]] : [])
    ],
};
