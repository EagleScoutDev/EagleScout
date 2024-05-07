import {View} from 'react-native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MinimalSectionHeader from '../MinimalSectionHeader';
import SegmentedOption from './SegmentedOption';
import FormHelper from '../../FormHelper';
import {useTheme} from '@react-navigation/native';

function ThemePicker({setTheme}: {setTheme: (arg0: string) => void}) {
  const {colors} = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('System');

  const saveThemePreference = async (value: string) => {
    try {
      await AsyncStorage.setItem(FormHelper.THEME, value);
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
        setSelectedTheme(r);
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
          alignContent: 'center',
        }}>
        <SegmentedOption
          colors={colors}
          title="Light"
          selected={selectedTheme}
          onPress={() => {
            setSelectedTheme('Light');
            saveThemePreference('Light').then(r => setTheme('Light'));
          }}
        />
        <SegmentedOption
          colors={colors}
          title="Dark"
          selected={selectedTheme}
          onPress={() => {
            setSelectedTheme('Dark');
            saveThemePreference('Dark').then(r => setTheme('Dark'));
          }}
        />
        <SegmentedOption
          colors={colors}
          title="System"
          selected={selectedTheme}
          onPress={() => {
            setSelectedTheme('System');
            saveThemePreference('System').then(r => setTheme('System'));
          }}
        />
      </View>
    </View>
  );
}

export default ThemePicker;
