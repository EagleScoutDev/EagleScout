import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { StatboticsSummary } from "@/components/StatboticsSummary";
import { CompetitionRank } from "./components/CompetitionRank";
import { TeamReportSummary } from "./components/TeamReportSummary";
import { CombinedGraph } from "./components/CombinedGraph";
import type { BrowseTabScreenProps } from "../index";
import type { SimpleTeam } from "@/lib/frc/tba/TBA";
import { FormQuestionPicker } from "@/navigation/tabs/data/components/FormQuestionPicker";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { type FormReturnData, FormsDB } from "@/lib/database/Forms";
import { UIList } from "@/ui/components/UIList";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";
import { UISheetModal } from "@/ui/components/UISheetModal";

export interface TeamSummaryParams {
    team: SimpleTeam;
    competitionId: number;
}
export interface TeamSummaryProps extends BrowseTabScreenProps<"TeamViewer"> {}
export function TeamSummary({
    route: {
        params: { team, competitionId },
    },
    navigation,
}: TeamSummaryProps) {
    "use no memo"; // TODO: fix this
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
                    <UIText size={30} bold>
                        Team #{team.team_number}
                    </UIText>
                    <UIText size={20} italic style={{ marginBottom: 16 }}>
                        {team.nickname}
                    </UIText>

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
                <TeamReportSummary team_number={team.team_number} competitionId={competitionId} />
            </UIList>

            <UISheetModal ref={graphCreationModalRef} handleComponent={null} enablePanDownToClose>
                <FormQuestionPicker
                    form={form?.formStructure}
                    value={chosenQuestionIndices}
                    setValue={setChosenQuestionIndices}
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
