import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import StandardButton from '../../components/StandardButton';
import {TagsDB} from '../../database/Tags';

const CreateTagModal = ({visible, setVisible}) => {
  const {colors} = useTheme();
  const [tagName, setTagName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const submitTag = () => {
    setIsLoading(true);
    console.log('tag name: ', tagName);
    TagsDB.createTag(2, tagName).then(() => {
      setTagName('');
      setIsLoading(false);
      setVisible(false);
    });
  };

  return (
    <Modal
      onRequestClose={() => setVisible(false)}
      transparent={true}
      animationType={'fade'}
      visible={visible}>
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: colors.card,
                padding: '5%',
                margin: '5%',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: '5%',
                }}>
                Create Tag
              </Text>
              <TextInput
                style={{
                  color: colors.text,
                  backgroundColor: colors.background,
                  padding: '5%',
                  borderRadius: 10,
                  minWidth: '100%',
                }}
                placeholder={'Tag Name'}
                placeholderTextColor={'gray'}
                value={tagName}
                onChangeText={setTagName}
              />
              <Pressable
                disabled={tagName === ''}
                onPress={() => submitTag()}
                style={{
                  backgroundColor: tagName === '' ? 'gray' : colors.primary,
                  padding: '5%',
                  borderRadius: 10,
                  marginTop: '5%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                }}>
                {isLoading && <ActivityIndicator color={'white'} />}
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Create Tag
                </Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateTagModal;
