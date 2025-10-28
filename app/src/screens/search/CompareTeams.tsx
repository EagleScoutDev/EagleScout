import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { CompetitionsDB } from "../../database/Competitions";
import { isTablet } from "../../lib/deviceType";
import { QuestionSummary } from "./QuestionSummary";
import { UIModal } from "../../ui/UIModal.tsx";
import { LineChart } from "react-native-chart-kit";
import { CompetitionRank } from "./CompetitionRank";
import { Color } from "../../lib/color.ts";
import { type MatchReportReturnData, MatchReportsDB } from "../../database/ScoutMatchReports";
import type { SearchMenuScreenProps } from "./SearchMenu";
import type { SimpleTeam } from "../../lib/frc/tba.ts";

export interface CompareTeamsParams {
    team: SimpleTeam;
    compId: number;
}
export interface CompareTeamsProps extends SearchMenuScreenProps<"CompareTeams"> {}
export function CompareTeams({ route }: CompareTeamsProps) {
    const { team, compId } = route.params;
    const { colors, dark } = useTheme();
    const [secondTeam, setSecondTeam] = useState<number | null>(null);

    const [uniqueTeams, setUniqueTeams] = useState<number[]>([]);

    const [formStructure, setFormStructure] = useState<Array<Object> | null>(null);

    const [firstTeamScoutData, setFirstTeamScoutData] = useState<MatchReportReturnData[] | null>([]);
    const [secondTeamScoutData, setSecondTeamScoutData] = useState<MatchReportReturnData[] | null>([]);

    const [graphActive, setGraphActive] = useState(false);
    const [chosenQuestionIndex, setChosenQuestionIndex] = useState<number>(0);

    const chartConfig = {
        backgroundGradientFrom: colors.card,
        backgroundGradientFromOpacity: 1.0,
        backgroundGradientTo: colors.card,
        backgroundGradientToOpacity: 1.0,
        color: (opacity = 1) => (dark ? `rgba(255, 255, 255, ${opacity})` : "rgba(0, 0, 0, 1)"),
        backgroundColor: colors.card,
        strokeWidth: 2, // optional, default 3
        // barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        fillShadowGradient: colors.card,
    };

    // initialization
    useEffect(() => {
        CompetitionsDB.getCompetitionById(compId).then((competition) => {
            if (!competition) {
                return;
            }
            MatchReportsDB.getReportsForTeamAtCompetition(team.team_number, competition.id).then((reports) => {
                setFirstTeamScoutData(reports);
            });
            setFormStructure(competition.form);
        });
    }, [compId, team]);

    // fetch second team data
    useEffect(() => {
        if (secondTeam === null) {
            return;
        }

        MatchReportsDB.getReportsForTeamAtCompetition(secondTeam, compId).then((reports) => {
            setSecondTeamScoutData(reports);
        });
    }, [secondTeam, compId]);

    // fetch teams at competition that have a scout report filled out
    useEffect(() => {
        MatchReportsDB.getReportsForCompetition(compId).then((reports) => {
            // setReports(reports);
            const teams = reports.map((report) => report.teamNumber);
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
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
        },
        section_heading_container: {
            flexDirection: "column",
            justifyContent: "space-between",
            marginHorizontal: "5%",
            marginTop: "10%",
            flexBasis: "100%",
        },
        section_heading: {
            color: colors.text,
            fontWeight: "bold",
            textAlign: "left",
            fontSize: 30,
        },
        section_description: {
            color: Color.parse(colors.primary).fg.hex,
            fontWeight: "bold",
        },
        question: {
            color: colors.text,
            fontWeight: "bold",
            textAlign: "left",
            // flex: 2,
            fontSize: 20,
        },
    });

    // let the user choose a second team to compare
    if (secondTeam === null || secondTeamScoutData === null) {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: 20, textAlign: "center" }}>Team 1</Text>
                    <Text style={{ color: colors.text, fontSize: 50, textAlign: "center" }}>{team.team_number}</Text>
                </View>
                {(secondTeamScoutData === null) !== (secondTeam === null) ? (
                    <View style={{ height: "90%", width: 1, backgroundColor: colors.border }} />
                ) : (
                    <ActivityIndicator size={"large"} />
                )}
                <ScrollView style={{ flex: 1 }}>
                    {uniqueTeams.map((team_number) => {
                        return (
                            <Pressable
                                onPress={() => setSecondTeam(team_number)}
                                style={{
                                    padding: 16,
                                    backgroundColor: colors.background,
                                    borderRadius: 10,
                                    borderBottomWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontSize: 20,
                                        textAlign: "center",
                                    }}
                                >
                                    {team_number}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>
        );
    }

    // main data comparison screen
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: colors.border,
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: 50, textAlign: "center" }}>{team.team_number}</Text>
                </View>
                <Text style={{ color: colors.text, fontSize: 20, textAlign: "center" }}>vs</Text>
                <View style={{ flex: 1 }}>
                    <Pressable onPress={() => setSecondTeam(null)}>
                        <Text style={{ color: colors.text, fontSize: 50, textAlign: "center" }}>{secondTeam}</Text>
                    </Pressable>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "baseline",
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <CompetitionRank team_number={team.team_number} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <CompetitionRank team_number={secondTeam} />
                    </View>
                </View>

                {formStructure && firstTeamScoutData && secondTeamScoutData ? (
                    formStructure.map((item, index) => {
                        if (item.type === "heading") {
                            return (
                                <View key={index} style={styles.section_heading_container}>
                                    <Text style={styles.section_heading}>{item.title}</Text>
                                    <Text style={styles.section_description}>{item.description}</Text>
                                </View>
                            );
                        }

                        return (
                            <Pressable
                                onPress={() => {
                                    if (item.type === "radio" || item.type === "number") {
                                        setGraphActive(true);
                                        setChosenQuestionIndex(index);
                                    }
                                }}
                                style={{
                                    padding: 10,
                                }}
                            >
                                <Text style={styles.question}>{item.question}</Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <QuestionSummary
                                        item={item}
                                        index={index}
                                        data={firstTeamScoutData.map((response) => {
                                            return {
                                                data: response.data[index],
                                                match: response.matchNumber,
                                            };
                                        })}
                                        generate_ai_summary={false}
                                        graph_disabled={true}
                                        show_question={false}
                                        only_average={!isTablet()}
                                    />
                                    {secondTeam && secondTeamScoutData && secondTeamScoutData.length > 0 && (
                                        <QuestionSummary
                                            item={item}
                                            index={index}
                                            data={secondTeamScoutData.map((response) => {
                                                return {
                                                    data: response.data[index],
                                                    match: response.matchNumber,
                                                };
                                            })}
                                            generate_ai_summary={false}
                                            graph_disabled={true}
                                            show_question={false}
                                            only_average={!isTablet()}
                                        />
                                    )}
                                </View>
                            </Pressable>
                        );
                    })
                ) : (
                    <ActivityIndicator size={"large"} />
                )}
            </ScrollView>

            {/*graph that can display data from both teams*/}
            <UIModal
                title={formStructure ? formStructure[chosenQuestionIndex].question : ""}
                visible={graphActive}
                onDismiss={() => setGraphActive(false)}
            >
                {firstTeamScoutData && secondTeamScoutData ? (
                    <LineChart
                        data={{
                            // include both first and second team data for the labels
                            labels: firstTeamScoutData.map((report, index) => String(index + 1)),

                            datasets: [
                                {
                                    data: firstTeamScoutData
                                        .sort((a, b) => a.matchNumber - b.matchNumber)
                                        .map((report) => report.data[chosenQuestionIndex]),
                                    color: (opacity = 1.0) => colors.primary,
                                    strokeWidth: 4, // optional
                                },
                                {
                                    data: secondTeamScoutData
                                        .sort((a, b) => a.matchNumber - b.matchNumber)
                                        .map((report) => report.data[chosenQuestionIndex]),
                                    color: (opacity = 1.0) => colors.text,
                                    strokeWidth: 4, // optional
                                },
                            ],
                            legend: [String(team.team_number), String(secondTeam)],
                        }}
                        width={Dimensions.get("window").width * 0.85} // from react-native
                        height={Dimensions.get("window").height / 4}
                        chartConfig={chartConfig}
                        bezier
                    />
                ) : (
                    <ActivityIndicator />
                )}
                <Text style={{ color: colors.text, textAlign: "center", fontWeight: "bold" }}>Match Number</Text>
                {formStructure &&
                    formStructure[chosenQuestionIndex].options &&
                    formStructure[chosenQuestionIndex].options.length > 0 && (
                        <>
                            <Text style={{ color: colors.text, textAlign: "center" }}>Graph Interpretation</Text>
                            {formStructure[chosenQuestionIndex].options?.map((option: string, index: number) => {
                                return (
                                    <Text style={{ color: colors.text, textAlign: "center" }}>
                                        {index + " - " + formStructure[chosenQuestionIndex].options![index]}
                                    </Text>
                                );
                            })}
                        </>
                    )}
            </UIModal>
        </View>
    );
}
