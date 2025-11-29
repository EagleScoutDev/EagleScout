import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { StatboticsSummary } from "../../components/StatboticsSummary.tsx";
import { CompetitionRank } from "./CompetitionRank";
import { ScoutSummary } from "./ScoutSummary";
import { CombinedGraph } from "./CombinedGraph"; // adjust the import path to match your file structur
import type { SearchMenuScreenProps } from "./SearchMenu";
import type { SimpleTeam } from "../../lib/frc/tba/TBA.ts";
import * as Bs from "../../ui/icons";
import { UIList } from "../../ui/UIList";
import { FormQuestionPicker } from "../data/FormQuestionPicker.tsx";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UISheetModal } from "../../ui/UISheetModal.tsx";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CompetitionsDB } from "../../database/Competitions.ts";
import { type FormReturnData, FormsDB } from "../../database/Forms.ts";

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

    const [form, setForm] = useState<FormReturnData | null>(null);
    useEffect(() => {
        CompetitionsDB.getCompetitionById(competitionId).then(({ formId }) => {
            FormsDB.getForm(formId).then(setForm);
        });
    }, [competitionId]);

    const [chosenQuestionIndices, setChosenQuestionIndices] = useState<number[]>([]);
    const [graphActive, setGraphActive] = useState(false);

    const graphCreationModalRef = useRef<BottomSheetModal>(null);

    return (
        <SafeAreaProvider>
            <UIList>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "bold" }}>
                        Team #{team.team_number}
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 20, fontStyle: "italic", marginBottom: 16 }}>
                        {team.nickname}
                    </Text>

                    <CompetitionRank team_number={team.team_number} />
                </View>

                {UIList.Section({
                    header: "Team Stats",
                    items: [
                        UIList.Label({
                            label: "See all scouting reports and notes",
                            onPress: () => {
                                navigation.navigate("TeamReports", {
                                    team_number: team.team_number,
                                    competitionId: competitionId,
                                });
                            },
                            caret: true,
                            disabled: false,
                            icon: Bs.ClipboardData,
                        }),
                        UIList.Label({
                            label: "See auto paths",
                            onPress: () => {
                                navigation.navigate("AutoPaths", {
                                    team_number: team.team_number,
                                    competitionId: competitionId,
                                });
                            },
                            caret: true,
                            disabled: false,
                            icon: Bs.SignMergeRight,
                        }),
                        UIList.Label({
                            label: "Create Performance Graph",
                            onPress: () => graphCreationModalRef.current?.present(),
                            caret: false,
                            disabled: false,
                            icon: Bs.GraphUp,
                        }),
                        UIList.Label({
                            label: "Compare to another team",
                            onPress: () =>
                                navigation.navigate("CompareTeams", {
                                    team: team,
                                    compId: competitionId,
                                }),
                            caret: true,
                            disabled: false,
                            icon: Bs.PlusSlashMinus,
                        }),
                    ],
                })}

                <StatboticsSummary team={team.team_number} />
                <ScoutSummary team_number={team.team_number} competitionId={competitionId} />
            </UIList>

            <UISheetModal ref={graphCreationModalRef} handleComponent={null} enablePanDownToClose>
                <FormQuestionPicker
                    form={form?.formStructure}
                    value={chosenQuestionIndices}
                    setValue={setChosenQuestionIndices}
                    compId={competitionId}
                    onSubmit={() => setGraphActive(true)}
                />
            </UISheetModal>

            <CombinedGraph
                team_number={team.team_number}
                competitionId={competitionId}
                modalActive={graphActive}
                setModalActive={setGraphActive}
                questionIndices={chosenQuestionIndices}
            />
        </SafeAreaProvider>
    );
}
