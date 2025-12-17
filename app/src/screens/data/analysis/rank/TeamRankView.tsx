import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { DataMenuScreenProps } from "../../DataMain";
import { MatchReportsDB } from "../../../../database/ScoutMatchReports";
import { UIList } from "../../../../ui/UIList";
import { UIText } from "../../../../ui/UIText";

export interface TeamRankViewProps extends DataMenuScreenProps<"TeamRank/View"> {}
export function TeamRankView({ route }: TeamRankViewProps) {
    const { compId, compName, questionIndex, questionText } = route.params;

    const [processing, setProcessing] = useState<boolean>(true);
    const [data, setData] = useState<{ team: number; average: number }[] | null>(null);

    useEffect(() => {
        const byTeam = new Map<number, number[]>();
        const averages = new Map<number, number>();

        setProcessing(true);
        MatchReportsDB.getReportsForCompetition(compId)
            .then((reports) => {
                for (let report of reports) {
                    const team = report.teamNumber;
                    const value = report.data[questionIndex];

                    if (byTeam.has(team)) byTeam.get(team)!.push(value);
                    else byTeam.set(team, [value]);
                }

                byTeam.forEach((value, team) => {
                    const sum = value.reduce((a, x) => a + x, 0);
                    averages.set(team, sum / value.length);
                });

                setData(
                    Array.from(averages.entries())
                        .map(([team, average]) => ({ team, average }))
                        .sort((a, b) => b.average - a.average)
                );
            })
            .finally(() => {
                setProcessing(false);
            });
    }, [compId, questionIndex]);

    return (
        <SafeAreaProvider>
            {/*<SafeAreaView edges={["top", "left", "right"]}>*/}
            {/*    <View style={{ padding: 16, alignItems: "center" }}>*/}
            {/*        <UIText size={20} bold>*/}
            {/*            {questionText}*/}
            {/*        </UIText>*/}
            {/*        {compName && (*/}
            {/*            <UIText size={14} level={1} style={{ marginTop: 4 }}>*/}
            {/*                {compName}*/}
            {/*            </UIText>*/}
            {/*        )}*/}
            {/*    </View>*/}
            {/*    <View style={{ paddingHorizontal: 16, flexDirection: "row" }}>*/}
            {/*        <UIText size={16} bold>*/}
            {/*            Team*/}
            {/*        </UIText>*/}
            {/*        <View style={{ flex: 1 }} />*/}
            {/*        <UIText size={16} bold>*/}
            {/*            Average*/}
            {/*        </UIText>*/}
            {/*    </View>*/}
            {/*</SafeAreaView>*/}
            <SafeAreaView style={{ flex: 1 }}>
                {!processing && (
                    <UIList loading={processing}>
                        {data &&
                            UIList.Section({
                                items: data.map(({ team, average }, i) =>
                                    UIList.Label({
                                        key: team,
                                        label: `${i + 1}. Team ${team}`,
                                        body: () => <UIText size={16}>{average.toFixed(2)}</UIText>,
                                    })
                                ),
                            })}

                        {/*{!data && (*/}
                        {/*    <View style={{ alignItems: "center" }}>*/}
                        {/*        <UIText size={16}>No data available.</UIText>*/}
                        {/*    </View>*/}
                        {/*)}*/}
                    </UIList>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
