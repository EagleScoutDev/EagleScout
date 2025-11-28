import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { type NavigationProp, useTheme } from "@react-navigation/native";
import { ScoutAssignmentsConfig } from "../../database/Competitions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScoutAssignments } from "../../database/ScoutAssignments";
import * as Bs from "../../ui/icons";
import type { ScoutMenuParamList } from "./ScoutingFlow";
import { useCurrentCompetition } from "../../lib/hooks/useCurrentCompetition";

export interface UpcomingRoundsViewProps {
    navigation: NavigationProp<ScoutMenuParamList, "Dashboard">;
}
export function UpcomingRoundsView({ navigation }: UpcomingRoundsViewProps) {
    const { colors } = useTheme();

    const { competition, online } = useCurrentCompetition();

    const [upcomingRounds, setUpcomingRounds] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [teamBased, setTeamBased] = useState(false);

    const positionText = ["R1", "R2", "R3", "B1", "B2", "B3"];

    async function getUpcomingRounds() {
        setRefreshing(true);

        let scoutAssignments = null;
        if (competition !== null) {
            const scoutAssignmentsOffline = await AsyncStorage.getItem("scout-assignments");
            if (scoutAssignmentsOffline != null) {
                scoutAssignments = JSON.parse(scoutAssignmentsOffline);
            } else if (competition.scoutAssignmentsConfig === ScoutAssignmentsConfig.TEAM_BASED) {
                setTeamBased(true);
                scoutAssignments = await ScoutAssignments.getScoutAssignmentsForCompetitionTeamBasedCurrentUser(
                    competition.id
                );
            } else if (competition.scoutAssignmentsConfig === ScoutAssignmentsConfig.POSITION_BASED) {
                setTeamBased(false);
                scoutAssignments = await ScoutAssignments.getScoutAssignmentsForCompetitionPositionBasedCurrentUser(
                    competition.id
                );
            } else {
                scoutAssignments = [];
            }
            await AsyncStorage.setItem("scout-assignments", JSON.stringify(scoutAssignments));
        }
        if (scoutAssignments !== null) {
            scoutAssignments.sort((a, b) => {
                return a.matchNumber - b.matchNumber;
            });
        }
        setUpcomingRounds(scoutAssignments ?? []);
        setRefreshing(false);
    }
    useEffect(() => {
        navigation.addListener("focus", () => void getUpcomingRounds());
    }, [navigation]);

    if (competition === null) {
        return null;
    }

    if (!online) {
        return <Text style={{ color: colors.text }}>Connect to the internet to fetch upcoming rounds.</Text>;
    }

    const nRounds = upcomingRounds.length;

    return (
        <View>
            <View
                style={{
                    backgroundColor: colors.card,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                }}
            >
                {nRounds === 0 && <Bs.CheckCircle size={48} fill={colors.primary} />}

                <Text
                    style={{
                        marginLeft: 12,
                        color: colors.text,
                        fontSize: 18,
                        flex: 1,
                        flexWrap: "wrap",
                    }}
                >
                    You have {nRounds === 0 ? "no" : nRounds} round
                    {nRounds !== 1 ? "s" : ""} left to scout today.
                </Text>
            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getUpcomingRounds} />}>
                {upcomingRounds.map((round, index) => (
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.card,
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 10,
                            borderWidth: 1,
                            borderColor: colors.border,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            flex: 1,
                        }}
                        onPress={() => {
                            navigation.navigate("Match", {
                                match: round.matchNumber,
                                team: teamBased ? teamFormatter(round.team) : null,
                            });
                        }}
                    >
                        <View
                            style={{
                                // backgroundColor: 'red',
                                padding: "2%",
                                paddingTop: "0%",
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    color: colors.text,
                                    // padding: '2%',
                                }}
                            >
                                Match: {round.matchNumber}
                            </Text>
                            <View style={{ height: "20%" }} />
                            {teamBased ? (
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        color: colors.text,
                                        // padding: '2%',
                                    }}
                                >
                                    Team: {teamFormatter(round.team)}
                                </Text>
                            ) : (
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        color: colors.text,
                                        // padding: '2%',
                                    }}
                                >
                                    Position: {positionText[round.position]}
                                </Text>
                            )}
                        </View>
                        <View>
                            <Bs.ChevronRight
                                size="20"
                                color={"gray"}
                                style={{ position: "absolute", right: 20, top: 20 }}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
