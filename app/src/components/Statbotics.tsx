import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { StatboticsAPI } from "../lib/frc/statbotics";

// Note: Statbotics is said to update their data every 6 hours from Blue Alliance.

/**
 * A capsule that displays a value and a label.
 * @param title {string} The label to display.
 * @param value {string} The value to display.
 * @returns {JSX.Element} The capsule.
 * @constructor The capsule.
 */
function InfoCapsule({ title, value, textColor }) {
    return (
        <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: textColor }}>{value}</Text>
            <Text style={{ fontSize: 12, color: "gray" }}>{title}</Text>
        </View>
    );
}

/**
 * A row of capsules.
 * @param children {JSX.Element[]} The capsules to display.
 * @returns {JSX.Element} The row.
 * @constructor The row.
 */
function InfoRow({ children }) {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 15,
            }}
        >
            {children}
        </View>
    );
}

export function Statbotics({ team }) {
    const [overall, setOverall] = useState<StatboticsAPI.TeamYear | null>(null);
    const [competitions, setCompetitions] = useState<StatboticsAPI.TeamEvent[] | null>(null);
    const [visible, setVisible] = useState(true);
    const [isTeam, setIsTeam] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTeamValid, setIsTeamValid] = useState(false);
    const { colors } = useTheme();

    /**
     * Fetches a team's overall data from Statbotics.
     * @param team_num {string} The team number to fetch data for.
     * @returns {Promise<void>} A promise that resolves when the data is fetched.
     */
    async function fetchTeam() {
        setIsLoading(true);
        const teamData = await StatboticsAPI.getTeamYear(team);
        if (teamData) {
            setOverall(teamData);
            setIsTeam(true);
        } else {
            setIsTeam(false);
        }
        setIsLoading(false);
    }

    /**
     * Fetches the team's event data from Statbotics.
     * This includes every event that the team participated in.
     */
    async function fetchTeamEvent() {
        const teamEvents = await StatboticsAPI.getTeamEvents(team);
        if (teamEvents) {
            setCompetitions(teamEvents);
        } else {
        }
    }

    useEffect(() => {
        setOverall(null);
        // setCompetitions(null);

        if (/^\d+$/.test(team) && Number(team) < 100000) {
            setIsTeamValid(true);
            fetchTeam(team).then(() => {
                fetchTeamEvent();
            });
        } else {
            setIsTeamValid(false);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [team]);

    const styles = StyleSheet.create({
        formSection: {
            width: "100%",
            flexDirection: "column",
            padding: 16,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            alignSelf: "center",
        },
    });

    // empty team number
    if (team === "") {
        return (
            <View style={styles.formSection}>
                <Text
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: colors.text,
                    }}
                    onPress={() => setVisible(!visible)}
                >
                    Team Statistics
                </Text>
                <Text
                    style={{
                        textAlign: "center",
                        fontStyle: "italic",
                        color: colors.text,
                    }}
                >
                    Get started by entering a team number.
                </Text>
            </View>
        );
    }

    if (!isTeamValid) {
        return (
            <View style={styles.formSection}>
                <Text
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: colors.text,
                    }}
                    onPress={() => setVisible(!visible)}
                >
                    Team Statistics
                </Text>
                <Text
                    style={{
                        textAlign: "center",
                        fontStyle: "italic",
                        color: colors.text,
                    }}
                >
                    Please enter a valid team number.
                </Text>
            </View>
        );
    }

    // team number is not in the database
    if (isLoading) {
        return (
            <View style={styles.formSection}>
                <Text
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: colors.text,
                    }}
                    onPress={() => setVisible(!visible)}
                >
                    Team {team} Statistics
                </Text>
                <Text
                    style={{
                        textAlign: "center",
                        fontStyle: "italic",
                        color: colors.text,
                    }}
                >
                    Loading...
                </Text>
            </View>
        );
    }

    // team number is not in the database
    if (!isTeam) {
        return (
            <View style={styles.formSection}>
                <Text
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: colors.text,
                    }}
                    onPress={() => setVisible(!visible)}
                >
                    Team {team} Statistics
                </Text>
                <Text style={{ textAlign: "center", color: "red" }}>
                    This team is not in the database. Please check your team number.
                </Text>
            </View>
        );
    }

    // minimized view, only shows team number and nickname
    if (!visible) {
        return (
            <View style={styles.formSection}>
                <Text
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: colors.text,
                    }}
                    onPress={() => setVisible(!visible)}
                >
                    Team {team} Statistics
                </Text>
                <Text
                    style={{
                        textAlign: "center",
                        fontStyle: "italic",
                        color: colors.text,
                    }}
                >
                    {overall ? overall.name : "Loading..."}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.formSection}>
            <View>
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: colors.text,
                    }}
                >
                    Overall Statistics
                </Text>
                {overall && "epa" in overall && (
                    <InfoRow>
                        <InfoCapsule
                            title="Auto EPA"
                            value={overall.epa.breakdown.auto_points}
                            textColor={colors.text}
                        />
                        <InfoCapsule
                            title="Teleop EPA"
                            value={overall.epa.breakdown.teleop_points}
                            textColor={colors.text}
                        />
                        <InfoCapsule
                            title="Endgame EPA"
                            value={overall.epa.breakdown.endgame_points}
                            textColor={colors.text}
                        />
                    </InfoRow>
                )}
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        marginTop: 10,
                        color: colors.text,
                    }}
                >
                    Past Competition Stats
                </Text>
                <ScrollView>
                    {overall &&
                        "epa" in overall &&
                        competitions != null &&
                        competitions[0] != null &&
                        competitions.map((comp) => (
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ fontWeight: "500", color: colors.text }}>{comp.event_name}</Text>
                                <InfoRow>
                                    <InfoCapsule
                                        title="Auto EPA"
                                        value={comp.epa.breakdown.auto_points}
                                        textColor={colors.text}
                                    />
                                    <InfoCapsule
                                        title="Teleop EPA"
                                        value={comp.epa.breakdown.teleop_points}
                                        textColor={colors.text}
                                    />
                                    <InfoCapsule
                                        title="Endgame EPA"
                                        value={comp.epa.breakdown.endgame_points}
                                        textColor={colors.text}
                                    />
                                </InfoRow>
                            </View>
                        ))}
                </ScrollView>
                <Text style={{ textAlign: "center", color: "gray", marginLeft: "2%" }}>Powered by Statbotics</Text>
            </View>
        </View>
    );
}
