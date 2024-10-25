import React, {useEffect} from 'react';
import {View, Text, Modal, Pressable, Switch} from 'react-native';
import ThemePicker from '../../components/pickers/ThemePicker';
import {useTheme} from '@react-navigation/native';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import StandardButton from '../../components/StandardButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormHelper from '../../FormHelper';
import {Theme} from '@react-navigation/native/src/types';
import {ThemeOptions} from '../../themes/ThemeOptions';

interface SettingsPopupProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  setTheme: (arg0: ThemeOptions) => void;
  navigation: ReactNavigation.RootParamList;
  // setOled: (arg0: boolean) => void;
}

const SettingsPopup = ({
  visible,
  setVisible,
  setTheme,
  navigation,
}: // setOled,
SettingsPopupProps) => {
  const {colors} = useTheme();

  // const saveOledPreference = async value => {
  //   try {
  //     await AsyncStorage.setItem(FormHelper.OLED, value);
  //     console.log('[saveOledPreference] data: ' + value);
  //   } catch (e) {
  //     // saving error
  //     console.log('[saveOledPreference] error: ' + e);
  //   }
  // };

  // useEffect(() => {
  //   FormHelper.readAsyncStorage(FormHelper.OLED).then(value => {
  //     if (value != null) {
  //       console.log('[useEffect] data: ' + value);
  //       // setLocalOled(JSON.parse(value));
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if (localOled != null) {
  //     saveOledPreference(JSON.stringify(localOled)).then(() => {
  //       console.log('Saved OLED preference');
  //     });
  //   }
  // }, [localOled]);

  return (
    <Modal
      visible={visible}
      presentationStyle={'formSheet'}
      animationType={'slide'}
      onRequestClose={() => setVisible(false)}
      onDismiss={() => setVisible(false)}>
      <View
        style={{
          backgroundColor: colors.card,
          flex: 1,
        }}>
        <Pressable onPress={() => setVisible(false)}>
          <Text
            style={{
              color: colors.text,
              fontSize: 24,
              marginVertical: '5%',
              paddingLeft: '5%',
            }}>
            Settings
          </Text>
        </Pressable>
        <ThemePicker setTheme={setTheme} />
        <MinimalSectionHeader title={'Dev Tools'} />
        <StandardButton
          color={'black'}
          isLoading={false}
          onPress={() => {
            setVisible(false);
            navigation.navigate('Debug Offline');
          }}
          text={'View Device Storage'}
        />
      </View>
    </Modal>
  );
};

export default SettingsPopup;
