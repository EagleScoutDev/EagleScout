import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { TBAMatches } from "../../../database/TBAMatches.ts";
import { SetScoutAssignmentModal } from "../../../components/modals/SetScoutAssignmentModal.tsx";
import { Position, ScoutAssignments } from "../../../database/ScoutAssignments.ts";
import { useTheme } from "@react-navigation/native";
import { ScoutAssignmentsConfig } from "../../../database/Competitions.ts";
import { AutoAssignModal } from "./AutoAssignModal.tsx";
import type { DataMenuScreenProps } from "../../data/DataMain.tsx";

export interface ScoutAssignmentsSpreadsheetParams {
    competition: number;
}
export interface ScoutAssignmentsSpreadsheetProps extends DataMenuScreenProps<"ScoutAssignments/Table"> {}
export function ScoutAssignmentsSpreadsheet({ route }: ScoutAssignmentsSpreadsheetProps) {
    const { competition } = route.params;
    const [matchesGrouped, setMatchesGrouped] = useState([]);
    const [scoutAssignmentModalVisible, setScoutAssignmentModalVisible] = useState(false);
    const [matches, setMatches] = useState(null);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const { colors } = useTheme();
    const [nextIdx, setNextIdx] = useState(0);
    const [autoAssignModalVisible, setAutoAssignModalVisible] = useState(false);
    const [processing, setProcessing] = useState(false);

    const styles = StyleSheet.create({
        scoutAssignmentContainer: {
            flex: 1,
            height: 50,
            padding: 8,
            margin: 5,
            borderRadius: 5,
        },
        scoutAssignmentCode: {
            fontWeight: "600",
            fontSize: 15,
            color: "#fff",
        },
        scoutAssignmentName: {
            fontSize: 16,
            color: "#fff",
            fontWeight: "600",
        },
    });

    useEffect(() => {
        setProcessing(true);
        (async () => {
            if (competition.scoutAssignmentsConfig === ScoutAssignmentsConfig.TEAM_BASED) {
                let matches = await TBAMatches.getMatchesForCompetition(competition.id);
                let scoutAssignments = await ScoutAssignments.getScoutAssignmentsForCompetitionTeamBased(
                    competition.id
                );

                matches = matches.filter((match) => match.compLevel === "qm");
                const matchesGrouped = [];
                let uniqueIndex = nextIdx;
                matches.forEach((match) => {
                    const matchingObject = matchesGrouped.find((obj) => obj.data[0].match === match.match);
                    let name = "";
                    let assignmentExists = false;
                    for (let i = 0; i < scoutAssignments.length; i++) {
                        if (scoutAssignments[i].matchId === match.id && scoutAssignments[i].team === match.team) {
                            name = scoutAssignments[i].userFullName;
                            assignmentExists = true;
                            break;
                        }
                    }
                    const matchData = {
                        ...match,
                        name: name,
                        assignmentExists: assignmentExists,
                        key: uniqueIndex++,
                        teamFormatted: teamFormatter(match.team),
                    };
                    if (matchingObject) {
                        matchingObject.data.push(matchData);
                    } else {
                        matchesGrouped.push({
                            data: [matchData],
                            title: `Match: ${match.match}`,
                        });
                    }
                });
                setNextIdx(uniqueIndex);

                matchesGrouped.sort((a, b) => {
                    return a.data[0].match - b.data[0].match;
                });

                setMatchesGrouped(matchesGrouped);
            } else {
                let matches = await TBAMatches.getMatchesForCompetition(competition.id);
                let scoutAssignments = await ScoutAssignments.getScoutAssignmentsForCompetitionPositionBased(
                    competition.id
                );

                matches = [];
                for (let i = 1; i <= 100; i++) {
                    // iterate through Position, add each available position to matches

                    for (let j = 0; j < 3; j++) {
                        // iterate through each alliance
                        matches.push({
                            match: i,
                            position: j,
                            alliance: "red",
                        });
                    }
                    for (let j = 3; j < 6; j++) {
                        // iterate through each alliance
                        matches.push({
                            match: i,
                            position: j,
                            alliance: "blue",
                        });
                    }
                }

                const matchesGrouped = [];
                let uniqueIndex = nextIdx;
                matches.forEach((match) => {
                    const matchingObject = matchesGrouped.find((obj) => obj.data[0].match === match.match);
                    let name = "";
                    let assignmentExists = false;
                    for (let i = 0; i < scoutAssignments.length; i++) {
                        if (
                            scoutAssignments[i].matchNumber === match.match &&
                            scoutAssignments[i].position === match.position
                        ) {
                            name = scoutAssignments[i].userFullName;
                            assignmentExists = true;
                            break;
                        }
                    }
                    const matchData = {
                        ...match,
                        name: name,
                        assignmentExists: assignmentExists,
                        key: uniqueIndex++,
                    };
                    if (matchingObject) {
                        matchingObject.data.push(matchData);
                    } else {
                        matchesGrouped.push({
                            data: [matchData],
                            title: `Match: ${match.match}`,
                        });
                    }
                });
                setNextIdx(uniqueIndex);

                matchesGrouped.sort((a, b) => {
                    return a.data[0].match - b.data[0].match;
                });

                setMatchesGrouped(matchesGrouped);
            }
            setProcessing(false);
        })();
    }, [competition]); // eslint-disable-line react-hooks/exhaustive-deps
    // Eslint exhausting deps was disabled because we don't want to re-render
    // when nextIdx changes. nextIdx is only used to keep track of the next
    // unique index for items, changes to it should not trigger a re-render
    // Putting it in the deps array would cause an infinite loop.

    const teamFormatter = (team) => {
        if (team.substring(0, 3) === "frc") {
            return team.substring(3);
        } else {
            return team;
        }
    };

    const setScoutAssignment = (item) => {
        if (selectMode) {
            if (selectedItems.length === 0) {
                Alert.alert("FormSelect an item", "Please select at least one item.");
                return;
            } else {
                setMatches(selectedItems);
            }
        } else {
            setMatches([item]);
        }
        setScoutAssignmentModalVisible(true);
    };

    const setNameCb = (name) => {
        let uniqueIndex = nextIdx;
        for (let matchGrouped of matchesGrouped) {
            for (let matchData of matchGrouped.data) {
                for (let match of matches) {
                    if (matchData.key === match.key) {
                        matchData.name = name ?? "";
                        matchData.assignmentExists = name !== null;
                        matchData.selected = false;
                        matchData.key = uniqueIndex++;
                    }
                }
            }
        }
        setNextIdx(uniqueIndex);
        setMatchesGrouped(matchesGrouped);
    };

    useEffect(() => {
        setSelectedItems([]);
        let uniqueIndex = nextIdx;
        for (let matchGrouped of matchesGrouped) {
            for (let matchData of matchGrouped.data) {
                if (matchData.selected) {
                    matchData.key = uniqueIndex++;
                    matchData.selected = false;
                }
            }
        }
        setNextIdx(uniqueIndex);
        setMatchesGrouped(matchesGrouped);
    }, [matchesGrouped, selectMode]);

    const setSelected = (item) => {
        item.selected = !item.selected;
        const originalKey = item.key;
        item.key = nextIdx;
        setNextIdx(nextIdx + 1);
        for (let i = 0; i < matchesGrouped.length; i++) {
            for (let j = 0; j < matchesGrouped[i].data.length; j++) {
                if (matchesGrouped[i].data[j].key === originalKey) {
                    matchesGrouped[i].data[j] = item;
                    break;
                }
            }
        }
        setSelectedItems([...selectedItems, item]);
        setMatchesGrouped(matchesGrouped);
    };

    const getColor = (item) => {
        if (item.alliance === "blue") {
            if (item.selected) {
                return "#3366ff";
            } else {
                return "#1a1aff";
            }
        } else {
            if (item.selected) {
                return "#ff6666";
            } else {
                return "#ff1a1a";
            }
        }
    };

    const getPosition = (pos) => {
        if (pos === Position.BC) {
            return "B3";
        } else if (pos === Position.BF) {
            return "B1";
        } else if (pos === Position.BM) {
            return "B2";
        } else if (pos === Position.RC) {
            return "R3";
        } else if (pos === Position.RF) {
            return "R1";
        } else if (pos === Position.RM) {
            return "R2";
        } else {
            return "Unknown";
        }
    };

    return (
        <>
            {processing && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" />
                </View>
            )}
            <View>
                {competition.scoutAssignmentsConfig === ScoutAssignmentsConfig.POSITION_BASED && (
                    <TouchableOpacity
                        onPress={() => setAutoAssignModalVisible(!selectMode)}
                        style={{
                            alignSelf: "flex-start",
                            // backgroundColor: colors.primary,
                            padding: 10,
                            borderRadius: 10,
                            position: "absolute",
                        }}
                    >
                        <Text
                            style={{
                                color: colors.primary,
                                fontWeight: "bold",
                                fontSize: 17,
                            }}
                        >
                            Auto-Assign
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => setSelectMode(!selectMode)}
                    style={{
                        alignSelf: "flex-end",
                        // backgroundColor: colors.primary,
                        padding: 10,
                        borderRadius: 10,
                        position: "absolute",
                    }}
                >
                    <Text
                        style={{
                            color: selectMode ? colors.primary : "gray",
                            fontWeight: "bold",
                            fontSize: 17,
                        }}
                    >
                        {selectMode ? "Exit" : "FormSelect Mode"}
                    </Text>
                </TouchableOpacity>
                {selectMode && (
                    <TouchableOpacity
                        onPress={() => {
                            setScoutAssignment(null);
                        }}
                        style={{
                            alignSelf: "flex-center",
                            marginLeft: "50%",
                            paddingTop: 10,
                            borderRadius: 10,
                            position: "absolute",
                        }}
                    >
                        <Text
                            style={{
                                color: colors.primary,
                                fontWeight: "bold",
                                fontSize: 17,
                            }}
                        >
                            OK
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView
                style={{
                    marginTop: 40,
                }}
            >
                {matchesGrouped.map((matches, index) => (
                    <>
                        <View
                            style={{
                                height: 30,
                                backgroundColor: "gray",
                                paddingTop: 6,
                                paddingLeft: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 400,
                                    color: "#fff",
                                }}
                            >
                                {matches.title}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.container,
                                {
                                    flexDirection: "row",
                                },
                            ]}
                        >
                            {[0, 1, 2].map((elem) => (
                                <TouchableOpacity
                                    style={[
                                        styles.scoutAssignmentContainer,
                                        {
                                            backgroundColor: getColor(matches.data[elem]),
                                        },
                                    ]}
                                    onPress={() =>
                                        selectMode
                                            ? setSelected(matches.data[elem])
                                            : setScoutAssignment(matches.data[elem])
                                    }
                                >
                                    <View>
                                        <Text style={styles.scoutAssignmentCode}>
                                            {competition.scoutAssignmentsConfig === ScoutAssignmentsConfig.TEAM_BASED
                                                ? matches.data[elem].teamFormatted
                                                : getPosition(matches.data[elem].position)}
                                        </Text>
                                        <Text style={styles.scoutAssignmentName}>{matches.data[elem].name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View
                            style={[
                                styles.container,
                                {
                                    flexDirection: "row",
                                },
                            ]}
                        >
                            {[3, 4, 5].map((elem) => (
                                <TouchableOpacity
                                    style={[
                                        styles.scoutAssignmentContainer,
                                        {
                                            backgroundColor: getColor(matches.data[elem]),
                                        },
                                    ]}
                                    onPress={() =>
                                        selectMode
                                            ? setSelected(matches.data[elem])
                                            : setScoutAssignment(matches.data[elem])
                                    }
                                >
                                    <View>
                                        <Text style={styles.scoutAssignmentCode}>
                                            {competition.scoutAssignmentsConfig === ScoutAssignmentsConfig.TEAM_BASED
                                                ? matches.data[elem].teamFormatted
                                                : getPosition(matches.data[elem].position)}
                                        </Text>
                                        <Text style={styles.scoutAssignmentName}>{matches.data[elem].name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ))}
            </ScrollView>
            <SetScoutAssignmentModal
                visible={scoutAssignmentModalVisible}
                setVisible={setScoutAssignmentModalVisible}
                competition={competition}
                matches={matches}
                setNameCb={setNameCb}
                teamBased={competition.scoutAssignmentsConfig === ScoutAssignmentsConfig.TEAM_BASED}
            />
            <AutoAssignModal
                visible={autoAssignModalVisible}
                setVisible={setAutoAssignModalVisible}
                colors={colors}
                compId={competition.id}
            />
        </>
    );
}
