import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { type CompetitionReturnData, CompetitionsDB } from "@/lib/database/Competitions";
import { type MatchReportReturnData, MatchReportsDB } from "@/lib/database/ScoutMatchReports";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";

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

export function WeightedRank() {
    const { colors } = useTheme();
    const [listOfWeights, setListOfWeights] = useState<number[]>([]);
    const [originalWeights, setOriginalWeights] = useState<number[]>([]);

    const [status, setStatus] = useState<WeightedRankStatus>(WeightedRankStatus.CHOOSING_WEIGHTS);

    const [numberQuestions, setNumberQuestions] = useState<object[]>([]);

    const [allReports, setAllReports] = useState<MatchReportReturnData[]>([]);

    const [teamMap, setTeamMap] = useState<Map<number, MapValue>>(new Map());

    // competition form
    const [currForm, setCurrForm] = useState<object[]>();
    const [compId, setCompID] = useState<number>(-1);

    const [noActiveCompetition, setNoActiveCompetition] = useState<boolean>(true);

    const [fullCompetitionsList, setFullCompetitionsList] = useState<CompetitionReturnData[]>([]);

    useEffect(() => {
        CompetitionsDB.getCurrentCompetition().then((competition) => {
            if (!competition) {
                console.log("no active competition for weighted rank");
                setNoActiveCompetition(true);
                CompetitionsDB.getCompetitions().then((c) => {
                    setFullCompetitionsList(c);
                });
                return;
            }
            console.log("active competition found for weighted rank");

            setCurrForm(competition.form);
            setCompID(competition.id);
            setNoActiveCompetition(false);
        });
    }, []);

    useEffect(() => {
        if (currForm) {
            let temp: object[] = [];
            for (let i = 0; i < currForm?.length; i++) {
                if (currForm[i].type === "number") {
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
        console.log("num scout reports: " + allReports.length);
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
            console.log("team " + key + " : " + value.sum / value.count);
        });
        setTeamMap(temp_map);
        setStatus(WeightedRankStatus.PRESENTING_RANKINGS);
    };

    useEffect(() => {}, []);

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
        MatchReportsDB.getReportsForCompetition(compId).then((reports) => {
            setAllReports(reports);
        });
    };

    const styles = StyleSheet.create({
        header: {
            color: colors.fg.hex,
            fontSize: 20,
        },
        container: {
            // backgroundColor: colors.bg1.hex,
            paddingHorizontal: "10%",
            flex: 1,
            marginBottom: "10%",
        },
        list_item: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border.hex,
            paddingVertical: "5%",
            flexDirection: "row",
        },
        list_text: {
            color: colors.fg.hex,
            fontSize: 14,
            flex: 1,
            textAlign: "left",
        },
        question_text: {
            color: colors.fg.hex,
            // fontWeight: 'bold',
            fontSize: 16,
        },
        rank_list_item: {
            // backgroundColor: colors.bg1.hex,
            color: "red",
            flexDirection: "row",
            // borderBottomWidth: 1,
            // borderColor: colors.border.hex,
            padding: "5%",
            paddingVertical: "2%",
        },
    });

    if (noActiveCompetition) {
        return (
            <ScrollView
                style={{
                    ...styles.container,
                    paddingVertical: "10%",
                }}
            >
                <UIText style={styles.header}>No Active Competition</UIText>
                <UIText>Please choose which competition you would like to view data for.</UIText>
                {fullCompetitionsList.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => {
                            setNoActiveCompetition(false);
                            setCurrForm(item.form);
                            setCompID(item.id);
                            setCompName(item.name);
                        }}
                    >
                        <View style={styles.list_item}>
                            <UIText style={styles.list_text}>{item.name}</UIText>
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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: "5%",
                }}
            >
                <UIText size={24}>Weighted Rank</UIText>

                {(status === WeightedRankStatus.PRESENTING_RANKINGS || originalWeights !== listOfWeights) && (
                    <Pressable
                        onPress={() => {
                            setListOfWeights(originalWeights);
                            setStatus(WeightedRankStatus.CHOOSING_WEIGHTS);
                        }}
                    >
                        <UIText placeholder style={{ textAlign: "left" }}>
                            Reset
                        </UIText>
                    </Pressable>
                )}
            </View>
            {status === WeightedRankStatus.PRESENTING_RANKINGS && (
                <View style={{ flex: 1 }}>
                    <View style={styles.list_item}>
                        <View style={{ flex: 0.3 }} />
                        <UIText size={16} bold style={{ flex: 1 }}>
                            Team
                        </UIText>
                        <UIText size={16} bold style={{ width: 50 }}>
                            Score
                        </UIText>
                    </View>
                    <ScrollView>
                        {Array.from(teamMap)
                            .sort((a, b) => a[1].sum / a[1].count - b[1].sum / b[1].count)
                            .reverse()
                            .map((team, index) => {
                                return (
                                    <View style={styles.list_item} key={index}>
                                        <UIText size={16} bold placeholder style={{ flex: 0.3 }}>
                                            {index + 1}
                                        </UIText>
                                        <UIText size={16} style={{ flex: 1 }}>
                                            {team[0]}
                                        </UIText>
                                        <UIText size={16} style={{ width: 50 }}>
                                            {parseFloat((team[1].sum / team[1].count).toFixed(2))}
                                        </UIText>
                                    </View>
                                );
                            })}
                    </ScrollView>
                </View>
            )}
            {status === WeightedRankStatus.PROCESSING && (
                <UIText size={20} style={{ textAlign: "center" }}>
                    Processing...
                </UIText>
            )}
            {status === WeightedRankStatus.CHOOSING_WEIGHTS && (
                <ScrollView>
                    {currForm &&
                        currForm.map((question, index) => {
                            if (question.type === "heading") {
                                return (
                                    <UIText size={20} bold style={{ marginVertical: "5%" }} key={index}>
                                        {question.title}
                                    </UIText>
                                );
                            }
                            if (question.type === "number") {
                                return (
                                    <View
                                        style={{
                                            paddingBottom: "4%",
                                            paddingTop: "4%",
                                        }}
                                        key={index}
                                    >
                                        <Pressable
                                            onPress={() => {
                                                let temp = [...listOfWeights]; // Create a new array by spreading the old one
                                                temp[index] = 0;
                                                setListOfWeights(temp);
                                            }}
                                        >
                                            <UIText size={16} placeholder={listOfWeights[index] === 0 ? 1 : 0}>
                                                {question.question}
                                            </UIText>
                                        </Pressable>
                                        {/*<UIText>{listOfWeights[index]}</UIText>*/}
                                        <Slider
                                            style={{ width: "100%", height: 40 }}
                                            minimumValue={-1}
                                            maximumValue={1}
                                            minimumTrackTintColor={
                                                listOfWeights[index] === 0
                                                    ? "dimgray"
                                                    : listOfWeights[index] > 0
                                                      ? colors.primary.hex
                                                      : "red"
                                            }
                                            tapToSeek={true}
                                            value={listOfWeights[index]}
                                            onValueChange={(value) => {
                                                let temp = [...listOfWeights]; // Create a new array by spreading the old one
                                                temp[index] = value;
                                                setListOfWeights(temp);
                                            }}
                                        />
                                        {listOfWeights.length > 0 && (
                                            <View>
                                                <UIText style={{ textAlign: "center" }}>
                                                    {listOfWeights[index].toFixed(2)}
                                                </UIText>
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
                                marginVertical: "10%",
                                justifyContent: "space-evenly",
                                flexDirection: "row",
                                backgroundColor: colors.primary.hex,
                                marginHorizontal: "5%",
                                padding: "5%",
                                borderRadius: 12,
                                // flex: 1,
                            }}
                        >
                            <Bs.CalculatorFill size="24" fill="white" />
                            <UIText size={20} bold style={{ color: "white", textAlign: "center" }}>
                                Generate Rankings
                            </UIText>
                        </Pressable>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
