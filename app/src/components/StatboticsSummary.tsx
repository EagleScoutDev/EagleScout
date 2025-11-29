import { type PropsWithChildren, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Statbotics } from "../lib/frc/statbotics";

// Note: Statbotics is said to update their data every 6 hours from Blue Alliance.

interface InfoCapsuleProps {
    title: string;
    value: number | null;
}
function InfoCapsule({ title, value }: InfoCapsuleProps) {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>{value ?? "N/A"}</Text>
            <Text style={{ fontSize: 12, color: "gray" }}>{title}</Text>
        </View>
    );
}

function InfoRow({ children }: PropsWithChildren) {
    return <View style={{ flexDirection: "row", justifyContent: "space-around" }}>{children}</View>;
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
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
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
                <Text
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: colors.text,
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        textAlign: "center",
                        fontStyle: "italic",
                        color: colors.text,
                    }}
                >
                    {message}
                </Text>
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
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                color: colors.text,
                            }}
                        >
                            Overall Statistics
                        </Text>
                        <InfoRow>
                            <InfoCapsule title="Auto EPA" value={overall.epa.breakdown.auto_points} />
                            <InfoCapsule title="Teleop EPA" value={overall.epa.breakdown.teleop_points} />
                            <InfoCapsule title="Endgame EPA" value={overall.epa.breakdown.endgame_points} />
                        </InfoRow>
                    </>
                )}

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        marginTop: 16,
                        color: colors.text,
                    }}
                >
                    Past Competitions
                </Text>
                <FlatList
                    style={{ marginTop: 6 }}
                    data={competitions}
                    keyExtractor={(item) => item.event_key}
                    ListEmptyComponent={() => (
                        <Text style={{ color: colors.text, fontStyle: "italic" }}>No competitions found.</Text>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }}></View>}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{ fontWeight: "500", color: colors.text }}>{item.event_name}</Text>
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
                <Text style={{ marginTop: 16, textAlign: "center", color: "gray" }}>Powered by Statbotics</Text>
            </View>
        );
    }
}
