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
import {useEffect, useState} from 'react';
import StandardButton from '../../../../components/StandardButton';
import RadioOptionsSeparator from './RadioOptionsSeparator';
import CheckBox from 'react-native-check-box';
import {useTheme} from '@react-navigation/native';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

const Number = ({visible, setVisible, styles, onSubmit, value}) => {
  const [question, setQuestion] = useState('');
  const [slider, setSlider] = useState(false);
  const [low, setLow] = useState('');
  const [high, setHigh] = useState('');
  const [step, setStep] = useState('1');
  const {colors} = useTheme();

  useEffect(() => {
    if (value && value.type === 'number') {
      setQuestion(value.question);
      setSlider(value.slider);
      setLow(value.low == null ? '' : value.low.toString());
      setHigh(value.high == null ? '' : value.high.toString());
      setStep(value.step.toString());
    }
  }, [value]);

  const submit = () => {
    if (question === '') {
      Alert.alert('Please enter a question');
      return false;
    }
    if (slider) {
      if (low === null) {
        Alert.alert('Please enter a low value');
        return false;
      }
      if (high === null) {
        Alert.alert('Please enter a high value');
        return false;
      }
    }
    if (slider && !/^\d+$/.test(low)) {
      Alert.alert('Low must be a positive integer');
      return false;
    } else if (!slider && !/^\d+$/.test(low) && low !== '') {
      Alert.alert('Low must be a positive integer or blank');
      return false;
    }
    if (slider && !/^\d+$/.test(high)) {
      Alert.alert('High must be a positive integer');
      return false;
    } else if (!slider && !/^\d+$/.test(high) && high !== '') {
      Alert.alert('High must be a positive integer or blank');
      return false;
    }
    if (step === '') {
      Alert.alert('Please enter a step');
      return false;
    }
    if (!/^\d+$/.test(step)) {
      Alert.alert('Step must be a positive integer');
      return false;
    }
    const lowParsed = low === '' ? null : parseInt(low, 10);
    const highParsed = high === '' ? null : parseInt(high, 10);
    const stepParsed = parseInt(step, 10);
    if (lowParsed != null && highParsed != null && lowParsed > highParsed) {
      Alert.alert('Low must be less than high');
      return false;
    }
    onSubmit({
      type: 'number',
      question: question,
      slider: slider,
      low: lowParsed,
      high: highParsed,
      step: stepParsed,
    });
    return true;
  };

  return (
    <StandardModal
      title="New Number Question"
      visible={visible}
      onDismiss={() => {
        setVisible(false);
      }}>
      <View style={styles.rowContainer}>
        <Text style={styles.rowLabel}>
          Question: <Text style={styles.requiredStarText}>*</Text>
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setQuestion}
          value={question}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>Slider</Text>
        <CheckBox
          onClick={() => {
            setSlider(!slider);
          }}
          isChecked={slider}
        />
      </View>
      <Spacer />
      <View style={styles.rowContainer}>
        <Text style={styles.rowLabel}>
          Low:{slider && <Text style={styles.requiredStarText}>*</Text>}
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setLow}
          value={low}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.rowLabel}>
          High:{slider && <Text style={styles.requiredStarText}>*</Text>}
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setHigh}
          value={high}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.rowLabel}>
          Step:<Text style={styles.requiredStarText}>*</Text>
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setStep}
          value={step}
          keyboardType="numeric"
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
        color={colors.card}
      />
    </StandardModal>
  );
};

export default Number;
