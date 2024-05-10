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
import NewQuestionSeparator from '../NewQuestionSeparator';
import RadioOptionsSeparator from './RadioOptionsSeparator';
import CheckBox from 'react-native-check-box';
import {useTheme} from '@react-navigation/native';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

const Radio = ({visible, setVisible, styles, onSubmit, value}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [addOptionModalVisible, setAddOptionModalVisible] = useState(false);
  const [manageOptionModalVisible, setManageOptionModalVisible] =
    useState(false);
  const [optionText, setOptionText] = useState('');
  const [setIndex, setSetIndex] = useState(0);
  const [required, setRequired] = useState(false);
  const [defaultIndex, setDefaultIndex] = useState(-1);
  const {colors} = useTheme();

  useEffect(() => {
    if (value && value.type === 'radio') {
      setQuestion(value.question);
      setOptions(value.options);
      setRequired(value.required);
      setDefaultIndex(value.defaultIndex === null ? -1 : value.defaultIndex);
    }
  }, [value]);

  const submit = () => {
    if (question === '') {
      Alert.alert('Please enter a question');
      return false;
    }
    if (options.length === 0) {
      Alert.alert('Please enter at least one option');
      return false;
    }
    onSubmit({
      type: 'radio',
      question: question,
      options: options,
      required: required,
      defaultIndex: defaultIndex === -1 ? null : defaultIndex,
    });
    return true;
  };

  return (
    <StandardModal
      title="New Radio Question"
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
      <Text style={{color: colors.text}}>
        Click '+' to add a new radio option. To delete an option, long press on
        it.
      </Text>
      <Spacer />
      <Text style={styles.label}>Options:</Text>
      <ScrollView
        style={{
          maxHeight: '70%',
          width: '100%',
        }}
        onStartShouldSetResponder={() => true}>
        {options.map((option, index) => {
          return (
            <View key={index}>
              <TouchableOpacity>
                <RadioOptionsSeparator
                  onPress={() => {
                    setSetIndex(index);
                    setAddOptionModalVisible(true);
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onLongPress={() => {
                  setSetIndex(index);
                  setManageOptionModalVisible(true);
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    fontWeight: defaultIndex === index ? 'bold' : 'normal',
                  }}>
                  {option}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <TouchableOpacity>
          <RadioOptionsSeparator
            onPress={() => {
              setSetIndex(options.length);
              setAddOptionModalVisible(true);
            }}
          />
        </TouchableOpacity>
      </ScrollView>
      <StandardModal
        title={'New Option'}
        visible={addOptionModalVisible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <Spacer />
        <Text style={styles.label}>Option</Text>
        <Spacer />
        <TextInput
          style={styles.textInput}
          placeholder="Option"
          onChangeText={text => setOptionText(text)}
          value={optionText}
        />
        <Spacer />
        <StandardButton
          text={'Submit'}
          onPress={() => {
            setOptions([
              ...options.slice(0, setIndex),
              optionText,
              ...options.slice(setIndex),
            ]);
            setOptionText('');
            setAddOptionModalVisible(false);
          }}
          color={colors.primary}
        />
        <StandardButton
          text={'Cancel'}
          onPress={() => {
            setOptionText('');
            setAddOptionModalVisible(false);
          }}
          color={colors.card}
        />
      </StandardModal>
      <StandardModal
        title={'Manage option'}
        visible={manageOptionModalVisible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <StandardButton
          text={setIndex !== defaultIndex ? 'Set as default' : 'Remove default'}
          onPress={() => {
            if (setIndex !== defaultIndex) {
              setDefaultIndex(setIndex);
            } else {
              setDefaultIndex(-1);
            }
            setManageOptionModalVisible(false);
          }}
          color={'blue'}
        />
        <StandardButton
          text={'Delete'}
          onPress={() => {
            if (setIndex === defaultIndex) {
              setDefaultIndex(-1);
            }
            setOptions([
              ...options.slice(0, setIndex),
              ...options.slice(setIndex + 1),
            ]);
            setManageOptionModalVisible(false);
          }}
          color={'red'}
        />
        <StandardButton
          text={'Cancel'}
          onPress={() => {
            setManageOptionModalVisible(false);
          }}
          color={'gray'}
        />
      </StandardModal>
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

export default Radio;
