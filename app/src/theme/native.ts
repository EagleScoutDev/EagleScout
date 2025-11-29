import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useTheme } from "../lib/contexts/ThemeContext.ts";

export function useStackThemeConfig(): NativeStackNavigationOptions {
    const { colors } = useTheme();

    return {
        headerStyle: {
            backgroundColor: colors.bg1.hex,
        },
        headerTintColor: colors.fg.hex,
        headerTitleStyle: {
            color: colors.fg.hex,
        },
    };
}
