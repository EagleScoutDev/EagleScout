import {Pressable, ScrollView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MinimalSectionHeader from '../MinimalSectionHeader';
import SegmentedOption from './SegmentedOption';
import FormHelper from '../../FormHelper';
import {useTheme} from '@react-navigation/native';
import {ThemeOptions} from '../../themes/ThemeOptions';
import {ThemeOptionsMap} from '../../themes/ThemeOptionsMap';
import {Circle} from 'react-native-svg';

function ThemePicker({setTheme}: {setTheme: (arg0: ThemeOptions) => void}) {
  const {colors} = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(ThemeOptions.SYSTEM);

  const saveThemePreference = async (value: ThemeOptions) => {
    try {
      await AsyncStorage.setItem(FormHelper.THEME, value.toString(10));
      console.log('[saveThemePreference] data: ' + value);
    } catch (e) {
      // saving error
      console.log('[saveThemePreference] error: ' + e);
    }
  };

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.THEME).then(r => {
      if (r != null) {
        console.log('theme found: ' + r);
        setSelectedTheme(parseInt(r, 10) as ThemeOptions);
      }
    });
  }, []);

  return (
    <View>
      <MinimalSectionHeader title="Theme" />
      <View
        style={{
          flexDirection: 'row',
          margin: 20,
          backgroundColor: colors.border,
          padding: 2,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          alignContent: 'center',
        }}>
        <ScrollView
          style={{
            flex: 1,
          }}>
          {Array.from(ThemeOptionsMap.keys()).map(themeOption => {
            return (
              <Pressable
                onPress={() => {
                  setSelectedTheme(themeOption);
                  saveThemePreference(themeOption).then(r =>
                    setTheme(themeOption),
                  );
                }}
                key={themeOption}
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  borderWidth: 2,
                  borderColor:
                    themeOption === selectedTheme
                      ? colors.primary
                      : colors.card,
                  // borderRadius: 10,
                  padding: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor:
                    themeOption === selectedTheme
                      ? colors.background
                      : colors.card,
                }}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <View
                    style={{
                      borderRadius: 200,
                      width: 40,
                      height: 40,
                      backgroundColor:
                        ThemeOptionsMap.get(themeOption)?.colors.background,
                    }}
                  />
                  {/*<View*/}
                  {/*  style={{*/}
                  {/*    borderRadius: 200,*/}
                  {/*    width: 40,*/}
                  {/*    height: 40,*/}
                  {/*    backgroundColor:*/}
                  {/*      ThemeOptionsMap.get(themeOption)?.colors.primary,*/}
                  {/*  }}*/}
                  {/*/>*/}
                  {/*<View*/}
                  {/*  style={{*/}
                  {/*    borderRadius: 200,*/}
                  {/*    width: 40,*/}
                  {/*    height: 40,*/}
                  {/*    backgroundColor:*/}
                  {/*      ThemeOptionsMap.get(themeOption)?.colors.card,*/}
                  {/*  }}*/}
                  {/*/>*/}
                  {/*<View*/}
                  {/*  style={{*/}
                  {/*    borderRadius: 200,*/}
                  {/*    width: 40,*/}
                  {/*    height: 40,*/}
                  {/*    backgroundColor:*/}
                  {/*      ThemeOptionsMap.get(themeOption)?.colors.text,*/}
                  {/*  }}*/}
                  {/*/>*/}
                </View>

                <Text style={{color: colors.text}}>
                  {ThemeOptions[themeOption].toLowerCase()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {/*<SegmentedOption*/}
        {/*  colors={colors}*/}
        {/*  title="Light"*/}
        {/*  selected={selectedTheme}*/}
        {/*  onPress={() => {*/}
        {/*    setSelectedTheme('Light');*/}
        {/*    saveThemePreference('Light').then(r => setTheme('Light'));*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<SegmentedOption*/}
        {/*  colors={colors}*/}
        {/*  title="Dark"*/}
        {/*  selected={selectedTheme}*/}
        {/*  onPress={() => {*/}
        {/*    setSelectedTheme('Dark');*/}
        {/*    saveThemePreference('Dark').then(r => setTheme('Dark'));*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<SegmentedOption*/}
        {/*  colors={colors}*/}
        {/*  title="System"*/}
        {/*  selected={selectedTheme}*/}
        {/*  onPress={() => {*/}
        {/*    setSelectedTheme('System');*/}
        {/*    saveThemePreference('System').then(r => setTheme('System'));*/}
        {/*  }}*/}
        {/*/>*/}
      </View>
    </View>
  );
}

export default ThemePicker;
