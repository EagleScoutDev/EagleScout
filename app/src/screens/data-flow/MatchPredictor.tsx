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
  const [allTeams, setAllTeams] = useState<TeamWithData[]>([]);
  const [blueAlliance, setBlueAlliance] = useState<number[]>([]);
  const [redAlliance, setRedAlliance] = useState<number[]>([]);

  const [maxMatchNumber, setMaxMatchNumber] = useState<number>(0);

  const [formulaCreatorActive, setFormulaCreatorActive] =
    useState<boolean>(false);

  // const [inputStyle, setInputStyle] = useState<InputStyle>(InputStyle.NONE);
  const [chosenQuestionIndices, setChosenQuestionIndices] = useState<number[]>(
    [],
  );

  async function getData() {
    const teams = getTeamsForMatch(Number(matchNumber));
    console.log('teams for match ' + matchNumber + ': ' + teams);
    if (teams.length > 0) {
      let teamsWithData: TeamWithData[] = [];
      for (let team of teams) {
        let res = await getProcessedDataForTeam(team);
        console.log(team + ' : ' + res + ' -> ' + TeamAggregation.getMean(res));
      }
      setAllTeams(teamsWithData);
      setBlueAlliance(teams.slice(0, 3));
      setRedAlliance(teams.slice(3, 6));
    }
  }

  useEffect(() => {
    if (matches.length > 0) {
      matches.sort((a, b) => a.match - b.match);
      setMaxMatchNumber(matches[matches.length - 1].match);
    }
  }, []);

  const getProcessedDataForTeam = (team_number: number): Promise<number[]> => {
    ScoutReportsDB.getReportsForTeamAtCompetition(
      team_number,
      competitionId,
    ).then(reports => {
      console.log('reports for team ' + team_number + ': ' + reports);
      if (chosenQuestionIndices.length > 0) {
        return TeamAggregation.createArrayFromIndices(
          reports.map(report => report.data),
          chosenQuestionIndices,
        );
      }
    });
    return Promise.resolve([]);
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
  });

  return (
    <View>
      {/*{inputStyle !== InputStyle.NONE && (*/}
      <Pressable onPress={() => setFormulaCreatorActive(true)}>
        <Text style={{color: colors.primary, textAlign: 'center'}}>
          Choose your questions
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          console.log(allTeams);
          getData().then(() => {
            console.log('got data');
          });
        }}>
        <Text style={{color: colors.primary, textAlign: 'center'}}>
          attempt processing
        </Text>
      </Pressable>

      <QuestionFormulaCreator
        visible={formulaCreatorActive}
        setVisible={setFormulaCreatorActive}
        chosenQuestionIndices={chosenQuestionIndices}
        setChosenQuestionIndices={setChosenQuestionIndices}
      />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: '10%',
          marginBottom: 40,
          marginTop: 20,
        }}>
        <Text style={{color: colors.text, fontSize: 20, flex: 1}}>Match</Text>
        <TextInput
          style={styles.textInput}
          placeholder="###"
          placeholderTextColor={'gray'}
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={text => setMatchNumber(Number(text))}
        />
      </View>
      {/*{matchNumber > maxMatchNumber && (*/}
      {/*  <Text*/}
      {/*    style={{*/}
      {/*      color: 'red',*/}
      {/*      fontSize: 16,*/}
      {/*      textAlign: 'center',*/}
      {/*      marginBottom: '10%',*/}
      {/*    }}>*/}
      {/*    Maximum match number is {maxMatchNumber}*/}
      {/*  </Text>*/}
      {/*)}*/}
      {matchNumber !== 0 && (
        <PercentageWinBar
          bluePercentage={bluePercentage}
          redPercentage={redPercentage}
        />
      )}
      <Text style={{color: colors.text, textAlign: 'center', fontSize: 20}}>
        {chosenQuestionIndices.toString()}
      </Text>
      {matchNumber !== 0 &&
        blueAlliance.length > 0 &&
        redAlliance.length > 0 && (
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
              {redAlliance.map((team, index) => (
                <Text key={index} style={{color: 'white', fontSize: 20}}>
                  {team} {allTeams.find(t => t.team_number === team)?.mean}
                </Text>
              ))}
            </View>
            <View
              style={{
                ...styles.team_container,
                backgroundColor: 'red',
              }}>
              {blueAlliance.map((team, index) => (
                <Text key={index} style={{color: 'white', fontSize: 20}}>
                  {team} {allTeams.find(t => t.team_number === team)?.mean}
                </Text>
              ))}
            </View>
          </View>
        )}
    </View>
  );
};

export default MatchPredictor;
