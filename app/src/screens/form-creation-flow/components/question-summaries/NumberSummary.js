import React from 'react-native';
import SummaryTemplate from './SummaryTemplate';
import SummaryText from './SummaryText';

const NumberSummary = ({question, onDelete}) => {
  return (
    <SummaryTemplate onDelete={onDelete}>
      <SummaryText>Question Type: Number</SummaryText>
      <SummaryText>Question: {question.question}</SummaryText>
      <SummaryText>Slider: {question.slider ? 'Yes' : 'No'}</SummaryText>
      {question.low != null && (
        <SummaryText>Low: {question.low.toString()}</SummaryText>
      )}
      {question.high != null && (
        <SummaryText>High: {question.high.toString()}</SummaryText>
      )}
      <SummaryText>Step: {question.step.toString()}</SummaryText>
    </SummaryTemplate>
  );
};

export default NumberSummary;
