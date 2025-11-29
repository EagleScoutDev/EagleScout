import { createContext, useContext } from "react";
import { Theme, ThemeOption } from "../../theme";

export interface Theming {
    themePreference: ThemeOption;
    setThemePreference: (preference: ThemeOption) => void;
    theme: Theme;
}

export const ThemeContext = createContext<Theming>({
    themePreference: ThemeOption.system,
    setThemePreference: () => {},
    theme: Theme.get(ThemeOption.system),
});

export function useTheme(): Theme {
    return useContext(ThemeContext).theme;
}

export function useTheming(): Theming {
    return useContext(ThemeContext);
}
