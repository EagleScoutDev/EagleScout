import StandardModal from '../../../components/modals/StandardModal';
import StandardButton from '../../../components/StandardButton';
import Forms from '../../../database/Forms';
import React, {Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';

const FormOptionsModal = ({
  form,
  visible,
  setVisible,
  onSuccess,
  navigation,
}) => {
  const {colors} = useTheme();
  return (
    <StandardModal
      title={`Form '${form && form.name}'`}
      visible={visible}
      onDismiss={() => {
        setVisible(false);
      }}>
      <StandardButton
        text={'View'}
        onPress={() => {
          setVisible(false);
          navigation.navigate('Form Viewer', {
            questions: form.formStructure,
          });
        }}
        color={colors.primary}
      />
      <StandardButton
        text={'Delete'}
        onPress={() => {
          (async () => {
            let success = true;
            try {
              await Forms.deleteForm(form);
            } catch (e) {
              success = false;
              console.error(e);
              Alert.alert('Failed to delete form');
            }
            if (success) {
              onSuccess();
              setVisible(false);
            }
          })();
        }}
        color={colors.notification}
      />
      <StandardButton
        text={'Duplicate'}
        onPress={() => {
          setVisible(false);
          navigation.navigate('Form Creation Main', {
            form: form,
          });
        }}
        color={'green'}
      />
      <StandardButton
        text={'Cancel'}
        onPress={() => {
          setVisible(false);
        }}
        color={'gray'}
      />
    </StandardModal>
  );
};

export default FormOptionsModal;
