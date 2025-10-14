import { type Theme } from "@react-navigation/native";

const BaseTheme = {
    fonts: {
        regular: {
            fontFamily: "sans-serif",
            fontWeight: "normal"
        },
        medium: {
            fontFamily: "sans-serif",
            fontWeight: "500"
        },
        bold: {
            fontFamily: "sans-serif",
            fontWeight: "700"
        },
        heavy: {
            fontFamily: "sans-serif",
            fontWeight: "900"
        }
    }
} as const

export const CoffeeTheme: Theme = {
    ...BaseTheme,
    dark: false,
    colors: {
        primary: 'rgb(78,44,4)',
        background: 'rgb(239,174,109)',
        card: 'rgb(197,133,71)',
        label: 'rgb(106,63,19)',
        border: 'rgb(129,84,37)',
        notification: 'rgb(166,109,50)',
    }
};

export const CustomLightTheme: Theme = {
    ...BaseTheme,
    dark: false,
    colors: {
        primary: 'rgb(0, 122, 255)',
        card: 'rgb(242, 242, 242)',
        background: 'rgb(255, 255, 255)',
        label: 'rgb(0, 0, 0)',
        border: 'rgb(216, 216, 216)',
        notification: 'rgb(255, 59, 48)',
    }
};

export const DuneTheme: Theme = {
    ...BaseTheme,
    dark: true,
    colors: {
        primary: 'rgb(255,148,83)',
        background: 'rgb(168,79,0)',
        card: 'rgb(154,66,12)',
        label: 'rgb(255, 255, 255)',
        border: 'rgb(103,60,30)',
        notification: 'rgb(255, 69, 58)',
    }
};

export const ForestTheme: Theme = {
    ...BaseTheme,
    dark: true,
    colors: {
        primary: 'rgb(241, 80, 37)',
        background: 'rgb(39, 60, 44)',
        card: 'rgb(30,49,35)',
        label: 'rgb(241, 250, 238)',
        border: 'rgb(13,33,20)',
        notification: 'rgb(208,5,0)',
    }
};

export const PurpleTheme: Theme = {
    ...BaseTheme,
    dark: true,
    colors: {
        primary: 'rgb(143,50,223)',
        background: 'rgb(26,9,57)',
        card: 'rgb(47,21,101)',
        label: 'rgb(255, 255, 255)',
        border: 'rgb(203,151,246)',
        notification: 'rgb(125,96,211)',
    }
};

export const UltraDarkTheme: Theme = {
    ...BaseTheme,
    dark: true,
    colors: {
        primary: 'rgb(10, 132, 255)',
        background: 'rgb(0, 0, 0)',
        card: 'rgb(0, 0, 0)',
        label: 'rgb(255, 255, 255)',
        border: 'rgb(39, 39, 41)',
        notification: 'rgb(255, 69, 58)',
    }
};

export const WaterTheme: Theme = {
    ...BaseTheme,
    dark: true,
    colors: {
        primary: 'rgb(89,170,255)',
        background: 'rgb(0,35,119)',
        card: 'rgb(0,36,121)',
        label: 'rgb(255, 255, 255)',
        border: 'rgb(111,111,255)',
        notification: 'rgb(255, 69, 58)',
    }
};
