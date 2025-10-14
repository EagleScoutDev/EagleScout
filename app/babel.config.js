const prod = process.env.NODE_ENV !== "development";

module.exports = {
    presets: ["module:@react-native/babel-preset"],
    plugins: [
        ["react-native-worklets/plugin", {

        }],
        ["module:react-native-dotenv", {
            safeMode: true,
        }],
        ...(prod ? [["babel-plugin-react-compiler", {
            target: "19",
            compilationMode: "annotation",
            panicThreshold: "all_errors"
        }]] : []),
    ],
};
