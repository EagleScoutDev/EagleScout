import React, {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import NewQuestionSeparator from './components/NewQuestionSeparator';
import {useState} from 'react';
import NewQuestionModal from './components/NewQuestionModal';
import HeadingSummary from './components/question-summaries/HeadingSummary';
import RadioSummary from './components/question-summaries/RadioSummary';
import NumberSummary from './components/question-summaries/NumberSummary';
import TextBoxSummary from './components/question-summaries/TextBoxSummary';
import FormCreationTopBar from './components/FormCreationTopBar';
import Forms from '../../database/Forms';
import Heading from './components/questions/Heading';
import Number from './components/questions/Number';
import Radio from './components/questions/Radio';
import TextBox from './components/questions/TextBox';

const FormCreationMain = ({navigation}) => {
  const {colors} = useTheme();
  const [newQuestionModalVisible, setNewQuestionModalVisible] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [headingModalVisible, setHeadingModalVisible] = useState(false);
  const [numberModalVisible, setNumberModalVisible] = useState(false);
  const [radioModalVisible, setRadioModalVisible] = useState(false);
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [pitScoutingForm, setPitScoutingForm] = useState(false);

  const newQuestionStyles = StyleSheet.create({
    textInput: {
      // height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      width: '100%',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      color: colors.text,
      fontSize: 18,
    },
    label: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    rowLabel: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
      marginTop: 10,
    },
    rowContainer: {
      flexDirection: 'row',
      gap: 10,
      paddingLeft: 20,
      paddingRight: 20,
    },
    requiredStarText: {
      color: 'red',
      fontSize: 18,
    },
  });

  const onInsert = question => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 0, question);
    setQuestions(newQuestions);
  };

  const onReplace = question => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  const onDelete = () => {
    Alert.alert('Are you sure you want to delete this question?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const newQuestions = [...questions];
          newQuestions.splice(index, 1);
          setQuestions(newQuestions);
        },
      },
    ]);
  };

  const onFormSubmit = name => {
    (async () => {
      let success = true;
      try {
        // console.log(questions);
        await Forms.addForm({
          name: name,
          formStructure: questions,
          pitScouting: pitScoutingForm,
        });
      } catch (e) {
        success = false;
        console.error(e);
        Alert.alert('Error', 'Failed to add form');
      }
      if (success) {
        Alert.alert('Success', 'Form added successfully!');
        setQuestions([]);
        navigation.navigate('Form List');
      }
    })();
  };

  const onFormCancel = () => {
    setQuestions([]);
    navigation.navigate('Form List');
  };

  return (
    <>
      <NewQuestionModal
        onSubmit={onInsert}
        visible={newQuestionModalVisible}
        setVisible={setNewQuestionModalVisible}
        styles={newQuestionStyles}
      />
      <FormCreationTopBar
        onSubmit={onFormSubmit}
        onCancel={onFormCancel}
        questions={questions}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          borderWidth: 1,
          borderColor: colors.border,
          // borderRadius: 10,
          padding: '5%',
        }}>
        <Text style={{color: colors.text, fontSize: 16}}>
          Is this a pit scouting form?
        </Text>
        <Switch value={pitScoutingForm} onValueChange={setPitScoutingForm} />
      </View>
      <ScrollView>
        {questions.map((question, index) => {
          return (
            <>
              <NewQuestionSeparator
                onPress={() => {
                  setIndex(index);
                  setNewQuestionModalVisible(true);
                }}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: '5%',
                  }}>
                  {index + 1}
                </Text>
                <View style={{flex: 1}}>
                  {question.type === 'heading' && (
                    <TouchableOpacity
                      onPress={() => {
                        setIndex(index);
                        setHeadingModalVisible(true);
                      }}>
                      <HeadingSummary
                        question={question}
                        onDelete={() => {
                          setIndex(index);
                          onDelete();
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {question.type === 'radio' && (
                    <TouchableOpacity
                      onPress={() => {
                        setIndex(index);
                        setRadioModalVisible(true);
                      }}>
                      <RadioSummary
                        question={question}
                        onDelete={() => {
                          setIndex(index);
                          onDelete();
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {question.type === 'number' && (
                    <TouchableOpacity
                      onPress={() => {
                        setIndex(index);
                        setNumberModalVisible(true);
                      }}>
                      <NumberSummary
                        question={question}
                        onDelete={() => {
                          setIndex(index);
                          onDelete();
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {question.type === 'textbox' && (
                    <TouchableOpacity
                      onPress={() => {
                        setIndex(index);
                        setTextModalVisible(true);
                      }}>
                      <TextBoxSummary
                        question={question}
                        onDelete={() => {
                          setIndex(index);
                          onDelete();
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </>
          );
        })}
        <NewQuestionSeparator
          onPress={() => {
            setIndex(questions.length);
            setNewQuestionModalVisible(true);
          }}
        />
      </ScrollView>
      <Heading
        visible={headingModalVisible}
        setVisible={setHeadingModalVisible}
        styles={newQuestionStyles}
        onSubmit={onReplace}
        value={questions[index]}
      />
      <Number
        visible={numberModalVisible}
        setVisible={setNumberModalVisible}
        styles={newQuestionStyles}
        onSubmit={onReplace}
        value={questions[index]}
      />
      <Radio
        visible={radioModalVisible}
        setVisible={setRadioModalVisible}
        styles={newQuestionStyles}
        onSubmit={onReplace}
        value={questions[index]}
      />
      <TextBox
        visible={textModalVisible}
        setVisible={setTextModalVisible}
        styles={newQuestionStyles}
        onSubmit={onReplace}
        value={questions[index]}
      />
    </>
  );
};

export default FormCreationMain;
