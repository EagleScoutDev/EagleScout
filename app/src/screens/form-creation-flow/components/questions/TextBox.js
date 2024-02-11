import React, {Alert, Text, TextInput, View} from 'react-native';
import StandardButton from '../../../../components/StandardButton';
import StandardModal from '../../../../components/modals/StandardModal';
import CheckBox from 'react-native-check-box';
import { useEffect, useState } from "react";

function Spacer() {
  return <View style={{height: '2%'}} />;
}

const TextBox = ({visible, setVisible, styles, onSubmit, value}) => {
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
        <CheckBox
          onClick={() => {
            setRequired(!required);
          }}
          isChecked={required}
        />
      </View>
      <StandardButton
        text={'Submit'}
        onPress={() => {
          setVisible(!submit());
        }}
        color={'blue'}
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

export default TextBox;
