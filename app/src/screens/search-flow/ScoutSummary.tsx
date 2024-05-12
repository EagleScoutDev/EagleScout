import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import FormsDB from '../../database/Forms';
import QuestionSummary from './QuestionSummary';
import ScoutReportsDB, {
  ScoutReportReturnData,
} from '../../database/ScoutReports';
import Svg, {Path} from 'react-native-svg';
import CompetitionsDB from '../../database/Competitions';
import {isTablet} from 'react-native-device-info';

function ScoutSummary({
  team_number,
  competitionId,
}: {
  team_number: number;
  competitionId: number;
}) {
  const {colors} = useTheme();
  const [formStructure, setFormStructure] = useState<Array<Object> | null>(
    null,
  );
  const [responses, setResponses] = useState<ScoutReportReturnData[] | null>(
    null,
  );

  const [generateSummary, setGenerateSummary] = useState<boolean>(false);

  useEffect(() => {
    CompetitionsDB.getCompetitionById(competitionId).then(competition => {
      if (!competition) {
        return;
      }
      ScoutReportsDB.getReportsForTeamAtCompetition(
        team_number,
        competition.id,
      ).then(reports => {
        setResponses(reports);
        console.log('scout reports for team ' + team_number + ' : ' + reports);
        console.log('no reports? ' + (reports.length === 0));
      });
      setFormStructure(competition.form);
    });
  }, [competitionId, team_number]);

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

          maxWidth: '85%',
          alignSelf: 'center',
          minWidth: '85%',
        }}>
        <Text style={{color: 'red', fontSize: 20, textAlign: 'center'}}>
          No reports found for this team.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: '10%',
        flexDirection: isTablet() ? 'row' : 'column',
        flexWrap: isTablet() ? 'wrap' : 'nowrap',
      }}>
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
              generate_ai_summary={generateSummary}
              graph_disabled={false}
            />
          );
        })
      ) : (
        <ActivityIndicator />
      )}
      <Pressable
        onPress={() => setGenerateSummary(true)}
        style={{
          marginVertical: '10%',
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          backgroundColor: '#bf1cff',
          marginHorizontal: '5%',
          padding: '5%',
          borderRadius: 12,
        }}>
        <Svg
          width={'10%'}
          height={'100%'}
          viewBox="0 0 16 16"
          style={{alignSelf: 'center'}}>
          <Path
            fill="white"
            d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"
          />
        </Svg>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Generate AI Summary
        </Text>
      </Pressable>
    </View>
  );
}

export default ScoutSummary;
