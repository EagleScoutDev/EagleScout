import React, {ScrollView, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {TrashCan} from '../../../../SVGIcons';
import SummaryTemplate from './SummaryTemplate';
import SummaryText from './SummaryText';

const RadioSummary = ({question, onDelete}) => {
  return (
    <SummaryTemplate onDelete={onDelete}>
      <SummaryText>Question Type: Radio</SummaryText>
      <SummaryText>Question: {question.question}</SummaryText>
      <SummaryText>Options:</SummaryText>
      {question.options.map((option, index) => (
        <SummaryText key={index} bold={question.defaultIndex === index}>
          {'\u2022'} {option}
        </SummaryText>
      ))}
      <SummaryText>Required: {question.required ? 'Yes' : 'No'}</SummaryText>
    </SummaryTemplate>
  );
};

export default RadioSummary;
