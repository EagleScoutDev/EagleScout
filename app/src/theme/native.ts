import { useTheme } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export function useStackThemeConfig(): NativeStackNavigationOptions {
    const { colors } = useTheme();

    return {
        headerStyle: {
            backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
            color: colors.text,
        },
    };
}
