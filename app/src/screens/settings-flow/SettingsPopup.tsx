import React from 'react';
import {View, Text, Modal, Pressable} from 'react-native';
import ThemePicker from '../../components/pickers/ThemePicker';
import ScoutingStylePicker from '../../components/pickers/ScoutingStylePicker';
import {useTheme} from '@react-navigation/native';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import StandardButton from '../../components/StandardButton';

interface SettingsPopupProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  setTheme: (arg0: string) => void;
  setScoutingStyle: (arg0: string) => void;
  navigation: ReactNavigation.RootParamList;
}

const SettingsPopup = ({
  visible,
  setVisible,
  setTheme,
  setScoutingStyle,
  navigation,
}: SettingsPopupProps) => {
  const {colors} = useTheme();
  return (
    <Modal
      visible={visible}
      presentationStyle={'formSheet'}
      animationType={'slide'}
      onDismiss={() => setVisible(false)}>
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
      <ThemePicker colors={colors} setTheme={setTheme} />
      <ScoutingStylePicker
        colors={colors}
        setScoutingStyle={setScoutingStyle}
      />
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
    </Modal>
  );
};

export default SettingsPopup;
