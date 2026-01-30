// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);
config.resolver.alias = {
    ...config.resolver.alias,
    "@": path.resolve(projectRoot, "src"),
};

module.exports = config;
