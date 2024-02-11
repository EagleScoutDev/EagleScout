import React, {ScrollView, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {TrashCan} from '../../../../SVGIcons';
import SummaryTemplate from './SummaryTemplate';
import SummaryText from './SummaryText';

const HeadingSummary = ({question, onDelete}) => {
  return (
    <SummaryTemplate onDelete={onDelete}>
      <SummaryText>Question Type: Heading</SummaryText>
      <SummaryText>Title: {question.title}</SummaryText>
      <SummaryText>Description: {question.description}</SummaryText>
    </SummaryTemplate>
  );
};

export default HeadingSummary;
