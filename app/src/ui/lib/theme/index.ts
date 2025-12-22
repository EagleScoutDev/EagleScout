import { Color } from "../color";
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

    readonly win: Color;
    readonly loss: Color;

    readonly fg: Color;
    readonly placeholder: Color;
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
    coffee = "coffee",
    dune = "dune",
    forest = "forest",
    purple = "purple",
    midnight = "midnight",
    water = "water",
}
export const THEME_OPTIONS: { id: ThemeOption; name: string }[] = [
    { id: ThemeOption.system, name: "System" },
    { id: ThemeOption.light, name: "Light" },
    { id: ThemeOption.dark, name: "Dark" },
    { id: ThemeOption.coffee, name: "Coffee" },
    { id: ThemeOption.dune, name: "Dune" },
    { id: ThemeOption.forest, name: "Forest" },
    { id: ThemeOption.purple, name: "Purple" },
    { id: ThemeOption.midnight, name: "Midnight" },
    { id: ThemeOption.water, name: "Water" },
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

    export function get(preference: ThemeOption | undefined | null): Theme {
        const isDark = SYSTEM_COLOR_SCHEME === "dark";
        if (!preference) {
            return isDark ? dark : light;
        }
        switch (preference) {
            case ThemeOption.light:
                return light;
            case ThemeOption.dark:
                return dark;
            case ThemeOption.coffee:
                return coffee;
            case ThemeOption.dune:
                return dune;
            case ThemeOption.forest:
                return forest;
            case ThemeOption.purple:
                return purple;
            case ThemeOption.midnight:
                return midnight;
            case ThemeOption.water:
                return water;
            case ThemeOption.system:
                return isDark ? dark : light;
            default:
                // Fallback to system theme if preference is invalid
                return isDark ? dark : light;
        }
    }

    export const light: Theme = {
        motif: Color.hex("#ffffff"),

        dark: false,
        colors: {
            primary: Color.hex("#377cfb"),
            secondary: Color.hex("#7586ff"),
            tertiary: Color.hex("#ced5fa"),
            danger: Color.hex("#f13d3d"),

            win: Color.hex("#008500"),
            loss: Color.hex("#f13d3d"),

            fg: Color.hex("#0b0b0b"),
            placeholder: Color.hex("#424242"),
            bg0: Color.hex("#ffffff", Color.hex("#0b0b0b")),
            bg1: Color.hex("#faf9f9", Color.hex("#0b0b0b")),
            bg2: Color.hex("#f2f2f2", Color.hex("#0b0b0b")),

            border: Color.hex("#dbdbdb"),
            shadow: Color.hex("#000000"),
        },
    };

    export const dark: Theme = {
        motif: Color.hex("#151515"),

        dark: true,
        colors: {
            primary: Color.hex("#377cfb"),
            secondary: Color.hex("#555ebc"),
            tertiary: Color.hex("#49556a"),
            danger: Color.hex("#f13d3d"),

            win: Color.hex("#008500"),
            loss: Color.hex("#f13d3d"),

            fg: Color.hex("#e1e1e1"),
            placeholder: Color.hex("#656565"),
            bg0: Color.hex("#0c0c0c", Color.hex("#e1e1e1")),
            bg1: Color.hex("#121212", Color.hex("#e1e1e1")),
            bg2: Color.hex("#171717", Color.hex("#e1e1e1")),

            border: Color.hex("#303030"),
            shadow: Color.hex("#3a3a3a"),
        },
    };

    export const coffee: Theme = {
        motif: Color.hex("#fae0bf"),

        dark: false,
        colors: {
            primary: Color.hex("#67564a"),
            secondary: Color.hex("#bd724a"),
            tertiary: Color.hex("#e8b688"),
            danger: Color.hex("#d65858"),

            win: Color.hex("#00a800"),
            loss: Color.hex("#d65858"),

            fg: Color.hex("#17110e"),
            placeholder: Color.hex("#3e3e3e"),
            bg0: Color.hex("#fae1c0", Color.hex("#17110e")),
            bg1: Color.hex("#f8d6aa", Color.hex("#17110e")),
            bg2: Color.hex("#ecca9e", Color.hex("#17110e")),

            border: Color.hex("#916f5b"),
            shadow: Color.hex("#000000"),
        },
    };

    export const dune: Theme = {
        motif: Color.hex("#9a420c"),

        dark: true,
        colors: {
            primary: Color.hex("#ff9453"),
            secondary: Color.hex("#bd724a"),
            tertiary: Color.hex("#e3a584"),
            danger: Color.hex("#ff5555"),

            win: Color.hex("#008500"),
            loss: Color.hex("#f13d3d"),

            fg: Color.hex("#ffffff"),
            placeholder: Color.hex("#3a3a3a"),
            bg0: Color.hex("#a84f00", Color.hex("#ffffff")),
            bg1: Color.hex("#9a420c", Color.hex("#ffffff")),
            bg2: Color.hex("#e8a256", Color.hex("#ffffff")),

            border: Color.hex("#673c1e"),
            shadow: Color.hex("#000000"),
        },
    };

    export const forest: Theme = {
        motif: Color.hex("#0e7700"),

        dark: true,
        colors: {
            primary: Color.hex("#f15025"),
            secondary: Color.hex("#bd724a"),
            tertiary: Color.hex("#e3a584"),
            danger: Color.hex("#d00500"),

            win: Color.hex("#4eff4e"),
            loss: Color.hex("#d00500"),

            fg: Color.hex("#f1faee"),
            placeholder: Color.hex("#3a3a3a"),
            bg0: Color.hex("#273c2c", Color.hex("#f1faee")),
            bg1: Color.hex("#1e3123", Color.hex("#f1faee")),
            bg2: Color.hex("#18291b", Color.hex("#f1faee")),

            border: Color.hex("#0d2114"),
            shadow: Color.hex("#000000"),
        },
    };

    export const purple: Theme = {
        motif: Color.hex("#7f28ff"),

        dark: true,
        colors: {
            primary: Color.hex("#8F32DF"),
            secondary: Color.hex("#c61bff"),
            tertiary: Color.hex("#bc7eff"),
            danger: Color.hex("#754ae4"),

            win: Color.hex("#4eff4e"),
            loss: Color.hex("#d00500"),

            fg: Color.hex("#ffffff"),
            placeholder: Color.hex("#3a3a3a"),
            bg0: Color.hex("#1a0939", Color.hex("#ffffff")),
            bg1: Color.hex("#2f1565", Color.hex("#ffffff")),
            bg2: Color.hex("#381b75", Color.hex("#ffffff")),

            border: Color.hex("#794fac"),
            shadow: Color.hex("#000000"),
        },
    };

    export const midnight: Theme = {
        motif: Color.hex("#000000"),

        dark: true,
        colors: {
            primary: Color.hex("#0a84ff"),
            secondary: Color.hex("#6375ff"),
            tertiary: Color.hex("#7ba9ff"),
            danger: Color.hex("#ff453a"),

            win: Color.hex("#4eff4e"),
            loss: Color.hex("#d00500"),

            fg: Color.hex("#ffffff"),
            placeholder: Color.hex("#454545"),
            bg0: Color.hex("#000000", Color.hex("#ffffff")),
            bg1: Color.hex("#000000", Color.hex("#ffffff")),
            bg2: Color.hex("#000000", Color.hex("#ffffff")),

            border: Color.hex("#393942"),
            shadow: Color.hex("#000000"),
        },
    };

    export const water: Theme = {
        motif: Color.hex("#2469ff"),

        dark: true,
        colors: {
            primary: Color.hex("#59aaff"),
            secondary: Color.hex("#9958c6"),
            tertiary: Color.hex("#2e489c"),
            danger: Color.hex("#ff453a"),

            win: Color.hex("#4eff4e"),
            loss: Color.hex("#d00500"),

            fg: Color.hex("#ffffff"),
            placeholder: Color.hex("#3a3a3a"),
            bg0: Color.hex("#002377", Color.hex("#ffffff")),
            bg1: Color.hex("#002479", Color.hex("#ffffff")),
            bg2: Color.hex("#00267a", Color.hex("#ffffff")),

            border: Color.hex("#6f6fff"),
            shadow: Color.hex("#000000"),
        },
    };
}
