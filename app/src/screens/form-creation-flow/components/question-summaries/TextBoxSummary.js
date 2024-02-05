import React, {ScrollView, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {TrashCan} from '../../../../SVGIcons';
import SummaryTemplate from './SummaryTemplate';
import SummaryText from './SummaryText';

const RadioSummary = ({question, onDelete}) => {
  return (
    <SummaryTemplate onDelete={onDelete}>
      <SummaryText>Question Type: Text Box</SummaryText>
      <SummaryText>Question: {question.question}</SummaryText>
      <SummaryText>Required: {question.required ? 'Yes' : 'No'}</SummaryText>
    </SummaryTemplate>
  );
};

export default RadioSummary;
