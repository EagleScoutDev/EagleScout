import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { type NavigationProp, useTheme } from "@react-navigation/native";
import { CompetitionsDB, ScoutAssignmentsConfig } from "../../database/Competitions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormHelper } from "../../FormHelper";
import { ScoutAssignments } from "../../database/ScoutAssignments";
import * as Bs from "../../ui/icons";
import type { ScoutMenuParamList } from "./ScoutingFlow";

export interface UpcomingRoundsViewProps {
    navigation: NavigationProp<ScoutMenuParamList, "Dashboard">;
}
export function UpcomingRoundsView({ navigation }: UpcomingRoundsViewProps) {
    const { colors } = useTheme();

    const [upcomingRounds, setUpcomingRounds] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isCompetitionHappening, setIsCompetitionHappening] = useState(false);
    const [teamBased, setTeamBased] = useState(false);

    const positionText = ["R1", "R2", "R3", "B1", "B2", "B3"];

    const getUpcomingRounds = async () => {
        setRefreshing(true);
        let dbRequestWorked;
        let dbCompetition;
        try {
            dbCompetition = await CompetitionsDB.getCurrentCompetition();
            dbRequestWorked = true;
        } catch (e) {
            dbRequestWorked = false;
        }

        let comp;
        if (dbRequestWorked) {
            if (dbCompetition != null) {
                comp = dbCompetition;
                await AsyncStorage.setItem(FormHelper.ASYNCSTORAGE_COMPETITION_KEY, JSON.stringify(dbCompetition));
            } else {
                await AsyncStorage.removeItem(FormHelper.ASYNCSTORAGE_COMPETITION_KEY);
                await AsyncStorage.removeItem("scout-assignments");
            }
        } else {
            const storedComp = await FormHelper.readAsyncStorage(FormHelper.ASYNCSTORAGE_COMPETITION_KEY);
            if (storedComp != null) {
                comp = JSON.parse(storedComp);
            }
        }

        let scoutAssignments = null;
        if (comp != null) {
            setIsCompetitionHappening(true);
            if (dbRequestWorked) {
                if (comp.scoutAssignmentsConfig === ScoutAssignmentsConfig.TEAM_BASED) {
                    setTeamBased(true);
                    scoutAssignments = await ScoutAssignments.getScoutAssignmentsForCompetitionTeamBasedCurrentUser(
                        comp.id
                    );
                } else if (comp.scoutAssignmentsConfig === ScoutAssignmentsConfig.POSITION_BASED) {
                    setTeamBased(false);
                    scoutAssignments = await ScoutAssignments.getScoutAssignmentsForCompetitionPositionBasedCurrentUser(
                        comp.id
                    );
                } else {
                    scoutAssignments = [];
                }
                await AsyncStorage.setItem("scout-assignments", JSON.stringify(scoutAssignments));
            } else {
                const scoutAssignmentsOffline = await AsyncStorage.getItem("scout-assignments");
                if (scoutAssignmentsOffline != null) {
                    scoutAssignments = JSON.parse(scoutAssignmentsOffline);
                }
            }
        } else {
            setIsCompetitionHappening(false);
        }
        if (scoutAssignments != null) {
            scoutAssignments.sort((a, b) => {
                return a.matchNumber - b.matchNumber;
            });
        }
        setUpcomingRounds(scoutAssignments);
        setRefreshing(false);
    };

    const teamFormatter = (team: string) => (team.startsWith("frc") ? team.slice(3) : team);

    useEffect(() => {
        getUpcomingRounds();
        return navigation.addListener("focus", () => getUpcomingRounds());
    }, [navigation]);

    return isCompetitionHappening ? (
        upcomingRounds ? (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        alignSelf: "center",
                        height: "100%",
                        borderRadius: 10,
                        padding: "8%",
                        width: "100%",
                    }}
                >
                    {upcomingRounds.length !== 0 && (
                        <Text style={{ color: colors.text, paddingBottom: "5%" }}>
                            You have {upcomingRounds.length} round
                            {upcomingRounds.length !== 1 ? "s" : ""} left today.
                        </Text>
                    )}
                    {upcomingRounds.length === 0 && (
                        <View
                            style={{
                                backgroundColor: colors.card,
                                alignItems: "center",
                                padding: "5%",
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: colors.border,
                                justifyContent: "space-around",
                            }}
                        >
                            <Bs.CheckCircle
                                width="100%"
                                height="50%"
                                fill={colors.primary}
                                style={{ marginVertical: "10%" }}
                            />
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 24,
                                    padding: "5%",
                                    textAlign: "center",
                                    flex: 1,
                                }}
                            >
                                You have no rounds left to scout today.
                            </Text>
                        </View>
                    )}
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getUpcomingRounds} />}
                    >
                        {upcomingRounds.map((round) => (
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
                                    navigation.navigate("Scout Report", {
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
            </View>
        ) : (
            <>
                <Text style={{ color: colors.text }}>Connect to the internet to fetch upcoming rounds.</Text>
            </>
        )
    ) : (
        <Text style={{ color: colors.text, padding: "5%" }}>There is no competition happening currently.</Text>
    );
}
