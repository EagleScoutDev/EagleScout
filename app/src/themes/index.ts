import { DarkTheme, type Theme } from "@react-navigation/native";
import { CustomLightTheme, UltraDarkTheme, DuneTheme, WaterTheme, PurpleTheme, ForestTheme, CoffeeTheme } from "./definitions";

export enum ThemeOptions {
    LIGHT,
    DARK,
    ULTRA_DARK,
    DUNE,
    WATER,
    PURPLE,
    FOREST,
    SYSTEM,
    COFFEE,
}

export const ThemeOptionsMap: Map<ThemeOptions, Theme> = new Map([
    [ThemeOptions.LIGHT, CustomLightTheme],
    [ThemeOptions.DARK, DarkTheme],
    [ThemeOptions.ULTRA_DARK, UltraDarkTheme],
    [ThemeOptions.SYSTEM, CustomLightTheme], // Default to light theme, handles this in app.js
    [ThemeOptions.DUNE, DuneTheme],
    [ThemeOptions.WATER, WaterTheme],
    [ThemeOptions.PURPLE, PurpleTheme],
    [ThemeOptions.FOREST, ForestTheme],
    [ThemeOptions.COFFEE, CoffeeTheme],
]);

export * from "./definitions"
