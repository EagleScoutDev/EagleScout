import React, {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import PercentageWinBar from './PercentageWinBar';
import {useCurrentCompetitionMatches} from '../../lib/useCurrentCompetitionMatches';
import QuestionFormulaCreator from './QuestionFormulaCreator';
import ScoutReportsDB from '../../database/ScoutReports';
import TeamAggregation from '../../database/TeamAggregation';
import {PredictionConfidence} from '../../lib/PredictionConfidence';
import PredictionConfidenceTag from './PredictionConfidenceTag';
import PredictionExplainerModal from './PredictionExplainerModal';

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

  const [predictionConfidence, setPredictionConfidence] =
    useState<PredictionConfidence>(PredictionConfidence.UNDEFINED);
  const [predictionExplainerModalVisible, setPredictionExplainerModalVisible] =
    useState(false);

  const [findingReports, setFindingReports] = useState<boolean>(false);
  const [determiningWinner, setDeterminingWinner] = useState<boolean>(false);
  const [allianceBreakdown, setAllianceBreakdown] = useState<Object[]>([]);

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

  const assignPredictionConfidence = () => {
    // rules:
    // if every team has at least 6 reports, set to high
    // if every team has at least 4 reports, set to medium
    // if every team has at least 2 reports, set to low
    // otherwise, set to undefined

    let confidence: PredictionConfidence;
    let numTwoReports = numReportsPerTeam.filter(a => a >= 2).length;
    let numFourReports = numReportsPerTeam.filter(a => a >= 4).length;
    let numSixReports = numReportsPerTeam.filter(a => a >= 6).length;
    if (numSixReports === 6) {
      confidence = PredictionConfidence.HIGH;
    } else if (numFourReports === 6) {
      confidence = PredictionConfidence.MEDIUM;
    } else if (numTwoReports === 6) {
      confidence = PredictionConfidence.LOW;
    } else {
      confidence = PredictionConfidence.UNDEFINED;
    }
    setPredictionConfidence(confidence);
  };

  useEffect(() => {
    setAllianceBreakdown([]);
  }, [matchNumber]);

  useEffect(() => {
    assignPredictionConfidence();
  }, [numReportsPerTeam]);

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

  const finalWinnerCalculation = () => {
    let blueMean = 0;
    let redMean = 0;

    let blueStdev = 0;
    let redStdev = 0;

    for (let i = 0; i < teamsWithoutData.length; i++) {
      let foundTeam = allTeams.find(a => a.team_number === teamsWithoutData[i]);
      console.log('found team: ' + foundTeam);
      if (i < 3) {
        redMean += foundTeam?.mean || 0;
        redStdev += (foundTeam?.stdev || 0) ** 2;
      } else {
        blueMean += foundTeam?.mean || 0;
        blueStdev += (foundTeam?.stdev || 0) ** 2;
      }
    }

    let finalWinner = TeamAggregation.determineWinner(
      blueMean,
      blueStdev,
      redMean,
      redStdev,
    );

    console.log('~~~~~~~~~~~~~~~~~~');
    // print out finalWinner detailed
    console.log('Blue Mean: ' + blueMean);
    console.log('Blue Stdev: ' + blueStdev);
    console.log();
    console.log('Red Mean: ' + redMean);
    console.log('Red Stdev: ' + redStdev);
    console.log();

    // print out every property of every object in finalWInner
    for (let i = 0; i < finalWinner.length; i++) {
      console.log('Team Number: ' + finalWinner[i].team);
      console.log('Win Percentage: ' + finalWinner[i].probability);
    }
    console.log('~~~~~~~~~~~~~~~~~~');

    let calculatedBluePercentage =
      finalWinner.find(a => a.team === 'Blue')?.probability || 0;
    let calculatedRedPercentage =
      finalWinner.find(a => a.team === 'Red')?.probability || 0;

    calculatedBluePercentage = Math.round(calculatedBluePercentage * 100);
    calculatedRedPercentage = Math.round(calculatedRedPercentage * 100);

    setBluePercentage(calculatedBluePercentage);
    setRedPercentage(calculatedRedPercentage);
    setAllianceBreakdown(finalWinner);
  };

  const getProcessedDataForTeams = async () => {
    let temp: TeamWithData[] = [];
    let tempNumReports: number[] = [];
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
          mean: TeamAggregation.getMean(data),
          stdev: TeamAggregation.getStandardDeviation(data),
        });
      }
      tempNumReports.push(reports.length);
    }
    setAllTeams(temp);
    setNumReportsPerTeam(tempNumReports);
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
      // width: '40%',
      flex: 1,
      alignItems: 'center',
      borderRadius: 10,
      padding: '4%',
      marginHorizontal: '5%',
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
      color: 'white',
      fontSize: 20,
      marginHorizontal: 4,
    },
    question_prompt: {
      color: colors.primary,
      fontSize: 20,
      textAlign: 'center',
      marginVertical: '4%',
    },
    small_question_prompt: {
      color: colors.primary,
      fontSize: 16,
      textAlign: 'right',
      marginVertical: '4%',
      marginRight: '4%',
    },
  });

  useEffect(() => {
    if (chosenQuestionIndices.length === 0) {
      setFormulaCreatorActive(true);
    }
  }, []);

  if (chosenQuestionIndices.length === 0) {
    return (
      <View>
        <Pressable onPress={() => setFormulaCreatorActive(true)}>
          <Text style={styles.question_prompt}>Choose your questions</Text>
        </Pressable>
        <QuestionFormulaCreator
          visible={formulaCreatorActive}
          setVisible={setFormulaCreatorActive}
          chosenQuestionIndices={chosenQuestionIndices}
          setChosenQuestionIndices={setChosenQuestionIndices}
        />
      </View>
    );
  }

  return (
    <View>
      <Pressable onPress={() => setFormulaCreatorActive(true)}>
        <Text style={styles.small_question_prompt}>Change Questions</Text>
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
      {matchNumber !== 0 && allianceBreakdown.length !== 0 && (
        <PercentageWinBar
          bluePercentage={bluePercentage}
          redPercentage={redPercentage}
        />
      )}
      {/*<Text style={{color: colors.text, textAlign: 'center', fontSize: 20}}>*/}
      {/*  {chosenQuestionIndices.toString()}*/}
      {/*</Text>*/}
      {/*<Text style={{color: colors.text, textAlign: 'center', fontSize: 20}}>*/}
      {/*  {numReportsPerTeam.toString()}*/}
      {/*</Text>*/}
      {matchNumber !== 0 && allianceBreakdown.length !== 0 && (
        <>
          <View style={{height: 20}} />
          <PredictionConfidenceTag
            confidence={predictionConfidence}
            setModal={setPredictionExplainerModalVisible}
          />
        </>
      )}
      <PredictionExplainerModal
        visible={predictionExplainerModalVisible}
        setVisible={setPredictionExplainerModalVisible}
      />

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
              <View style={{flexDirection: 'row'}}>
                <Text key={team} style={styles.team_item}>
                  {team}
                </Text>
                {/*<Text key={team + '1'} style={styles.team_item}>*/}
                {/*  {allTeams.find(a => a.team_number === team)?.mean.toFixed(2)}*/}
                {/*</Text>*/}
                {/*<Text key={team + '2'} style={styles.team_item}>*/}
                {/*  {allTeams.find(a => a.team_number === team)?.stdev.toFixed(2)}*/}
                {/*</Text>*/}
              </View>
            ))}
          </View>
          <View
            style={{
              ...styles.team_container,
              backgroundColor: 'red',
            }}>
            {teamsWithoutData.slice(0, 3).map((team, index) => (
              <View style={{flexDirection: 'row'}}>
                <Text key={team} style={styles.team_item}>
                  {team}
                </Text>
                {/*<Text key={team + '1'} style={styles.team_item}>*/}
                {/*  {allTeams.find(a => a.team_number === team)?.mean.toFixed(2)}*/}
                {/*</Text>*/}
                {/*<Text key={team + '2'} style={styles.team_item}>*/}
                {/*  {allTeams.find(a => a.team_number === team)?.stdev.toFixed(2)}*/}
                {/*</Text>*/}
              </View>
            ))}
          </View>
        </View>
      )}
      {matchNumber !== 0 &&
        teamsWithoutData.length > 0 &&
        allianceBreakdown.length === 0 && (
          <View>
            <Pressable
              disabled={chosenQuestionIndices.length === 0}
              onPress={() => {
                setFindingReports(true);
                getProcessedDataForTeams().then(() => {
                  setFindingReports(false);
                  setDeterminingWinner(true);
                  finalWinnerCalculation();
                  setDeterminingWinner(false);
                });
              }}
              style={{
                backgroundColor:
                  chosenQuestionIndices.length === 0 ? 'gray' : 'yellow',
                padding: 10,
                borderRadius: 10,
                marginHorizontal: '5%',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              {(findingReports || determiningWinner) && (
                <ActivityIndicator size={'small'} color={'black'} />
              )}
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '700',
                  marginLeft: 10,
                }}>
                Predict
              </Text>
            </Pressable>
            {/*<Pressable*/}
            {/*  disabled={chosenQuestionIndices.length === 0}*/}
            {/*  onPress={() => {*/}
            {/*    console.log('debugging');*/}
            {/*    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');*/}
            {/*    console.log(allTeams);*/}
            {/*    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');*/}
            {/*  }}*/}
            {/*  style={{*/}
            {/*    backgroundColor:*/}
            {/*      chosenQuestionIndices.length === 0 ? 'gray' : 'cyan',*/}
            {/*    padding: 10,*/}
            {/*    borderRadius: 10,*/}
            {/*    marginHorizontal: '5%',*/}
            {/*    marginVertical: '4%',*/}
            {/*  }}>*/}
            {/*  <Text*/}
            {/*    style={{*/}
            {/*      color: 'black',*/}
            {/*      textAlign: 'center',*/}
            {/*      fontSize: 20,*/}
            {/*      fontWeight: '700',*/}
            {/*    }}>*/}
            {/*    Debug*/}
            {/*  </Text>*/}
            {/*</Pressable>*/}
            {/*<Pressable*/}
            {/*  // disabled={chosenQuestionIndices.length === 0}*/}
            {/*  onPress={() => {*/}
            {/*    setDeterminingWinner(true);*/}
            {/*    finalWinnerCalculation();*/}
            {/*    setDeterminingWinner(false);*/}
            {/*  }}*/}
            {/*  style={{*/}
            {/*    backgroundColor: 'lightgreen',*/}
            {/*    // chosenQuestionIndices.length === 0 ? 'green' : 'cyan',*/}
            {/*    padding: 10,*/}
            {/*    borderRadius: 10,*/}
            {/*    marginHorizontal: '5%',*/}
            {/*    marginVertical: '4%',*/}
            {/*    flexDirection: 'row',*/}
            {/*    justifyContent: 'center',*/}
            {/*  }}>*/}
            {/*  {determiningWinner && (*/}
            {/*    <ActivityIndicator size={'small'} color={'black'} />*/}
            {/*  )}*/}
            {/*  <Text*/}
            {/*    style={{*/}
            {/*      color: 'black',*/}
            {/*      textAlign: 'center',*/}
            {/*      fontSize: 20,*/}
            {/*      fontWeight: '700',*/}
            {/*    }}>*/}
            {/*    Final Solution*/}
            {/*  </Text>*/}
            {/*</Pressable>*/}
          </View>
        )}
    </View>
  );
};

export default MatchPredictor;
