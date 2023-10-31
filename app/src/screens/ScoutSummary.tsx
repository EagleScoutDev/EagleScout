import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import FormsDB from '../database/Forms';
import QuestionSummary from './QuestionSummary';
import ScoutReportsDB, {ScoutReportReturnData} from '../database/ScoutReports';

function ScoutSummary({team_number}: {team_number: number}) {
  const {colors} = useTheme();
  const [formStructure, setFormStructure] = useState<Array<Object>>(null);
  const [responses, setResponses] = useState<ScoutReportReturnData[]>(null);

  useEffect(() => {
    FormsDB.getForm(4).then(form => {
      // console.log(form.formStructure);
      setFormStructure(form.formStructure);
    });

    ScoutReportsDB.getReportsForTeam(team_number).then(reports => {
      setResponses(reports);
      console.log(reports);
    });
  }, []);

  return (
    <View style={{marginTop: '10%'}}>
      {formStructure && responses ? (
        formStructure.map((item, index) => {
          return (
            <QuestionSummary
              item={item}
              index={index}
              data={responses.map(response => {
                return {
                  data: response.data[index],
                  match: response.matchNumber,
                };
              })}
            />
          );
        })
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

export default ScoutSummary;
