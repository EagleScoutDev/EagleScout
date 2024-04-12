import React, {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import PercentageWinBar from './PercentageWinBar';
import {useCurrentCompetitionMatches} from '../../lib/useCurrentCompetitionMatches';
import QuestionFormulaCreator from './QuestionFormulaCreator';
import ScoutReportsDB from '../../database/ScoutReports';
import TeamAggregation from '../../database/TeamAggregation';

enum InputStyle {
  NONE,
  MATCH,
  TEAMS,
}

interface TeamWithData {
  team_number: number;
  mean: number;
  stdev: number;
}

const MatchPredictor = () => {
  const {colors} = useTheme();
  const [matchNumber, setMatchNumber] = useState<number>(0);
  const [bluePercentage, setBluePercentage] = useState<number>(51);
  const [redPercentage, setRedPercentage] = useState<number>(49);

  const {competitionId, matches, getTeamsForMatch} =
    useCurrentCompetitionMatches();

  // all teams in the match, with data
  const [allTeams, setAllTeams] = useState<TeamWithData[]>([]);

  // teams in the match, from cache. no data except team number
  const [teamsWithoutData, setTeamsWithoutData] = useState<number[]>([]);
  const [numReportsPerTeam, setNumReportsPerTeam] = useState<number[]>([]);

  // modal for choosing questions
  const [formulaCreatorActive, setFormulaCreatorActive] =
    useState<boolean>(false);
  const [chosenQuestionIndices, setChosenQuestionIndices] = useState<number[]>(
    [],
  );

  // uses local cache to get the teams in the match
  async function getTeamsInMatch() {
    const teams = getTeamsForMatch(Number(matchNumber)) || [];
    console.log('teams for match ' + matchNumber + ': ' + teams);
    if (teams.length > 0) {
      let temp = teams.map(team => ({
        team_number: team,
        mean: -1,
        stdev: -1,
      }));
      setTeamsWithoutData(teams);
      return temp;
    }
    return [];
  }

  // const getDataForAllTeams = (teams: TeamWithData[] | undefined) => {
  //   if (!teams) {
  //     return;
  //   }
  //   // let teamsWithData: TeamWithData[] = [];
  //   console.log('all teams: ' + teams);
  //
  //   const promises = teams.map(async team => ({
  //     team_number: team.team_number,
  //     mean: TeamAggregation.getMean(
  //       await getProcessedDataForTeam(team.team_number),
  //     ),
  //     stdev: TeamAggregation.getStandardDeviation(
  //       await getProcessedDataForTeam(team.team_number),
  //     ),
  //   }));
  //
  //   Promise.all(promises).then(res => {
  //     console.log(res);
  //     setAllTeams(res);
  //   });
  // };

  useEffect(() => {
    getTeamsInMatch()
      .then(r => {
        if (r) {
          // getDataForAllTeams(r);
          setNumReportsPerTeam([0, 0, 0, 0, 0, 0]);
        }
      })
      .catch(error => console.error('Failed to fetch teams in match:', error));
  }, [matchNumber, competitionId, chosenQuestionIndices]);

  // const getProcessedDataForTeams = async () => {
  //   let temp = [];
  //   for (let i = 0; i < teamsWithoutData.length; i++) {
  //     const reports = await ScoutReportsDB.getReportsForTeamAtCompetition(
  //       teamsWithoutData[i],
  //       competitionId,
  //     );
  //     temp.push(reports.length);
  //   }
  //   setNumReportsPerTeam(temp);
  // };

  const getProcessedDataForTeams = async () => {
    let temp: TeamWithData[] = [];
    for (let i = 0; i < teamsWithoutData.length; i++) {
      const reports = await ScoutReportsDB.getReportsForTeamAtCompetition(
        teamsWithoutData[i],
        competitionId,
      );
      if (reports.length !== 0) {
        let data = TeamAggregation.createArrayFromIndices(
          reports.map(a => a.data),
          chosenQuestionIndices,
        );
        temp.push({
          team_number: teamsWithoutData[i],
          mean: data.reduce((a, b) => a + b, 0) / data.length,
          stdev: TeamAggregation.getStandardDeviation(data),
        });
      }
    }
    setAllTeams(temp);
    // setNumReportsPerTeam(temp);
  };

  const styles = StyleSheet.create({
    textInput: {
      flex: 1,
      borderColor: 'gray',
      color: colors.text,
      fontFamily: 'monospace',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    team_container: {
      width: '40%',
      alignItems: 'center',
      borderRadius: 10,
      padding: '5%',
    },
    match_input_container: {
      flexDirection: 'row',
      marginHorizontal: '10%',
      marginBottom: 40,
      marginTop: 20,
    },
    match_label: {
      color: colors.text,
      fontSize: 20,
      flex: 1,
    },
    team_item: {
      color: colors.text,
      fontSize: 20,
    },
  });

  return (
    <View>
      <Pressable onPress={() => setFormulaCreatorActive(true)}>
        <Text style={{color: colors.primary, textAlign: 'center'}}>
          Choose your questions
        </Text>
      </Pressable>

      <QuestionFormulaCreator
        visible={formulaCreatorActive}
        setVisible={setFormulaCreatorActive}
        chosenQuestionIndices={chosenQuestionIndices}
        setChosenQuestionIndices={setChosenQuestionIndices}
      />
      <View style={styles.match_input_container}>
        <Text style={styles.match_label}>Match</Text>
        <TextInput
          style={styles.textInput}
          placeholder="###"
          placeholderTextColor={'gray'}
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={text => setMatchNumber(Number(text))}
        />
      </View>
      {matchNumber !== 0 && (
        <PercentageWinBar
          bluePercentage={bluePercentage}
          redPercentage={redPercentage}
        />
      )}
      <Text style={{color: colors.text, textAlign: 'center', fontSize: 20}}>
        {chosenQuestionIndices.toString()}
      </Text>

      {matchNumber !== 0 && teamsWithoutData.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: '4%',
          }}>
          <View
            style={{
              ...styles.team_container,
              backgroundColor: 'blue',
            }}>
            {teamsWithoutData.slice(3, 6).map((team, index) => (
              <Text key={index} style={styles.team_item}>
                {team} {allTeams.find(a => a.team_number === team)?.mean}
                {/*{team} {allTeams.find(t => t.team_number === team)?.mean}*/}
              </Text>
            ))}
          </View>
          <View
            style={{
              ...styles.team_container,
              backgroundColor: 'red',
            }}>
            {teamsWithoutData.slice(0, 3).map((team, index) => (
              <Text key={index} style={styles.team_item}>
                {team} {allTeams.find(a => a.team_number === team)?.mean}
                {/*{team} {allTeams.find(t => t.team_number === team)?.mean}*/}
              </Text>
            ))}
          </View>
        </View>
      )}
      {matchNumber !== 0 && teamsWithoutData.length > 0 && (
        <View>
          <Pressable
            disabled={chosenQuestionIndices.length === 0}
            onPress={() => {
              getProcessedDataForTeams();
            }}
            style={{
              backgroundColor:
                chosenQuestionIndices.length === 0 ? 'gray' : 'yellow',
              padding: 10,
              borderRadius: 10,
              marginHorizontal: '5%',
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '700',
              }}>
              Predict
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default MatchPredictor;
