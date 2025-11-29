import { createContext, type Dispatch, type SetStateAction } from "react";
import { CustomLightTheme, ThemeOptions } from "../../theme";
import { DarkTheme, type Theme } from "@react-navigation/native";
import { Appearance } from "react-native";

export const ThemeContext = createContext<{
    themePreference: ThemeOptions;
    setThemePreference: Dispatch<SetStateAction<ThemeOptions>>;
    theme: Theme;
}>({
    themePreference: ThemeOptions.SYSTEM,
    setThemePreference: () => {},
    theme: Appearance.getColorScheme() === "dark" ? DarkTheme : CustomLightTheme,
});
