import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { StatboticsSummary } from "@/components/StatboticsSummary";
import { CompetitionRank } from "./components/CompetitionRank";
import { TeamReportSummary } from "./components/TeamReportSummary";
import { CombinedGraph } from "./components/CombinedGraph";
import type { RootStackScreenProps } from "../index";
import { FormQuestionPicker } from "@/navigation/tabs/data/components/FormQuestionPicker";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { FormsDB } from "@/lib/database/Forms";
import { UIList } from "@/ui/components/UIList";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { type SimpleTeam, TBA } from "@/lib/frc/tba/TBA";

export interface TeamSummaryParams {
    teamId: number;
    competitionId: number;
}
export interface TeamSummaryProps extends RootStackScreenProps<"TeamSummary"> {}
export function TeamSummary({
    route: {
        params: { teamId, competitionId },
    },
    navigation,
}: TeamSummaryProps) {
    "use no memo"; // TODO: fix this

    const { data: competition, refetch: refetchCompetition } = useQuery({
        queryKey: ["competitions", competitionId],
        queryFn: () => CompetitionsDB.getCompetitionById(competitionId),
    });
    const { data: form, refetch: refetchForm } = useQuery({
        queryKey: ["forms", competition?.formId],
        queryFn: () => FormsDB.getForm(competition!.formId),
        enabled: !!competition && competition.formId !== undefined,
    });
    const { data: team, refetch: refetchTeam } = useQuery({
        queryKey: ["tba", "competition", { competitionId }, "teams"],
        queryFn: () =>
            CompetitionsDB.getCompetitionTBAKey(competitionId).then(TBA.getTeamsAtCompetition),
        select: useCallback(
            (teams: SimpleTeam[]) => teams.find((team) => team.team_number === teamId),
            [teamId],
        ),
        enabled: competitionId !== null,
    });
    const onRefresh = useCallback(
        () => Promise.all([refetchCompetition(), refetchForm(), refetchTeam()]),
        [refetchCompetition, refetchForm, refetchTeam],
    );

    const [chosenQuestionIndices, setChosenQuestionIndices] = useState<number[]>([]);
    const [graphActive, setGraphActive] = useState(false);

    const graphCreationModalRef = useRef<FormQuestionPicker>(null);

    if (team === undefined) {
        return <SafeAreaProvider></SafeAreaProvider>;
    }

    return (
        <SafeAreaProvider>
            <UIList onRefresh={onRefresh}>
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
                                navigation.navigate("TeamAutoPaths", {
                                    team_number: team.team_number,
                                    competitionId: competitionId,
                                });
                            },
                            caret: true,
                            disabled: form === undefined,
                            icon: Bs.SignMergeRight,
                        }),
                        UIList.Label({
                            label: "Create Performance Graph",
                            onPress: () => {
                                graphCreationModalRef.current?.present({
                                    form: form!.formStructure,
                                    onSubmit: () => setGraphActive(true),
                                    value: chosenQuestionIndices,
                                    setValue: setChosenQuestionIndices,
                                });
                            },
                            caret: false,
                            disabled: form === undefined,
                            icon: Bs.GraphUp,
                        }),
                        UIList.Label({
                            label: "Compare to another team",
                            onPress: () => {
                                navigation.navigate("TeamComparison", {
                                    team: team,
                                    compId: competitionId,
                                });
                            },
                            caret: true,
                            disabled: false,
                            icon: Bs.PlusSlashMinus,
                        }),
                    ],
                })}

                <StatboticsSummary team={team.team_number} />
                <TeamReportSummary team_number={team.team_number} competitionId={competitionId} />
            </UIList>

            <FormQuestionPicker ref={graphCreationModalRef} />

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
