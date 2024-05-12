import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {SimpleTeam} from '../../lib/TBAUtils';
import React, {useEffect, useState} from 'react';
import ScoutReportsDB, {
  ScoutReportReturnData,
} from '../../database/ScoutReports';
import CompetitionsDB from '../../database/Competitions';
import {isTablet} from 'react-native-device-info';
import QuestionSummary from './QuestionSummary';
import StandardModal from '../../components/modals/StandardModal';
import {Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const CompareTeams = ({route}) => {
  const {team, compId} = route.params;
  const {colors, dark} = useTheme();
  const [secondTeam, setSecondTeam] = useState<number | null>(null);
  const [reports, setReports] = useState<ScoutReportReturnData[]>([]);

  const [uniqueTeams, setUniqueTeams] = useState<number[]>([]);

  const [formStructure, setFormStructure] = useState<Array<Object> | null>(
    null,
  );

  const [firstTeamScoutData, setFirstTeamScoutData] = useState<
    ScoutReportReturnData[] | null
  >([]);
  const [secondTeamScoutData, setSecondTeamScoutData] = useState<
    ScoutReportReturnData[] | null
  >([]);

  const [graphActive, setGraphActive] = useState(false);
  const [chosenQuestionIndex, setChosenQuestionIndex] = useState<number>(0);

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientFromOpacity: 1.0,
    backgroundGradientTo: colors.card,
    backgroundGradientToOpacity: 1.0,
    color: (opacity = 1) =>
      dark ? `rgba(255, 255, 255, ${opacity})` : 'rgba(0, 0, 0, 1)',
    backgroundColor: colors.card,
    strokeWidth: 2, // optional, default 3
    // barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    fillShadowGradient: colors.card,
  };

  useEffect(() => {
    if (secondTeam === null) {
      return;
    }

    CompetitionsDB.getCompetitionById(compId).then(competition => {
      if (!competition) {
        return;
      }
      ScoutReportsDB.getReportsForTeamAtCompetition(
        team.team_number,
        competition.id,
      ).then(reports => {
        setFirstTeamScoutData(reports);
      });
      setFormStructure(competition.form);

      ScoutReportsDB.getReportsForTeamAtCompetition(
        secondTeam,
        competition.id,
      ).then(reports => {
        setSecondTeamScoutData(reports);
      });
    });
  }, [compId, team, secondTeam]);

  useEffect(() => {
    ScoutReportsDB.getReportsForCompetition(compId).then(reports => {
      setReports(reports);
      const teams = reports.map(report => report.teamNumber);
      let set = new Set(teams);
      set.delete(team.team_number);
      let array_version = Array.from(set);
      array_version.sort((a, b) => a - b);
      setUniqueTeams(array_version);
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
    },
  });

  if (secondTeam === null) {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={{color: colors.text, fontSize: 20, textAlign: 'center'}}>
            Team 1
          </Text>
          <Text style={{color: colors.text, fontSize: 50, textAlign: 'center'}}>
            {team.team_number}
          </Text>
        </View>
        <View
          style={{height: '90%', width: 1, backgroundColor: colors.border}}
        />
        <ScrollView style={{flex: 1}}>
          {uniqueTeams.map(team_number => {
            return (
              <Pressable
                onPress={() => setSecondTeam(team_number)}
                style={{
                  padding: 16,
                  backgroundColor: colors.card,
                  borderRadius: 10,
                  margin: 5,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 20,
                    textAlign: 'center',
                  }}>
                  {team_number}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'baseline',
        }}>
        <Text style={{color: colors.text, fontSize: 50, textAlign: 'center'}}>
          {team.team_number}
        </Text>
        <Text style={{color: colors.text, fontSize: 20, textAlign: 'center'}}>
          vs
        </Text>
        <Pressable onPress={() => setSecondTeam(null)}>
          <Text style={{color: colors.text, fontSize: 50, textAlign: 'center'}}>
            {secondTeam}
          </Text>
        </Pressable>
      </View>
      <ScrollView>
        {formStructure && firstTeamScoutData && secondTeamScoutData ? (
          formStructure.map((item, index) => {
            return (
              <Pressable
                onPress={() => {
                  setGraphActive(true);
                  setChosenQuestionIndex(index);
                }}
                style={{
                  flexDirection: isTablet() ? 'row' : 'column',
                  flexWrap: isTablet() ? 'wrap' : 'nowrap',
                }}>
                <QuestionSummary
                  item={item}
                  index={index}
                  data={firstTeamScoutData.map(response => {
                    return {
                      data: response.data[index],
                      match: response.matchNumber,
                    };
                  })}
                  generate_ai_summary={false}
                  graph_disabled={true}
                />
                <QuestionSummary
                  item={item}
                  index={index}
                  data={secondTeamScoutData.map(response => {
                    return {
                      data: response.data[index],
                      match: response.matchNumber,
                    };
                  })}
                  generate_ai_summary={false}
                  graph_disabled={true}
                />
              </Pressable>
            );
          })
        ) : (
          <ActivityIndicator size={'large'} />
        )}
      </ScrollView>

      <StandardModal
        title={formStructure ? formStructure[chosenQuestionIndex].question : ''}
        visible={graphActive}
        onDismiss={() => setGraphActive(false)}>
        {firstTeamScoutData && secondTeamScoutData ? (
          <LineChart
            data={{
              // include both first and second team data for the labels
              labels: firstTeamScoutData.map((report, index) => String(index)),

              datasets: [
                {
                  data: firstTeamScoutData
                    .sort((a, b) => a.matchNumber - b.matchNumber)
                    .map(report => report.data[chosenQuestionIndex]),
                  color: (opacity = 1.0) => colors.primary,
                  strokeWidth: 4, // optional
                },
                {
                  data: secondTeamScoutData
                    .sort((a, b) => a.matchNumber - b.matchNumber)
                    .map(report => report.data[chosenQuestionIndex]),
                  color: (opacity = 1.0) => colors.text,
                  strokeWidth: 4, // optional
                },
              ],
              legend: [String(team.team_number), String(secondTeam)],
            }}
            width={Dimensions.get('window').width * 0.85} // from react-native
            height={Dimensions.get('window').height / 4}
            chartConfig={chartConfig}
            bezier
          />
        ) : (
          <ActivityIndicator />
        )}
        <Text
          style={{color: colors.text, textAlign: 'center', fontWeight: 'bold'}}>
          Match Number
        </Text>
      </StandardModal>
    </View>
  );
};

export default CompareTeams;
