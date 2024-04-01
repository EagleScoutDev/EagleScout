import React from 'react-native';
import SummaryTemplate from './SummaryTemplate';
import SummaryText from './SummaryText';

const RadioSummary = ({question, onDelete}) => {
  return (
    <SummaryTemplate onDelete={onDelete}>
      <SummaryText>Question Type: Checkbox</SummaryText>
      <SummaryText>Question: {question.question}</SummaryText>
      <SummaryText>
        Checked by default: {question.checkedByDefault ? 'Yes' : 'No'}
      </SummaryText>
    </SummaryTemplate>
  );
};

export default RadioSummary;
