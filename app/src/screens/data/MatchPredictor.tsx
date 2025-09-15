import React, {
    ActivityIndicator,
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import PercentageWinBar from './PercentageWinBar';
import { useCurrentCompetitionMatches } from '../../lib/useCurrentCompetitionMatches';
import QuestionFormulaCreator from './QuestionFormulaCreator';
import TeamAggregation, {
    AllianceColor,
    type MatchPredictionResults,
} from '../../database/TeamAggregation';
import { PredictionConfidence } from '../../lib/PredictionConfidence';
import PredictionConfidenceTag from './PredictionConfidenceTag';
import PredictionExplainerModal from './PredictionExplainerModal';
import CompetitionsDB, {
    type CompetitionReturnData,
} from '../../database/Competitions';
import TBAMatches, { type TBAMatch } from '../../database/TBAMatches';
import { getIdealTextColor } from '../../lib/color';

enum InputStyle {
    NONE,
    MATCH,
    TEAMS,
}

const MatchPredictor = () => {
    const { colors } = useTheme();
    const [matchNumber, setMatchNumber] = useState<number>(0);
    const [bluePercentage, setBluePercentage] = useState<number>(51);
    const [redPercentage, setRedPercentage] = useState<number>(49);

    const { competitionId, matches, getTeamsForMatch } =
        useCurrentCompetitionMatches();

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
    const [allianceBreakdown, setAllianceBreakdown] =
        useState<MatchPredictionResults>([]);
    const [winningAllianceColor, setWinningAllianceColor] =
        useState<AllianceColor | null>(null);

    const [compId, setCompID] = useState<number>(-1);
    const [currForm, setCurrForm] = useState<Array<Object>>();
    const [compName, setCompName] = useState<string>();

    const [noActiveCompetition, setNoActiveCompetition] = useState<boolean>(true);
    const [ongoingCompetition, setOngoingCompetition] = useState<boolean>(false);
    const [fullCompetitionsList, setFullCompetitionsList] = useState<
        CompetitionReturnData[]
    >([]);

    const [calculatedMeanStdev, setCalculatedMeanStdev] = useState<{
        blueMean: number;
        redMean: number;
        blueStdev: number;
        redStdev: number;
    }>({
        blueMean: 0,
        redMean: 0,
        blueStdev: 0,
        redStdev: 0,
    });

    const [onlineMatches, setOnlineMatches] = useState<TBAMatch[]>([]);
    const [breakdownVisible, setBreakdownVisible] = useState<boolean>(false);

    useEffect(() => {
        CompetitionsDB.getCurrentCompetition().then(competition => {
            if (!competition) {
                console.log('no active competition for weighted rank');
                setNoActiveCompetition(true);
                setOngoingCompetition(false);
                CompetitionsDB.getCompetitions().then(c => {
                    setFullCompetitionsList(c);
                });
                return;
            }
            console.log('active competition found for weighted rank');

            setOngoingCompetition(true);
            setCurrForm(competition.form);
            setCompID(competition.id);
            setCompName(competition.name);
            setNoActiveCompetition(false);
        });
    }, []);

    // uses local cache to get the teams in the match
    async function getTeamsInMatch() {
        if (ongoingCompetition) {
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
        } else {
            console.log('~~~~~~~~~~~~~~~');
            let a = onlineMatches.filter(m => m.match === matchNumber);

            for (let i = 0; i < a.length; i++) {
                console.log('team ' + i + ': ' + a[i].team);
            }
            let b = a.map(m => Number.parseInt(m.team.slice(3), 10));
            console.log('teams from online: ' + b);
            console.log('~~~~~~~~~~~~~~~');
            setTeamsWithoutData(b);
        }
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
        assignPredictionConfidence();
    }, [numReportsPerTeam]);

    useEffect(() => {
        setAllianceBreakdown([]);
        setWinningAllianceColor(null);
        setBreakdownVisible(false);
        getTeamsInMatch()
            .then(r => {
                if (r) {
                    // getDataForAllTeams(r);
                    setNumReportsPerTeam([0, 0, 0, 0, 0, 0]);
                }
            })
            .catch(error => console.error('Failed to fetch teams in match:', error));
    }, [matchNumber, compId, chosenQuestionIndices]);

    useEffect(() => {
        if (currForm !== undefined && chosenQuestionIndices.length === 0) {
            setFormulaCreatorActive(true);
        }
    }, [currForm]);

    const getMatchPrediction = async () => {
        setFindingReports(true);
        let results = await TeamAggregation.getWinPrediction(
            teamsWithoutData,
            compId,
            chosenQuestionIndices,
        );
        setFindingReports(false);
        setDeterminingWinner(true);

        setAllianceBreakdown(results);

        let blue_data = results.find(a => a.alliance === AllianceColor.BLUE);
        let red_data = results.find(a => a.alliance === AllianceColor.RED);

        if (!blue_data || !red_data) {
            return;
        }

        let winner =
            blue_data?.probability > red_data?.probability
                ? AllianceColor.BLUE
                : AllianceColor.RED;

        setCalculatedMeanStdev({
            blueMean: blue_data?.mean || 0,
            blueStdev: blue_data?.stdev || 0,
            redMean: red_data?.mean || 0,
            redStdev: red_data?.stdev || 0,
        });

        setBluePercentage(blue_data.probability);
        setRedPercentage(red_data.probability);
        setWinningAllianceColor(winner);
        setDeterminingWinner(false);

        // getting prediction confidence
        TeamAggregation.getNumReportsPerTeam(teamsWithoutData, compId).then(r => {
            setNumReportsPerTeam(r);
        });
    };

    const styles = StyleSheet.create({
        container: {
            // backgroundColor: colors.card,
            paddingHorizontal: '10%',
            flex: 1,
        },
        list_item: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingVertical: '5%',
            flexDirection: 'row',
        },
        list_text: {
            color: colors.text,
            fontSize: 14,
            flex: 1,
            textAlign: 'left',
        },
        header: {
            color: colors.text,
            fontSize: 20,
        },

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
            color: colors.text,
            fontSize: 20,
            marginHorizontal: 4,
        },
        winning_team_item: {
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
        },
        breakdown_button: {
            backgroundColor: colors.card,
            padding: 10,
            borderRadius: 10,
            marginHorizontal: '5%',
            marginVertical: '4%',
        },
        breakdown_text: {
            color: colors.text,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 16,
            marginVertical: '4%',
        },
        data_point: {
            fontSize: 12,
            color: colors.text,
        },
        data_point_container: {
            flexDirection: 'column',
            marginHorizontal: '4%',
            flex: 1,
        },
    });

    if (noActiveCompetition) {
        return (
            <ScrollView
                style={{
                    ...styles.container,
                    paddingVertical: '10%',
                }}>
                <Text style={styles.header}>No Active Competition</Text>
                <Text style={{ color: colors.text, fontSize: 14 }}>
                    Please choose which competition you would like to view data for.
                </Text>
                {fullCompetitionsList.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => {
                            setNoActiveCompetition(false);
                            setOngoingCompetition(false);
                            setCurrForm(item.form);
                            setCompID(item.id);
                            setCompName(item.name);
                            TBAMatches.getMatchesForCompetition(String(item.id)).then(
                                matches => {
                                    setOnlineMatches(matches);
                                },
                            );
                        }}>
                        <View style={styles.list_item}>
                            <Text style={styles.list_text}>{item.name}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        );
    }

    if (chosenQuestionIndices.length === 0 && currForm !== undefined) {
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
                    compId={compId}
                />
            </View>
        );
    }

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: '4%',
                    marginVertical: '2%',
                }}>
                <Pressable
                    onPress={() => {
                        setNoActiveCompetition(true);
                        setOngoingCompetition(false);
                        setCurrForm(undefined);
                        setCompID(-1);
                        setCompName('');
                    }}>
                    <Text style={styles.small_question_prompt}>{compName}</Text>
                </Pressable>
                <Pressable onPress={() => setFormulaCreatorActive(true)}>
                    <Text style={styles.small_question_prompt}>Change Questions</Text>
                </Pressable>
            </View>

            <QuestionFormulaCreator
                visible={formulaCreatorActive}
                setVisible={setFormulaCreatorActive}
                chosenQuestionIndices={chosenQuestionIndices}
                setChosenQuestionIndices={setChosenQuestionIndices}
                compId={compId}
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
            {/*<Text style={{color: colors.text, textAlign: 'center', fontSize: 20}}>*/}
            {/*  {teamsWithoutData.toString()}*/}
            {/*</Text>*/}
            {matchNumber !== 0 && allianceBreakdown.length !== 0 && (
                <>
                    <View style={{ height: 20 }} />
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
                            borderWidth: 1,
                            borderColor: 'dodgerblue',
                            backgroundColor:
                                winningAllianceColor === AllianceColor.BLUE
                                    ? 'dodgerblue'
                                    : 'none',
                        }}>
                        <Text
                            style={{
                                color:
                                    winningAllianceColor === AllianceColor.BLUE
                                        ? 'white'
                                        : colors.text,
                                fontSize: 20,
                                marginBottom: 10,
                                fontWeight: 'bold',
                            }}>
                            Blue Alliance
                        </Text>
                        {teamsWithoutData.slice(3, 6).map((team, index) => (
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    key={team}
                                    style={
                                        winningAllianceColor === AllianceColor.BLUE
                                            ? styles.winning_team_item
                                            : styles.team_item
                                    }>
                                    {team}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View
                        style={{
                            ...styles.team_container,
                            backgroundColor:
                                winningAllianceColor === AllianceColor.RED ? 'red' : 'none',
                            borderWidth: 1,
                            borderColor: 'red',
                        }}>
                        <Text
                            style={{
                                color:
                                    winningAllianceColor === AllianceColor.RED
                                        ? 'white'
                                        : colors.text,
                                fontSize: 20,
                                marginBottom: 10,
                                fontWeight: 'bold',
                            }}>
                            Red Alliance
                        </Text>
                        {teamsWithoutData.slice(0, 3).map((team, index) => (
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    key={team}
                                    style={
                                        winningAllianceColor === AllianceColor.RED
                                            ? styles.winning_team_item
                                            : styles.team_item
                                    }>
                                    {team}
                                </Text>
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
                                getMatchPrediction();
                                Keyboard.dismiss();
                            }}
                            style={{
                                backgroundColor:
                                    chosenQuestionIndices.length === 0 ? 'gray' : colors.primary,
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
                                    color: getIdealTextColor(colors.primary),
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: '700',
                                    marginLeft: 10,
                                }}>
                                Predict
                            </Text>
                        </Pressable>
                    </View>
                )}
            {allianceBreakdown.length === 2 && (
                <View>
                    <Pressable
                        style={styles.breakdown_button}
                        onPress={() => setBreakdownVisible(prevState => !prevState)}>
                        <Text style={styles.breakdown_text}>See Breakdown</Text>
                    </Pressable>
                    {breakdownVisible && (
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.data_point_container}>
                                <Text style={styles.data_point}>
                                    Blue Mean: {calculatedMeanStdev.blueMean.toFixed(2)}
                                </Text>
                                <Text style={styles.data_point}>
                                    Blue Stdev: {calculatedMeanStdev.blueStdev.toFixed(2)}
                                </Text>
                                <View style={{ height: 20 }} />
                                <Text style={styles.data_point}>
                                    Red Mean: {calculatedMeanStdev.redMean.toFixed(2)}
                                </Text>
                                <Text style={styles.data_point}>
                                    Red Stdev: {calculatedMeanStdev.redStdev.toFixed(2)}
                                </Text>
                                <View style={{ height: 20 }} />
                                <Text style={styles.data_point}>
                                    Blue Probability: {bluePercentage}%
                                </Text>
                                <Text style={styles.data_point}>
                                    Red Probability: {redPercentage}%
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginHorizontal: '4%',
                                    }}>
                                    <Text style={{ color: colors.text }}>Team</Text>
                                    <Text style={{ color: colors.text }}># Reports</Text>
                                </View>
                                {teamsWithoutData.map((team, index) => (
                                    <>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginHorizontal: '4%',
                                                backgroundColor: index < 3 ? 'red' : 'dodgerblue',
                                                paddingHorizontal: '4%',
                                            }}>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                }}>
                                                {team}
                                            </Text>
                                            <Text style={{ color: 'white' }}>
                                                {numReportsPerTeam[index]}
                                            </Text>
                                        </View>
                                    </>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default MatchPredictor;
