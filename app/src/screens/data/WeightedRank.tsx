import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Svg, { Path } from 'react-native-svg';
import MatchReportsDB, {
    type MatchReportReturnData,
} from '../../database/ScoutMatchReports';
import CompetitionsDB, {
    type CompetitionReturnData,
} from '../../database/Competitions';

// interface WeightedRankProps {
//   visible: boolean;
//   setVisible: (visible: boolean) => void;
//   form: Object[] | undefined;
//   compId: number;
// }

enum WeightedRankStatus {
    CHOOSING_WEIGHTS,
    FETCHING_REPORTS,
    PROCESSING,
    PRESENTING_RANKINGS,
}

interface MapValue {
    sum: number;
    count: number;
}

function WeightedRank() {
    const { colors } = useTheme();
    const [listOfWeights, setListOfWeights] = React.useState<number[]>([]);
    const [originalWeights, setOriginalWeights] = React.useState<number[]>([]);

    const [status, setStatus] = React.useState<WeightedRankStatus>(
        WeightedRankStatus.CHOOSING_WEIGHTS,
    );

    const [numberQuestions, setNumberQuestions] = React.useState<Object[]>([]);

    const [allReports, setAllReports] = React.useState<MatchReportReturnData[]>(
        [],
    );

    const [teamMap, setTeamMap] = React.useState<Map<number, MapValue>>(
        new Map(),
    );

    // competition form
    const [currForm, setCurrForm] = useState<Array<Object>>();
    const [compId, setCompID] = useState<number>(-1);

    const [noActiveCompetition, setNoActiveCompetition] = useState<boolean>(true);

    const [fullCompetitionsList, setFullCompetitionsList] = useState<
        CompetitionReturnData[]
    >([]);

    const [compName, setCompName] = useState<string>();

    useEffect(() => {
        CompetitionsDB.getCurrentCompetition().then(competition => {
            if (!competition) {
                console.log('no active competition for weighted rank');
                setNoActiveCompetition(true);
                CompetitionsDB.getCompetitions().then(c => {
                    setFullCompetitionsList(c);
                });
                return;
            }
            console.log('active competition found for weighted rank');

            setCurrForm(competition.form);
            setCompID(competition.id);
            setCompName(competition.name);
            setNoActiveCompetition(false);
        });
    }, []);

    useEffect(() => {
        console.log('form: ' + currForm);
        if (currForm) {
            let temp: Object[] = [];
            for (let i = 0; i < currForm?.length; i++) {
                if (currForm[i].type === 'number') {
                    temp.push(currForm[i]);
                }
            }
            setNumberQuestions(temp);
        }
    }, [currForm]);

    useEffect(() => {
        if (numberQuestions.length > 0 && currForm) {
            let temp: number[] = [];
            for (let i = 0; i < currForm.length; i++) {
                temp.push(0);
            }
            setListOfWeights(temp);
            setOriginalWeights(temp);
        }
    }, [numberQuestions]);

    const generateRankings = () => {
        setStatus(WeightedRankStatus.FETCHING_REPORTS);
        fetchAllReports();
        console.log('num scout reports: ' + allReports.length);
        // let weights_total = listOfWeights.reduce((a, b) => a + b, 0);
        // console.log('total weights: ' + weights_total);
    };

    const processData = () => {
        setStatus(WeightedRankStatus.PROCESSING);
        let temp_map = new Map<number, MapValue>();
        for (let i = 0; i < allReports.length; i++) {
            let report = allReports[i];
            let sum = 0;
            let count = 1;
            for (let j = 0; j < numberQuestions.length; j++) {
                sum += report.data[j] * listOfWeights[j];
            }
            if (temp_map.has(report.teamNumber)) {
                let temp = temp_map.get(report.teamNumber);
                if (temp) {
                    temp.sum += sum;
                    temp.count += count;
                    temp_map.set(report.teamNumber, temp);
                }
            } else {
                temp_map.set(report.teamNumber, { sum: sum, count: count });
            }
        }
        // nicely print out the map
        temp_map.forEach((value, key) => {
            console.log('team ' + key + ' : ' + value.sum / value.count);
        });
        setTeamMap(temp_map);
        setStatus(WeightedRankStatus.PRESENTING_RANKINGS);
    };

    useEffect(() => { }, []);

    useEffect(() => {
        if (allReports.length > 0) {
            processData();
        }
    }, [allReports]);

    const fetchAllReports = () => {
        if (compId === -1) {
            return;
        }

        setStatus(WeightedRankStatus.FETCHING_REPORTS);
        MatchReportsDB.getReportsForCompetition(compId).then(reports => {
            setAllReports(reports);
        });
    };

    const styles = StyleSheet.create({
        header: {
            color: colors.text,
            fontSize: 20,
        },
        container: {
            // backgroundColor: colors.card,
            paddingHorizontal: '10%',
            flex: 1,
            marginBottom: '10%',
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
        question_text: {
            color: colors.text,
            // fontWeight: 'bold',
            fontSize: 16,
        },
        rank_list_item: {
            // backgroundColor: colors.card,
            color: 'red',
            flexDirection: 'row',
            // borderBottomWidth: 1,
            // borderColor: colors.border,
            padding: '5%',
            paddingVertical: '2%',
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
                            setCurrForm(item.form);
                            setCompID(item.id);
                            setCompName(item.name);
                        }}>
                        <View style={styles.list_item}>
                            <Text style={styles.list_text}>{item.name}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: '5%',
                }}>
                <Text
                    style={{
                        color: colors.text,
                        fontSize: 24,
                    }}>
                    Weighted Rank
                </Text>

                {(status === WeightedRankStatus.PRESENTING_RANKINGS ||
                    originalWeights !== listOfWeights) && (
                        <Pressable
                            onPress={() => {
                                setListOfWeights(originalWeights);
                                setStatus(WeightedRankStatus.CHOOSING_WEIGHTS);
                            }}>
                            <Text
                                style={{
                                    color: 'gray',
                                    fontSize: 14,
                                    textAlign: 'left',
                                }}>
                                Reset
                            </Text>
                        </Pressable>
                    )}
            </View>
            {status === WeightedRankStatus.PRESENTING_RANKINGS && (
                <View style={{ flex: 1 }}>
                    <View style={styles.list_item}>
                        <View style={{ flex: 0.3 }} />
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: colors.text,
                                fontSize: 16,
                                flex: 1,
                            }}>
                            Team
                        </Text>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: colors.text,
                                fontSize: 16,
                                width: 50,
                            }}>
                            Score
                        </Text>
                    </View>
                    <ScrollView>
                        {Array.from(teamMap)
                            .sort((a, b) => a[1].sum / a[1].count - b[1].sum / b[1].count)
                            .reverse()
                            .map((team, index) => {
                                return (
                                    <View style={styles.list_item} key={index}>
                                        <Text
                                            style={{
                                                color: 'gray',
                                                fontSize: 16,
                                                flex: 0.3,
                                                fontWeight: 'bold',
                                            }}>
                                            {index + 1}
                                        </Text>
                                        <Text style={{ color: colors.text, fontSize: 16, flex: 1 }}>
                                            {team[0]}
                                        </Text>
                                        <Text style={{ color: colors.text, fontSize: 16, width: 50 }}>
                                            {parseFloat((team[1].sum / team[1].count).toFixed(2))}
                                        </Text>
                                    </View>
                                );
                            })}
                    </ScrollView>
                </View>
            )}
            {status === WeightedRankStatus.PROCESSING && (
                <Text style={{ color: colors.text, fontSize: 20, textAlign: 'center' }}>
                    Processing...
                </Text>
            )}
            {status === WeightedRankStatus.CHOOSING_WEIGHTS && (
                <ScrollView>
                    {currForm &&
                        currForm.map((question, index) => {
                            if (question.type === 'heading') {
                                return (
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            marginVertical: '5%',
                                        }}
                                        key={index}>
                                        {question.title}
                                    </Text>
                                );
                            }
                            if (question.type === 'number') {
                                return (
                                    <View
                                        style={{
                                            paddingBottom: '4%',
                                            paddingTop: '4%',
                                        }}
                                        key={index}>
                                        <Pressable
                                            onPress={() => {
                                                let temp = [...listOfWeights]; // Create a new array by spreading the old one
                                                temp[index] = 0;
                                                setListOfWeights(temp);
                                            }}>
                                            <Text
                                                style={{
                                                    color:
                                                        listOfWeights[index] === 0 ? 'gray' : colors.text,
                                                    fontSize: 16,
                                                }}>
                                                {question.question}
                                            </Text>
                                        </Pressable>
                                        {/*<Text>{listOfWeights[index]}</Text>*/}
                                        <Slider
                                            style={{ width: '100%', height: 40 }}
                                            minimumValue={-1}
                                            maximumValue={1}
                                            minimumTrackTintColor={
                                                listOfWeights[index] === 0
                                                    ? 'dimgray'
                                                    : listOfWeights[index] > 0
                                                        ? colors.primary
                                                        : 'red'
                                            }
                                            tapToSeek={true}
                                            value={listOfWeights[index]}
                                            onValueChange={value => {
                                                let temp = [...listOfWeights]; // Create a new array by spreading the old one
                                                temp[index] = value;
                                                setListOfWeights(temp);
                                            }}
                                        />
                                        {listOfWeights.length > 0 && (
                                            <View>
                                                <Text style={{ color: colors.text, textAlign: 'center' }}>
                                                    {listOfWeights[index].toFixed(2)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            }
                        })}
                    {listOfWeights !== originalWeights && (
                        <Pressable
                            onPress={() => generateRankings()}
                            style={{
                                marginVertical: '10%',
                                justifyContent: 'space-evenly',
                                flexDirection: 'row',
                                backgroundColor: colors.primary,
                                marginHorizontal: '5%',
                                padding: '5%',
                                borderRadius: 12,
                                // flex: 1,
                            }}>
                            <Svg
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 16 16">
                                <Path
                                    fill="white"
                                    d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5m0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5z"
                                />
                            </Svg>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 20,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                }}>
                                Generate Rankings
                            </Text>
                        </Pressable>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

export default WeightedRank;
