import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { DataMenuScreenProps } from "../../DataMain";
import { MatchReportsDB } from "../../../../database/ScoutMatchReports";
import { UIList } from "../../../../ui/UIList";
import { UIText } from "../../../../ui/UIText";

export interface DataAggregationListProps extends DataMenuScreenProps<"TeamRank/View"> {}
export function DataAggregationList({ route }: DataAggregationListProps) {
    const { compId, compName, questionIndex, questionText } = route.params;

    const [processing, setProcessing] = useState<boolean>(true);
    const [teamsToAverage, setTeamsToAverage] = useState<Map<number, number> | null>(null);

    useEffect(() => {
        const temp = new Map<number, number[]>();
        const averagedValues = new Map<number, number>();

        setProcessing(true);
        MatchReportsDB.getReportsForCompetition(compId)
            .then((reports) => {
                for (let i = 0; i < reports.length; i++) {
                    const relevantField = reports[i].data[questionIndex];
                    const teamNum = reports[i].teamNumber;

                    const currValues = temp.get(teamNum) ?? [];
                    currValues.push(relevantField);
                    temp.set(teamNum, currValues);
                }

                temp.forEach((value, key) => {
                    let sum = 0;
                    value.forEach((v) => {
                        sum += v;
                    });
                    averagedValues.set(key, sum / value.length);
                });

                const sorted = new Map([...averagedValues.entries()].sort((a, b) => b[1] - a[1]));
                setTeamsToAverage(sorted);
            })
            .finally(() => {
                setProcessing(false);
            });
    }, [compId, questionIndex]);

    const sortedTeams = useMemo(
        () => (teamsToAverage ? Array.from(teamsToAverage.entries()).sort((a, b) => b[1] - a[1]) : []),
        [teamsToAverage]
    );

    return (
        <SafeAreaProvider>
            <View style={{ padding: 16, alignItems: "center" }}>
                <UIText size={20} bold style={{ textAlign: "center" }}>
                    {questionText}
                </UIText>
                {compName && (
                    <UIText size={14} style={{ color: "dimgray", marginTop: 4, textAlign: "center" }}>
                        {compName}
                    </UIText>
                )}
            </View>
            <View style={{ paddingHorizontal: 16, flexDirection: "row" }}>
                <UIText size={16} bold>
                    Team
                </UIText>
                <View style={{ flex: 1 }} />
                <UIText size={16} bold>
                    Average
                </UIText>
            </View>
            {!processing && (
                <UIList loading={processing}>
                    {UIList.Section({
                        items: sortedTeams.map(([teamNumber, value], index) =>
                            UIList.Label({
                                key: teamNumber,
                                label: `${index + 1}. Team ${teamNumber}`,
                                body: () => <UIText size={16}>{value.toFixed(2)}</UIText>,
                            })
                        ),
                    })}

                    {!teamsToAverage && (
                        <View style={{ alignItems: "center" }}>
                            <UIText size={16}>No data available.</UIText>
                        </View>
                    )}
                </UIList>
            )}
        </SafeAreaProvider>
    );
}
