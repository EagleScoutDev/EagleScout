import React from 'react';
import {View, Text, Modal, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import StandardButton from '../../components/StandardButton';

interface SettingsPopupProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  navigation: ReactNavigation.RootParamList;
  // setOled: (arg0: boolean) => void;
}

const SettingsPopup = ({
  visible,
  setVisible,
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
