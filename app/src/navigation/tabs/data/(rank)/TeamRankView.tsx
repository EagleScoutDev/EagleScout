import React, { useMemo } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { DataTabScreenProps } from "../index";
import { UIList } from "@/ui/components/UIList";
import { UIText } from "@/ui/components/UIText";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export interface TeamRankViewProps extends DataTabScreenProps<"TeamRank/View"> {}
export function TeamRankView({ route }: TeamRankViewProps) {
    const { compId, compName, questionIndex, questionText } = route.params;

    const { data: reports = [], isLoading } = useQuery(queries.matchReports.forComp({ id: compId }));

    const data = useMemo(() => {
        const byTeam = new Map<number, number[]>();
        const averages = new Map<number, number>();

        for (const report of reports) {
            const team = report.teamNumber;
            const value = report.data[questionIndex];
            if (byTeam.has(team)) byTeam.get(team)!.push(value);
            else byTeam.set(team, [value]);
        }

        byTeam.forEach((value, team) => {
            const sum = value.reduce((a, x) => a + x, 0);
            averages.set(team, sum / value.length);
        });

        return Array.from(averages.entries())
            .map(([team, average]) => ({ team, average }))
            .sort((a, b) => b.average - a.average);
    }, [reports, questionIndex]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                {!isLoading && (
                    <UIList loading={isLoading}>
                        {data && (
                            <UIList.Section>
                                {data.map(({ team, average }, i) => (
                                    <UIList.Row
                                        key={team}
                                        label={`${i + 1}. Team ${team}`}
                                        body={() => <UIText size={16}>{average.toFixed(2)}</UIText>}
                                    />
                                ))}
                            </UIList.Section>
                        )}
                    </UIList>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}