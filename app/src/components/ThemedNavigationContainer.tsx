import React, {useContext, useState} from 'react';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {ThemeOptions} from '../themes/ThemeOptions';
import {CustomLightTheme} from '../themes/CustomLightTheme';
import {ThemeOptionsMap} from '../themes/ThemeOptionsMap';
import {ThemeContext} from '../lib/contexts/ThemeContext';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemedNavigationContainer = ({
  children,
  navigationContainerProps = {},
}: {
  children: React.ReactNode;
  navigationContainerProps?: any;
}) => {
  const scheme = useColorScheme();
  const {themePreference, onboardingActive} = useContext(ThemeContext);

  return (
    <NavigationContainer
      theme={
        onboardingActive
          ? DarkTheme
          : themePreference === ThemeOptions.SYSTEM
          ? scheme === 'dark'
            ? DarkTheme
            : CustomLightTheme
          : ThemeOptionsMap.get(themePreference)
      }
      {...navigationContainerProps}>
      {children}
    </NavigationContainer>
  );
};
