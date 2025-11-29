import { useEffect, useState } from "react";
import { UIText } from "../../../../ui/UIText";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import type { DataMenuScreenProps } from "../../DataMain";
import { type CompetitionReturnData, CompetitionsDB } from "../../../../database/Competitions";
import { MatchReportsDB } from "../../../../database/ScoutMatchReports";

interface Question {
    question: string;
    index: number;
}

export interface DataAggregationProps extends DataMenuScreenProps<"TeamRank"> {}
export function DataAggregation({}: DataAggregationProps) {
    const { colors } = useTheme();

    // competition form
    const [currForm, setCurrForm] = useState<Array<Object>>();

    // used to get data for the competition
    const [compID, setCompID] = useState<number>();

    const [chosenQuestion, setChosenQuestion] = useState<Question | null>(null);

    const [processing, setProcessing] = useState<boolean>(false);

    const [teamsToAverage, setTeamsToAverage] = useState<Map<number, number> | null>(null);

    const [compName, setCompName] = useState<string>();

    const [noActiveCompetition, setNoActiveCompetition] = useState<boolean>(false);
    // const navigation = useNavigation();

    const [fullCompetitionsList, setFullCompetitionsList] = useState<CompetitionReturnData[]>([]);

    useEffect(() => {
        CompetitionsDB.getCurrentCompetition().then((competition) => {
            if (!competition) {
                setNoActiveCompetition(true);
                CompetitionsDB.getCompetitions().then((c) => {
                    setFullCompetitionsList(c);
                });
                return;
            }

            setCurrForm(competition.form);
            setCompID(competition.id);
            setCompName(competition.name);
        });
    }, []);

    const onPress = (index: number, question: string) => {
        setChosenQuestion({
            index: index,
            question: question,
        });
        setProcessing(true);
        beginAggregation(index);
    };

    const beginAggregation = (index: number) => {
        let temp: Map<number, number[]>;
        temp = new Map<number, number[]>();

        let averaged_values: Map<number, number>;
        averaged_values = new Map<number, number>();

        console.log(chosenQuestion);
        MatchReportsDB.getReportsForCompetition(compID!).then((reports) => {
            for (let i = 0; i < reports.length; i++) {
                const relevant_field = reports[i].data[index];
                const team_num = reports[i].teamNumber;
                console.log("relevant field: " + relevant_field);

                let curr_values = temp.get(team_num) ?? [];
                curr_values.push(relevant_field);
                temp.set(team_num, curr_values);
            }

            temp.forEach((value, key) => {
                console.log(key, value);
                let sum: number = 0;
                value.forEach((v) => {
                    sum += v;
                });
                averaged_values.set(key, sum / value.length);
            });

            // now average, the values, and save that
            averaged_values.forEach((value, key) => {
                console.log(key, value);
            });

            const sorted = new Map([...averaged_values.entries()].sort().reverse());
            sorted.forEach((value, key) => {
                console.log(key, value);
            });
            setTeamsToAverage(sorted);
            setProcessing(false);
        });
    };

    const styles = StyleSheet.create({
        header: {
            color: colors.text,
            fontSize: 20,
        },
        container: {
            // backgroundColor: colors.card,
            marginHorizontal: "10%",
            // padding: '10%',
            borderRadius: 20,
            // maxHeight: '80%',
        },
        list_item: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingVertical: "5%",
            flexDirection: "row",
        },
        list_text: {
            color: colors.text,
            fontSize: 14,
            flex: 1,
            textAlign: "left",
        },
        question_text: {
            color: "dimgray",
            // fontWeight: 'bold',
            fontSize: 12,
            textAlign: "center",
        },
        rank_list_item: {
            // backgroundColor: colors.card,
            color: "red",
            flexDirection: "row",
            // borderBottomWidth: 1,
            // borderColor: colors.border,
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
        <View style={{ marginBottom: "60%", paddingHorizontal: "5%" }}>
            {chosenQuestion !== null && (
                <View>
                    <Pressable
                        onPress={() => {
                            setChosenQuestion(null);
                            setTeamsToAverage(null);
                        }}
                    >
                        <UIText size={18} style={{ paddingTop: "5%", paddingLeft: "5%" }}>
                            Back
                        </UIText>
                    </Pressable>
                    <UIText size={20} style={{ textAlign: "center", marginVertical: "5%", marginHorizontal: "8%" }}>
                        {chosenQuestion && chosenQuestion.question}
                    </UIText>
                </View>
            )}
            {chosenQuestion === null && (
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginHorizontal: "2%",
                            marginVertical: "2%",
                        }}
                    >
                        <UIText size={24}>{compName ? compName : "No Competition Selected"}</UIText>
                    </View>
                    <View style={{ marginHorizontal: "10%" }}>
                        <UIText style={styles.question_text}>Choose a question to begin.</UIText>
                        <ScrollView>
                            {currForm &&
                                currForm.map((item, index) => (
                                    <Pressable
                                        onPress={() => {
                                            if (item.type === "heading") {
                                                return;
                                            }
                                            onPress(index, item.question);
                                        }}
                                        key={item.question + String(index)}
                                    >
                                        {item.type === "heading" && (
                                            <UIText bold level={1} style={{ marginTop: "10%" }}>
                                                {item.title.toUpperCase()}
                                            </UIText>
                                        )}
                                        {item.type === "number" && (
                                            <View style={styles.list_item}>
                                                <UIText style={{ flex: 1 }}>{item.question}</UIText>
                                            </View>
                                        )}
                                    </Pressable>
                                ))}
                        </ScrollView>
                    </View>
                </View>
            )}
            {processing && (
                <View style={styles.container}>
                    <UIText style={styles.question_text}>Processing...</UIText>
                    <ActivityIndicator size={"large"} />
                </View>
            )}
            {teamsToAverage && (
                <View>
                    <View style={{ flexDirection: "row", paddingHorizontal: "10%" }}>
                        <View style={{ flex: 0.2 }} />
                        <UIText size={16} bold style={{ flex: 1 }}>
                            Team
                        </UIText>
                        <UIText size={16} bold style={{ flex: 1, textAlign: "right" }}>
                            Average Value
                        </UIText>
                    </View>
                    <ScrollView
                        style={{
                            // backgroundColor: colors.card,
                            // margin: '10%',
                            paddingHorizontal: "10%",
                            // borderRadius: 20,
                        }}
                    >
                        {teamsToAverage &&
                            Array.from(teamsToAverage)
                                .sort((a, b) => a[1] - b[1])
                                .reverse()
                                .map(([key, value], index) => (
                                    <View key={key} style={styles.rank_list_item}>
                                        <UIText bold level={1} style={{ flex: 0.2 }}>
                                            {index + 1}.
                                        </UIText>
                                        <UIText style={{ flex: 1 }}>{key}</UIText>
                                        <UIText style={styles.list_text}>{value.toFixed(2)}</UIText>
                                    </View>
                                ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}
