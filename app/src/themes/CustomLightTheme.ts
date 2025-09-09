import { Theme } from "@react-navigation/native";

export const CustomLightTheme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    card: 'rgb(242, 242, 242)',
    background: 'rgb(255, 255, 255)',
    text: 'rgb(0, 0, 0)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
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
};
