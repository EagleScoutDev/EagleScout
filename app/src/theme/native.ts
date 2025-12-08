import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useTheme } from "../lib/contexts/ThemeContext.ts";
import type { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";

export function useStackThemeConfig(): NativeStackNavigationOptions {
    const { colors } = useTheme();

    return {
        headerStyle: {
            backgroundColor: colors.bg2.hex,
        },
        headerTintColor: colors.fg.hex,
        headerTitleStyle: {
            color: colors.fg.hex,
        },
    };
}

export function useMaterialTopTabThemeConfig(): MaterialTopTabNavigationOptions {
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
