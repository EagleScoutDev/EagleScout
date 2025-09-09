import {createContext, Dispatch, SetStateAction} from 'react';
import {ThemeOptions} from '../../themes';

export const ThemeContext = createContext<{
  themePreference: ThemeOptions;
  setThemePreference: Dispatch<SetStateAction<ThemeOptions>>;
  onboardingActive: boolean;
  setOnboardingActive: Dispatch<SetStateAction<boolean>>;
}>({
  themePreference: ThemeOptions.SYSTEM,
  setThemePreference: () => {},
  onboardingActive: true,
  setOnboardingActive: () => {},
});
