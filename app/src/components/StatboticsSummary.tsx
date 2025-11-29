import { type PropsWithChildren, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { Statbotics } from "../lib/frc/statbotics";
import { UIText } from "../ui/UIText";
import { useTheme } from "../lib/contexts/ThemeContext.ts";

// Note: Statbotics is said to update their data every 6 hours from Blue Alliance.

interface InfoCapsuleProps {
    title: string;
    value: number | null;
}
function InfoCapsule({ title, value }: InfoCapsuleProps) {
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <UIText size={20} bold>
                {value ?? "N/A"}
            </UIText>
            <UIText size={12} level={1}>
                {title}
            </UIText>
        </View>
    );
}

function InfoRow({ children }: PropsWithChildren) {
    return <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 4 }}>{children}</View>;
}

export interface StatboticsSummaryProps {
    team: number;
}
export function StatboticsSummary({ team }: StatboticsSummaryProps) {
    "use memo";

    const { colors } = useTheme();

    const [overall, setOverall] = useState<Statbotics.TeamYear | null>(null);
    const [competitions, setCompetitions] = useState<Statbotics.TeamEvent[] | null>(null);
    const [loading, setLoading] = useState(false);

    async function refresh() {
        setLoading(true);
        await Promise.all([
            Statbotics.getTeamYear(team).then(setOverall),
            Statbotics.getTeamEvents(team).then(setCompetitions),
        ]);
        setLoading(false);
    }

    useEffect(() => {
        setOverall(null);
        void refresh();
    }, [team]);

    const styles = StyleSheet.create({
        container: {
            width: "100%",
            padding: 16,
            backgroundColor: colors.bg1.hex,
            borderWidth: 1,
            borderColor: colors.border.hex,
            borderRadius: 10,
        },
    });

    let title = `Team #${team} Statistics`;
    let message: string | undefined;

    if (loading) message = "Loading...";
    else if (overall === null || competitions === null)
        message = "This team is not in the database. Please check your team number.";

    if (message !== undefined) {
        return (
            <View style={styles.container}>
                <UIText size={20} bold style={{ textAlign: "center" }}>
                    {title}
                </UIText>
                <UIText italic style={{ textAlign: "center" }}>
                    {message}
                </UIText>
            </View>
        );
    } else {
        if (overall === null) {
            throw new Error("Assertion failed"); // message should have been set to true if overall === null
        }

        return (
            <View style={styles.container}>
                {overall.epa.breakdown && (
                    <>
                        <UIText size={15} bold>
                            Overall Statistics
                        </UIText>
                        <InfoRow>
                            <InfoCapsule title="Auto EPA" value={overall.epa.breakdown.auto_points} />
                            <InfoCapsule title="Teleop EPA" value={overall.epa.breakdown.teleop_points} />
                            <InfoCapsule title="Endgame EPA" value={overall.epa.breakdown.endgame_points} />
                        </InfoRow>
                    </>
                )}

                <UIText size={15} bold style={{ marginTop: 16 }}>
                    Past Competitions
                </UIText>
                <FlatList
                    style={{ marginTop: 6 }}
                    data={competitions}
                    keyExtractor={(item) => item.event_key}
                    ListEmptyComponent={() => <UIText italic>No competitions found.</UIText>}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }}></View>}
                    renderItem={({ item }) => (
                        <View>
                            <UIText style={{ fontWeight: "500" }}>{item.event_name}</UIText>
                            {item.epa.breakdown && (
                                <InfoRow>
                                    <InfoCapsule title="Auto EPA" value={item.epa.breakdown.auto_points} />
                                    <InfoCapsule title="Teleop EPA" value={item.epa.breakdown.teleop_points} />
                                    <InfoCapsule title="Endgame EPA" value={item.epa.breakdown.endgame_points} />
                                </InfoRow>
                            )}
                        </View>
                    )}
                />
                <UIText level={1}>Powered by Statbotics</UIText>
            </View>
        );
    }
}
