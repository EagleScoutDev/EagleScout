import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useState } from "react";
import { isTablet } from "@/lib/deviceType";
import { LineChart } from "react-native-chart-kit";
import type { TBATeam } from "@/lib/db/tba";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { UIModal } from "@/ui/components/UIModal";
import type { RootStackScreenProps } from "@/navigation";
import { CompetitionRank } from "./components/CompetitionRank";
import { QuestionSummary } from "@/navigation/(recon)/components/QuestionSummary";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export interface TeamComparisonParams {
    team: TBATeam;
    compId: number;
}
export interface TeamComparisonProps extends RootStackScreenProps<"TeamComparison"> {}
export function TeamComparison({ route }: TeamComparisonProps) {
    const { team, compId } = route.params;
    const { colors, dark } = useTheme();
    const [secondTeam, setSecondTeam] = useState<number | null>(null);

    const [graphActive, setGraphActive] = useState(false);
    const [chosenQuestionIndex, setChosenQuestionIndex] = useState<number>(0);

    const { data: competition } = useQuery(queries.competitions.forId({ id: compId }));
    const { data: firstTeamScoutData = [] } = useQuery(
        queries.matchReports.forTeamAtComp({ teamNumber: team.team_number, compId }),
    );
    const { data: secondTeamScoutData = [] } = useQuery({
        ...queries.matchReports.forTeamAtComp({ teamNumber: secondTeam ?? 0, compId }),
        enabled: secondTeam !== null,
    });
    const { data: allReports = [] } = useQuery(
        queries.matchReports.forComp({ id: compId }),
    );

    const formStructure = competition?.form;
    const uniqueTeams = allReports
        .map((report) => report.teamNumber)
        .filter((teamNum, index, array) => array.indexOf(teamNum) === index && teamNum !== team.team_number)
        .sort((a, b) => a - b);

    const chartConfig = {
        backgroundGradientFrom: colors.bg1.hex,
        backgroundGradientFromOpacity: 1.0,
        backgroundGradientTo: colors.bg1.hex,
        backgroundGradientToOpacity: 1.0,
        color: (opacity = 1) => (dark ? `rgba(255, 255, 255, ${opacity})` : "rgba(0, 0, 0, 1)"),
        backgroundColor: colors.bg1.hex,
        strokeWidth: 2, // optional, default 3
        // barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        fillShadowGradient: colors.bg1.hex,
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg0.hex,
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
            color: colors.fg.hex,
            fontWeight: "bold",
            textAlign: "left",
            fontSize: 30,
        },
        section_description: {
            color: colors.primary.fg.hex,
            fontWeight: "bold",
        },
        question: {
            color: colors.fg.hex,
            fontWeight: "bold",
            textAlign: "left",
            // flex: 2,
            fontSize: 20,
        },
    });

    // let the user choose a second team to compare
    if (secondTeam === null) {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <UIText size={20}>Team 1</UIText>
                    <UIText size={50}>{team.team_number}</UIText>
                </View>
                {secondTeamScoutData.length > 0 ? (
                    <View style={{ height: "90%", width: 1, backgroundColor: colors.border.hex }} />
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
                                    backgroundColor: colors.bg0.hex,
                                    borderRadius: 10,
                                    borderBottomWidth: 1,
                                    borderColor: colors.border.hex,
                                }}
                            >
                                <UIText size={20} style={{ textAlign: "center" }}>
                                    {team_number}
                                </UIText>
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
                    borderColor: colors.border.hex,
                }}
            >
                <View style={{ flex: 1 }}>
                    <UIText size={50}>{team.team_number}</UIText>
                </View>
                <UIText size={20}>vs</UIText>
                <View style={{ flex: 1 }}>
                    <Pressable onPress={() => setSecondTeam(null)}>
                        <UIText size={50} style={{ textAlign: "center" }}>
                            {secondTeam}
                        </UIText>
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
                                    <UIText style={styles.section_heading}>{item.title}</UIText>
                                    <UIText style={styles.section_description}>
                                        {item.description}
                                    </UIText>
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
                                <UIText style={styles.question}>{item.question}</UIText>
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
                                    {secondTeam &&
                                        secondTeamScoutData &&
                                        secondTeamScoutData.length > 0 && (
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
                backdropPressBehavior={"dismiss"}
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
                                    color: (opacity = 1.0) => colors.primary.hex,
                                    strokeWidth: 4, // optional
                                },
                                {
                                    data: secondTeamScoutData
                                        .sort((a, b) => a.matchNumber - b.matchNumber)
                                        .map((report) => report.data[chosenQuestionIndex]),
                                    color: (opacity = 1.0) => colors.fg.hex,
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
                <UIText bold style={{ textAlign: "center" }}>
                    Match Number
                </UIText>
                {formStructure &&
                    formStructure[chosenQuestionIndex].options &&
                    formStructure[chosenQuestionIndex].options.length > 0 && (
                        <>
                            <UIText style={{ textAlign: "center" }}>Graph Interpretation</UIText>
                            {formStructure[chosenQuestionIndex].options?.map(
                                (option: string, index: number) => {
                                    return (
                                        <UIText style={{ textAlign: "center" }}>
                                            {index +
                                                " - " +
                                                formStructure[chosenQuestionIndex].options![index]}
                                        </UIText>
                                    );
                                },
                            )}
                        </>
                    )}
            </UIModal>
        </View>
    );
}
