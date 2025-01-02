import {createContext, Dispatch, SetStateAction} from 'react';
import {ThemeOptions} from '../../themes/ThemeOptions';

export const ThemeContext = createContext<{
  themePreference: ThemeOptions;
  setThemePreference: Dispatch<SetStateAction<ThemeOptions>>;
}>({
  themePreference: ThemeOptions.SYSTEM,
  setThemePreference: () => {},
});