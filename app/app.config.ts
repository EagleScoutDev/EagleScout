import "tsx/cjs";
import "dotenv/config";
import type { ConfigContext } from "@expo/config";
import type { ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    name: "EagleScout",
    slug: "eaglescout",
    version: "8.0.0",
    orientation: "portrait",
    icon: "src/assets/images/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    scheme: "eaglescout",
    experiments: {
        reactCompiler: true,
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.team114.eaglescout",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "src/assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        package: "com.team114.Eaglescout",
    },
    web: {},
    plugins: [
        "expo-font",
        "expo-sqlite",
        "@react-native-community/datetimepicker",
        [
            "expo-stallion-plugin",
            {
                projectId: process.env.STALLION_ID,
                appToken: process.env.STALLION_APP_TOKEN,
            },
        ],
        [
            "expo-asset",
            {
                assets: ["src/assets/"],
            },
        ],
        [
            "expo-image-picker",
            {
                photosPermission: "Upload media for scouting.",
                cameraPermission: "Collect media for scouting.",
                microphonePermission: false,
            },
        ],
        [
            "expo-splash-screen",
            {
                backgroundColor: "#ffffff",
                image: "src/assets/images/splash-icon.png",
            },
        ],
    ],
});
