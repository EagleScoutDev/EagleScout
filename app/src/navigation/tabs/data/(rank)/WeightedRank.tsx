import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { type CompetitionReturnData } from "@/lib/db/models/Competition";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { queryClient } from "@/lib/queryClient";

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
    const [teamMap, setTeamMap] = useState<Map<number, MapValue>>(new Map());

    const [manualComp, setManualComp] = useState<CompetitionReturnData | null>(null);
    const { data: currentCompetition } = useQuery(queries.competitions.current);
    const { data: allCompetitions = [] } = useQuery({
        ...queries.competitions.all,
        enabled: !currentCompetition,
    });

    const activeComp = manualComp ?? currentCompetition ?? null;
    const compId = activeComp?.id ?? -1;
    const currForm = activeComp?.matchForm.formStructure as object[] | undefined;

    const noActiveCompetition = !activeComp;

    useEffect(() => {
        if (currForm) {
            const temp: object[] = [];
            for (let i = 0; i < currForm.length; i++) {
                if (currForm[i].type === "number") {
                    temp.push(currForm[i]);
                }
            }
            setNumberQuestions(temp);
        }
    }, [currForm]);

    useEffect(() => {
        if (numberQuestions.length > 0 && currForm) {
            const temp: number[] = [];
            for (let i = 0; i < currForm.length; i++) {
                temp.push(0);
            }
            setListOfWeights(temp);
            setOriginalWeights(temp);
        }
    }, [numberQuestions]);

    const processData = (reports: any[]) => {
        setStatus(WeightedRankStatus.PROCESSING);
        const temp_map = new Map<number, MapValue>();
        for (let i = 0; i < reports.length; i++) {
            const report = reports[i];
            let sum = 0;
            const count = 1;
            for (let j = 0; j < numberQuestions.length; j++) {
                sum += report.data[j] * listOfWeights[j];
            }
            if (temp_map.has(report.teamNumber)) {
                const temp = temp_map.get(report.teamNumber);
                if (temp) {
                    temp.sum += sum;
                    temp.count += count;
                    temp_map.set(report.teamNumber, temp);
                }
            } else {
                temp_map.set(report.teamNumber, { sum, count });
            }
        }
        setTeamMap(temp_map);
        setStatus(WeightedRankStatus.PRESENTING_RANKINGS);
    };

    const generateRankings = async () => {
        if (compId === -1) return;
        setStatus(WeightedRankStatus.FETCHING_REPORTS);
        const reports = await queryClient.fetchQuery(queries.matchReports.forComp({ id: compId }));
        processData(reports);
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
                {allCompetitions.map((item, index) => (
                    <Pressable key={index} onPress={() => setManualComp(item)}>
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

                {(status === WeightedRankStatus.PRESENTING_RANKINGS ||
                    originalWeights !== listOfWeights) && (
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
                                    <UIText
                                        size={20}
                                        bold
                                        style={{ marginVertical: "5%" }}
                                        key={index}
                                    >
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
                                            <UIText
                                                size={16}
                                                placeholder={listOfWeights[index] === 0 ? 1 : 0}
                                            >
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
