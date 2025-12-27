const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require("node:path");

const projectRoot = __dirname;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        unstable_enablePackageExports: true,
    },
    alias: {
        "@": path.resolve(projectRoot, "src"),
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
