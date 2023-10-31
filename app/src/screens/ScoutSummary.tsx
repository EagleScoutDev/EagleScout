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
import teamViewer from './TeamViewer';
import {XCircle} from '../SVGIcons';

function ScoutSummary({team_number}: {team_number: number}) {
  const {colors} = useTheme();
  const [formStructure, setFormStructure] = useState<Array<Object> | null>(
    null,
  );
  const [responses, setResponses] = useState<ScoutReportReturnData[] | null>(
    null,
  );

  useEffect(() => {
    FormsDB.getForm(4).then(form => {
      // console.log(form.formStructure);
      setFormStructure(form.formStructure);
    });

    ScoutReportsDB.getReportsForTeam(team_number).then(reports => {
      setResponses(reports);
      console.log('scout reports for team ' + team_number + ' : ' + reports);
      console.log('no reports? ' + (reports.length === 0));
    });
  }, []);

  if (responses && responses.length === 0) {
    return (
      <View
        style={{
          marginVertical: '10%',
          marginBottom: '20%',
          justifyContent: 'center',
          flexDirection: 'column',
          // align content horizontally
          alignItems: 'center',
          backgroundColor: colors.card,
          marginHorizontal: '5%',
          padding: '5%',
          borderRadius: 12,
        }}>
        <XCircle color={colors.notification} />
        <Text style={{color: colors.text, fontSize: 20, textAlign: 'center'}}>
          No reports found for this team.
        </Text>
      </View>
    );
  }

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
