import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { useTheme } from "@/ui/context/ThemeContext";
import { Platform } from "react-native";

export function useStackThemeConfig(): Readonly<NativeStackNavigationOptions> {
    const { colors } = useTheme();

    return {
        headerStyle: {
            backgroundColor: colors.bg2.hex,
        },
        headerTintColor: colors.fg.hex,
        headerTitleStyle: {
            color: colors.fg.hex,
        },
        headerBackTitle: "Back",
        headerBackButtonDisplayMode: "minimal",

        sheetCornerRadius: Platform.OS === "ios" ? undefined : 24,
        sheetShouldOverflowTopInset: false, //< FIXME: react-native-screens seems to forget about this when the bundle is reloaded??
    };
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
