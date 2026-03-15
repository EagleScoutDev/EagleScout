import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { useTheme } from "@/ui/context/ThemeContext";
import { Platform } from "react-native";

export function useStackThemeConfig(
    mode: "screen" | "layer" | "infoPage" | "infoSheet",
): Readonly<NativeStackNavigationOptions> {
    const { colors } = useTheme();

    const sheetBase: Readonly<NativeStackNavigationOptions> = {
        sheetCornerRadius: Platform.OS === "ios" ? (undefined as never) : 24,
        sheetShouldOverflowTopInset: false, //< FIXME: react-native-screens seems to forget about this when the bundle is reloaded??
    };
    const screenBase: Readonly<NativeStackNavigationOptions> = {
        headerShown: true,
        headerLargeTitleEnabled: false,
        headerStyle: {
            backgroundColor: colors.bg2.hex,
        },
        headerTintColor: colors.fg.hex,
        headerTitleStyle: {
            color: colors.fg.hex,
        },
        headerBackTitle: "Back",
        headerBackButtonDisplayMode: "minimal",
    };

    switch (mode) {
        case "screen":
            return screenBase;
        case "layer":
            return {
                headerShown: false,
            };
        case "infoPage":
            return {
                headerShown: true,
                headerBackButtonDisplayMode: "minimal",
                headerTransparent: Platform.OS === "ios",
            };
        case "infoSheet":
            return {
                ...sheetBase,
                headerShown: true,
                headerTransparent: Platform.OS === "ios",
                presentation: "pageSheet",
            };
    }
}

export function useMaterialTopTabThemeConfig(): Readonly<MaterialTopTabNavigationOptions> {
    const { colors } = useTheme();

    return {
        tabBarStyle: {
            backgroundColor: colors.bg1.hex,
        },
        tabBarIndicatorStyle: {
            backgroundColor: colors.primary.hex,
        },
        tabBarLabelStyle: {
            color: colors.fg.hex,
            fontSize: 12,
            fontWeight: 600,
        },
    };
}
