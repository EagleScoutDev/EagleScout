import { StatboticsSummary } from "@/components/StatboticsSummary";
import { type TBATeam } from "@/lib/db/tba";
import { queries } from "@/lib/queries";
import { FormQuestionPicker } from "@/navigation/tabs/data/components/FormQuestionPicker";
import { UIList } from "@/ui/components/UIList";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../index";
import { CombinedGraph } from "./components/CombinedGraph";
import { CompetitionRank } from "./components/CompetitionRank";
import { TeamReportSummary } from "./components/TeamReportSummary";

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
    const { data: competition, refetch: refetchCompetition } = useQuery(
        queries.competitions.forId({ id: competitionId }),
    );
    const { data: form, refetch: refetchForm } = useQuery({
        ...queries.forms.forId({ id: competition?.matchForm.id ?? 0 }),
        enabled: !!competition && competition.matchForm.id !== undefined,
    });
    const { data: team, refetch: refetchTeam } = useQuery({
        ...queries.tba.teamsAtCompetition({ id: competitionId }),
        select: useCallback(
            (teams: TBATeam[]) => teams.find((team) => team.team_number === teamId),
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

                <UIList.Section title="Team Stats">
                    <UIList.Row
                        label="See all scouting reports and notes"
                        onPress={() => {
                            navigation.navigate("TeamReports", {
                                team_number: team.team_number,
                                competitionId: competitionId,
                            });
                        }}
                        caret
                        disabled={false}
                        icon={Bs.ClipboardData}
                    />
                    <UIList.Row
                        label="See auto paths"
                        onPress={() => {
                            navigation.navigate("TeamAutoPaths", {
                                team_number: team.team_number,
                                competitionId: competitionId,
                            });
                        }}
                        caret
                        disabled={form === undefined}
                        icon={Bs.SignMergeRight}
                    />
                    <UIList.Row
                        label="Create Performance Graph"
                        onPress={() => {
                            graphCreationModalRef.current?.present({
                                form: form!.formStructure,
                                onSubmit: () => setGraphActive(true),
                                value: chosenQuestionIndices,
                                setValue: setChosenQuestionIndices,
                            });
                        }}
                        caret={false}
                        disabled={form === undefined}
                        icon={Bs.GraphUp}
                    />
                    <UIList.Row
                        label="Compare to another team"
                        onPress={() => {
                            navigation.navigate("TeamComparison", {
                                team: team,
                                compId: competitionId,
                            });
                        }}
                        caret
                        disabled={false}
                        icon={Bs.PlusSlashMinus}
                    />
                </UIList.Section>

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
