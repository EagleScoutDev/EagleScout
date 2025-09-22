import { useContext } from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { ThemeOptions, ThemeOptionsMap } from "../themes";
import { ThemeContext } from "../lib/contexts/ThemeContext";
import { useColorScheme } from "react-native";
import { CustomLightTheme } from "../themes";

export const ThemedNavigationContainer = ({
    children,
    navigationContainerProps = {},
}: {
    children: React.ReactNode;
    navigationContainerProps?: any;
}) => {
    const scheme = useColorScheme();
    const { themePreference } = useContext(ThemeContext);

    return (
        <NavigationContainer
            theme={
                themePreference === ThemeOptions.SYSTEM
                    ? scheme === "dark"
                        ? DarkTheme
                        : CustomLightTheme
                    : ThemeOptionsMap.get(themePreference)
            }
            {...navigationContainerProps}
        >
            {children}
        </NavigationContainer>
    );
};
