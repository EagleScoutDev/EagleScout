import { createContext, type Dispatch, type SetStateAction } from "react";
import { ThemeOptions } from "../../theme";

export const ThemeContext = createContext<{
    themePreference: ThemeOptions;
    setThemePreference: Dispatch<SetStateAction<ThemeOptions>>;
}>({
    themePreference: ThemeOptions.SYSTEM,
    setThemePreference: () => {},
});
