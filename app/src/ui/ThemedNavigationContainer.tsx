import { useContext } from "react";
import { DarkTheme, NavigationContainer, type NavigationContainerProps } from "@react-navigation/native";
import { CustomLightTheme, ThemeOptions, ThemeOptionsMap } from "../theme";
import { ThemeContext } from "../lib/contexts/ThemeContext";
import { useColorScheme } from "react-native";

export interface ThemedNavigationContainerProps extends NavigationContainerProps {}
export function ThemedNavigationContainer(props: ThemedNavigationContainerProps) {
    "use memo";
    const scheme = useColorScheme();
    const { themePreference } = useContext(ThemeContext);

    return (
        <NavigationContainer
            theme={
                themePreference === ThemeOptions.SYSTEM
                    ? scheme === "dark"
                        ? DarkTheme
                        : CustomLightTheme
                    : ThemeOptionsMap.get(themePreference)!
            }
            {...props}
        />
    );
}
