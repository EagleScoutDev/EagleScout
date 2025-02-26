import React, {Alert, Text, TextInput, View} from 'react-native';
import StandardButton from '../../../../components/StandardButton';
import StandardModal from '../../../../components/modals/StandardModal';
import {useEffect, useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useTheme} from '@react-navigation/native';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

const TextBox = ({visible, setVisible, styles, onSubmit, value}) => {
  const {colors} = useTheme();
  const [question, setQuestion] = useState('');
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (value && value.type === 'textbox') {
      setQuestion(value.question);
      setRequired(value.required);
    }
  }, [value]);

  const submit = () => {
    if (question === '') {
      Alert.alert('Please enter a question');
      return false;
    }
    onSubmit({
      type: 'textbox',
      question: question,
      required: required,
    });
    return true;
  };

  return (
    <StandardModal
      title="New textbox"
      visible={visible}
      onDismiss={() => {
        setVisible(false);
      }}>
      <Spacer />
      <Text style={styles.label}>Question</Text>
      <Spacer />
      <TextInput
        style={styles.textInput}
        placeholder="Question"
        onChangeText={text => setQuestion(text)}
        value={question}
      />
      <Spacer />
      <View style={styles.rowContainer}>
        <Text style={styles.label}>Required</Text>
        <BouncyCheckbox
          onClick={() => {
            setRequired(!required);
          }}
          isChecked={required}
          bounceEffectIn={1}
          bounceEffectOut={1}
          style={{
            marginRight: '6%',
          }}
          textStyle={{
            textDecorationLine: 'none',
          }}
          iconStyle={{
            borderRadius: 3,
          }}
          fillColor={colors.text}
          innerIconStyle={{borderRadius: 3}}
        />
      </View>
      <StandardButton
        text={'Submit'}
        onPress={() => {
          setVisible(!submit());
        }}
        color={colors.primary}
      />
      <StandardButton
        text={'Cancel'}
        onPress={() => {
          setVisible(false);
        }}
        color={colors.notification}
      />
    </StandardModal>
  );
};

export default TextBox;
