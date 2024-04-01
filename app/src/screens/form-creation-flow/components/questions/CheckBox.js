import StandardModal from '../../../../components/modals/StandardModal';
import React, {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useEffect, useState } from "react";
import StandardButton from '../../../../components/StandardButton';
import CheckBox from 'react-native-check-box';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

const CheckBoxFunction = ({visible, setVisible, styles, onSubmit, value}) => {
  const [question, setQuestion] = useState('');
  const [checkedByDefault, setCheckedByDefault] = useState(false);

  useEffect(() => {
    if (value && value.type === 'checkbox') {
      setQuestion(value.question);
      setCheckedByDefault(value.checkedByDefault);
    }
  }, [value]);

  const submit = () => {
    if (question === '') {
      Alert.alert('Please enter a question');
      return false;
    }
    onSubmit({
      type: 'checkbox',
      question: question,
      checkedByDefault: checkedByDefault,
    });
    return true;
  };

  return (
    <StandardModal
      title="New checkbox question"
      visible={visible}
      onDismiss={() => {
        setVisible(false);
      }}>
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
        <Text style={styles.label}>Checked by default</Text>
        <CheckBox
          onClick={() => {
            setCheckedByDefault(!checkedByDefault);
          }}
          isChecked={checkedByDefault}
        />
      </View>
      <Spacer />
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

export default CheckBoxFunction;
