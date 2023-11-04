import {Modal, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

function StandardModal({visible, title, children}) {
  const {colors} = useTheme();

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 20,
        }}>
        <View
          style={{
            width: '100%',
            backgroundColor: colors.card,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderColor: colors.border,
            borderWidth: 1,
            padding: 35,
            elevation: 5,
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
      </View>
    </Modal>
  );
}

export default StandardModal;
