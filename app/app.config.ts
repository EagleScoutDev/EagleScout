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
            // "./plugins/stallion.ts",
            "expo-stallion-plugin",
            {
                projectId: process.env.EXPO_PUBLIC_STALLION_ID,
                appToken: process.env.EXPO_PUBLIC_STALLION_APP_TOKEN,
                // Force release builds to use bundled JS while debugging runtime issues.
                enableBundleOverride: false,
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
