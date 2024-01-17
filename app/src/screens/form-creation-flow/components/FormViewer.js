import React, {ScrollView, StyleSheet, Text} from 'react-native';
import HeadingSummary from './question-summaries/HeadingSummary';
import RadioSummary from './question-summaries/RadioSummary';
import NumberSummary from './question-summaries/NumberSummary';
import TextBoxSummary from './question-summaries/TextBoxSummary';

const FormViewer = ({route}) => {
  const {questions} = route.params;

  const styles = StyleSheet.create({
    mainText: {
      fontSize: 20,
      paddingTop: 10,
      paddingLeft: 20,
      paddingBottom: 5,
    },
  });

  return (
    <>
      <Text style={styles.mainText}>Questions:</Text>
      <ScrollView>
        {questions.map(question => {
          return (
            <>
              {question.type === 'heading' && (
                <HeadingSummary question={question} />
              )}
              {question.type === 'radio' && (
                <RadioSummary question={question} />
              )}
              {question.type === 'number' && (
                <NumberSummary question={question} />
              )}
              {question.type === 'textbox' && (
                <TextBoxSummary question={question} />
              )}
            </>
          );
        })}
      </ScrollView>
    </>
  );
};

export default FormViewer;
