import {Modal, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

function StandardModal({visible, title, children}) {
  const {colors} = useTheme();

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={{
          backgroundColor: colors.card,
          justifyContent: 'center',
          alignItems: 'center',
          top: '30%',
          borderRadius: 20,
          borderColor: colors.border,
          borderWidth: 1,
          padding: 35,
          elevation: 5,
          margin: 20,
        }}>
        <Text
          style={{
            fontSize: 30,
            color: colors.text,
            fontWeight: '600',
            paddingBottom: 20,
          }}>
          {title}
        </Text>
        {children}
      </View>
    </Modal>
  );
}

export default StandardModal;
