import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { useTheme } from "@/ui/context/ThemeContext";

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
