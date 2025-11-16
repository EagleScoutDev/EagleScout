import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Statbotics } from "../../components/Statbotics";
import { CompetitionRank } from "./CompetitionRank";
import { ScoutSummary } from "./ScoutSummary";
import { QuestionFormulaCreator } from "../data/QuestionFormulaCreator";
import { CombinedGraph } from "./CombinedGraph"; // adjust the import path to match your file structur
import type { SearchMenuScreenProps } from "./SearchMenu";
import type { SimpleTeam } from "../../lib/frc/tba";
import * as Bs from "../../ui/icons";
import { UIList } from "../../ui/UIList";

export interface TeamViewerParams {
    team: SimpleTeam;
    competitionId: number;
}
export interface TeamViewerProps extends SearchMenuScreenProps<"TeamViewer"> {}
export function TeamViewer({
    route: {
        params: { team, competitionId },
    },
    navigation,
}: TeamViewerProps) {
    const { colors } = useTheme();

    const [graphCreationModalVisible, setGraphCreationModalVisible] = useState(false);
    const [chosenQuestionIndices, setChosenQuestionIndices] = useState<number[]>([]);
    const [graphActive, setGraphActive] = useState(false);

    const styles = StyleSheet.create({
        team_header: {
            color: colors.text,
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "5%",
        },
        team_subheader: {
            color: colors.text,
            textAlign: "center",
            fontStyle: "italic",
            fontSize: 20,
        },
        label: {
            fontSize: 15,
            fontWeight: "600",
            color: colors.text,
            padding: "5%",
            borderRadius: 10,
        },
        reports_button: {
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            alignSelf: "center",
            minWidth: "85%",
            maxWidth: "85%",
            borderRadius: 10,
            backgroundColor: colors.card,
            marginTop: "5%",
        },
    });

    useEffect(() => {
        if (chosenQuestionIndices.length > 0 && !graphCreationModalVisible) {
            setGraphActive(true);
        }
    }, [chosenQuestionIndices, graphCreationModalVisible]);

    return (
        <View>
            <UIList>
                <Text style={styles.team_header}>Team #{team.team_number}</Text>
                <Text style={styles.team_subheader}>{team.nickname}</Text>

                <CompetitionRank team_number={team.team_number} />

                <UIList.Section header={"Team Stats"}>
                    <UIList.Label
                        label={"See all scouting reports and notes"}
                        onPress={() => {
                            navigation.navigate("TeamReports", {
                                team_number: team.team_number,
                                competitionId: competitionId,
                            });
                        }}
                        caret={true}
                        disabled={false}
                        icon={Bs.ClipboardData}
                    />
                    <UIList.Label
                        label={"See auto paths"}
                        onPress={() => {
                            navigation.navigate("AutoPaths", {
                                team_number: team.team_number,
                                competitionId: competitionId,
                            });
                        }}
                        caret={true}
                        disabled={false}
                        icon={Bs.SignMergeRight}
                    />
                    <UIList.Label
                        label={"Create Performance Graph"}
                        onPress={() => setGraphCreationModalVisible(true)}
                        caret={false}
                        disabled={false}
                        icon={Bs.GraphUp}
                    />
                    <UIList.Label
                        label={"Compare to another team"}
                        onPress={() =>
                            navigation.navigate("CompareTeams", {
                                team: team,
                                compId: competitionId,
                            })
                        }
                        caret={true}
                        disabled={false}
                        icon={Bs.PlusSlashMinus}
                    />
                </UIList.Section>

                <QuestionFormulaCreator
                    visible={graphCreationModalVisible}
                    setVisible={setGraphCreationModalVisible}
                    chosenQuestionIndices={chosenQuestionIndices}
                    setChosenQuestionIndices={setChosenQuestionIndices}
                    compId={competitionId}
                />

                <CombinedGraph
                    team_number={team.team_number}
                    competitionId={competitionId}
                    modalActive={graphActive}
                    setModalActive={setGraphActive}
                    questionIndices={chosenQuestionIndices}
                />

                <Statbotics team={team.team_number} />
                <ScoutSummary team_number={team.team_number} competitionId={competitionId} />
            </UIList>
        </View>
    );
}
