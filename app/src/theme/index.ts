import { Color } from "../lib/color.ts";
import { Appearance } from "react-native";
import { type Theme as RNTheme } from "@react-navigation/native";

// TODO: this is a hack because doing Appearance.getColorScheme(null) to bypass our own modifications doesn't seem to be working right now
const SYSTEM_COLOR_SCHEME = Appearance.getColorScheme();

export interface Theme {
    readonly motif: Color;

    readonly dark: boolean;
    readonly colors: ThemeColors;
}
export interface ThemeColors {
    readonly primary: Color;
    readonly secondary: Color;
    readonly tertiary: Color;
    readonly danger: Color;

    readonly fg: Color;
    readonly bg0: Color;
    readonly bg1: Color;
    readonly bg2: Color;

    readonly border: Color;
    readonly shadow: Color;
}

export enum ThemeOption {
    system = "system",
    light = "light",
    dark = "dark",
}
export const THEME_OPTIONS: { id: ThemeOption; name: string }[] = [
    { id: ThemeOption.system, name: "System" },
    { id: ThemeOption.light, name: "Light" },
    { id: ThemeOption.dark, name: "Dark" },
];

export namespace Theme {
    const rnifyCache = new Map<Theme, RNTheme>();
    export function toReactNavigation(theme: Theme): RNTheme {
        if (rnifyCache.has(theme)) return rnifyCache.get(theme)!;

        const { dark, colors } = theme;
        const ret: RNTheme = {
            fonts: {
                regular: { fontFamily: "sans-serif", fontWeight: "normal" },
                medium: { fontFamily: "sans-serif", fontWeight: "500" },
                bold: { fontFamily: "sans-serif", fontWeight: "700" },
                heavy: { fontFamily: "sans-serif", fontWeight: "900" },
            },
            colors: {
                background: colors.bg0.hex,
                border: colors.border.hex,
                card: colors.bg1.hex,
                notification: colors.danger.hex,
                primary: colors.primary.hex,
                text: colors.fg.hex,
            },
            dark,
        };
        rnifyCache.set(theme, ret);
        return ret;
    }

    export function get(preference: ThemeOption) {
        switch (preference) {
            case ThemeOption.light:
                return light;
            case ThemeOption.dark:
                return dark;
            case ThemeOption.system:
                return SYSTEM_COLOR_SCHEME === "dark" ? dark : light;
        }
    }

    export const light: Theme = {
        motif: Color.hex("#ffffff"),

        dark: false,
        colors: {
            primary: Color.hex("#3478f6"),
            secondary: Color.hex("#6375ff"),
            tertiary: Color.hex("#7ba9ff"),
            danger: Color.hex("#f13d3d"),

            fg: Color.hex("#0b0b0b"),
            bg0: Color.hex("#ffffff", Color.hex("#0b0b0b")),
            bg1: Color.hex("#faf9f9", Color.hex("#0b0b0b")),
            bg2: Color.hex("#f2f2f2", Color.hex("#0b0b0b")),

            border: Color.hex("#dbdbdb"),
            shadow: Color.hex("#000000"),
        },
    };

    export const dark: Theme = {
        motif: Color.hex("#000000"),

        dark: true,
        colors: {
            primary: Color.hex("#3478f6"),
            secondary: Color.hex("#6375ff"),
            tertiary: Color.hex("#7ba9ff"),
            danger: Color.hex("#f13d3d"),

            fg: Color.hex("#ffffff"),
            bg0: Color.hex("#0c0c0c", Color.hex("#ffffff")),
            bg1: Color.hex("#121212", Color.hex("#ffffff")),
            bg2: Color.hex("#171717", Color.hex("#ffffff")),

            border: Color.hex("#303030"),
            shadow: Color.hex("#3a3a3a"),
        },
    };

    export const coffee: Theme = {
        motif: Color.hex("#fae0bf"),

        dark: false,
        colors: {
            primary: Color.hex("#ff5555"),
            secondary: Color.hex("#ff5555"),
            tertiary: Color.hex("#ff5555"),
            danger: Color.hex("#ff5555"),

            fg: Color.hex("#1e1612"),
            bg0: Color.hex("#fae0bf", Color.hex("#1e1612")),
            bg1: Color.hex("#f3be82", Color.hex("#1e1612")),
            bg2: Color.hex("#e8a256", Color.hex("#1e1612")),

            border: Color.hex("#60300e"),
            shadow: Color.hex("#000000"),
        },
    };

    // export const CustomLightTheme: Theme = {
    //     dark: false
    //     colors: {
    //         primary: Color.rgb(0, 122, 255),
    //         card: Color.rgb(242, 242, 242),
    //         background: Color.rgb(255, 255, 255),
    //         text: Color.rgb(0, 0, 0),
    //         border: Color.rgb(216, 216, 216),
    //         danger: Color.rgb(255, 59, 48),
    //     },
    // };
    //
    // export const DuneTheme: Theme = {
    //     dark: true,
    //     colors: {
    //         primary: Color.rgb(255, 148, 83),
    //         background: Color.rgb(168, 79, 0),
    //         card: Color.rgb(154, 66, 12),
    //         text: Color.rgb(255, 255, 255),
    //         border: Color.rgb(103, 60, 30),
    //         danger: Color.rgb(255, 69, 58),
    //     },
    // };
    //
    // export const ForestTheme: Theme = {
    //     dark: true,
    //     colors: {
    //         primary: Color.rgb(241, 80, 37),
    //         background: Color.rgb(39, 60, 44),
    //         card: Color.rgb(30, 49, 35),
    //         text: Color.rgb(241, 250, 238),
    //         border: Color.rgb(13, 33, 20),
    //         danger: Color.rgb(208, 5, 0),
    //     },
    // };
    //
    // export const PurpleTheme: Theme = {
    //     dark: true,
    //     colors: {
    //         primary: Color.rgb(143, 50, 223),
    //         background: Color.rgb(26, 9, 57),
    //         card: Color.rgb(47, 21, 101),
    //         text: Color.rgb(255, 255, 255),
    //         border: Color.rgb(203, 151, 246),
    //         danger: Color.rgb(125, 96, 211),
    //     },
    // };
    //
    // export const UltraDarkTheme: Theme = {
    //     dark: true,
    //     colors: {
    //         primary: Color.rgb(10, 132, 255),
    //         background: Color.rgb(0, 0, 0),
    //         card: Color.rgb(0, 0, 0),
    //         text: Color.rgb(255, 255, 255),
    //         border: Color.rgb(39, 39, 41),
    //         danger: Color.rgb(255, 69, 58),
    //     },
    // };
    //
    // export const WaterTheme: Theme = {
    //     dark: true,
    //     colors: {
    //         primary: Color.rgb(89, 170, 255),
    //         background: Color.rgb(0, 35, 119),
    //         card: Color.rgb(0, 36, 121),
    //         text: Color.rgb(255, 255, 255),
    //         border: Color.rgb(111, 111, 255),
    //         danger: Color.rgb(255, 69, 58),
    //     },
    // };
}
