import React from 'react';
import {View, Text, Modal} from 'react-native';

interface SettingsPopupProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
}

const SettingsPopup = ({visible, setVisible}: SettingsPopupProps) => {
  return (
    <Modal
      visible={visible}
      presentationStyle={'overFullScreen'}
      onDismiss={() => setVisible(false)}>
      <Text>This will be in the settings popup.</Text>
    </Modal>
  );
};

export default SettingsPopup;
