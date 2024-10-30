import {Theme} from '@react-navigation/native/src/types';
import {CustomLightTheme} from './CustomLightTheme';
import {DarkTheme} from '@react-navigation/native';
import {UltraDarkTheme} from './UltraDarkTheme';
import {ThemeOptions} from './ThemeOptions';
import {DuneTheme} from './DuneTheme';
import {WaterTheme} from './WaterTheme';
import {PurpleTheme} from './PurpleTheme';
import {ForestTheme} from './ForestTheme';
import {Coffee} from './CoffeeTheme';

export const ThemeOptionsMap: Map<ThemeOptions, Theme> = new Map([
  [ThemeOptions.LIGHT, CustomLightTheme],
  [ThemeOptions.DARK, DarkTheme],
  [ThemeOptions.ULTRA_DARK, UltraDarkTheme],
  [ThemeOptions.SYSTEM, CustomLightTheme], // Default to light theme, handles this in app.js
  [ThemeOptions.DUNE, DuneTheme],
  [ThemeOptions.WATER, WaterTheme],
  [ThemeOptions.PURPLE, PurpleTheme],
  [ThemeOptions.FOREST, ForestTheme],
  [ThemeOptions.COFFEE, Coffee],
]);
