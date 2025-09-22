import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { StandardModal } from "./StandardModal";
import { SelectMenu } from "../form/SelectMenu";
import { StandardButton } from "../StandardButton";
import { useTheme } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import type { CompetitionReturnData } from "../../database/Competitions";
import type { Setter } from "../../lib/react/types";

export function Spacer() {
    return <View style={{ height: "2%" }} />;
}

export interface SetScoutAssignmentModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    competition: CompetitionReturnData;
    matches: unknown[];
    setNameCb: unknown;
    teamBased: unknown;
}
export function SetScoutAssignmentModal({
    visible,
    setVisible,
    competition,
    matches,
    setNameCb,
    teamBased,
}: SetScoutAssignmentModalProps) {
    const [name, setName] = useState("");
    const [userId, setUserId] = useState(null);
    const [names, setNames] = useState([]);
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        user_name_input: {
            // height: 50,
            borderColor: "gray",
            borderWidth: 1,
            width: "100%",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            color: colors.text,
            fontSize: 18,
        },
        button_row: { flexDirection: "row", justifyContent: "space-evenly" },
    });

    const searchForUser = async (nameArg) => {
        if (nameArg === "" || nameArg == null) {
            setNames([]);
            return;
        }
        let namesArray = nameArg.split(" ");
        namesArray = namesArray.filter((element) => element !== "");
        const result = "'" + namesArray.join("' & '") + "'";
        const { data, error } = await supabase.from("profiles").select("id, name").textSearch("name", result);
        if (error) {
            console.error(error);
        } else {
            setNames(data);
        }
    };

    useEffect(() => {
        if (matches != null) {
            if (matches.length === 1) {
                setName(matches[0].name);
            } else {
                setName("");
            }
            setNames([]);
            setUserId(null);
        }
    }, [matches, visible]);

    useEffect(() => {
        searchForUser(name).catch(console.error);
    }, [name]);

    useEffect(() => {
        if (userId == null) {
            return;
        }
        for (const nameObj of names) {
            if (nameObj.id === userId) {
                setName(nameObj.name);
                return;
            }
        }
    }, [names, userId]);

    const getTableName = () => {
        if (teamBased) {
            return "scout_assignments_team_based";
        } else {
            return "scout_assignments_position_based";
        }
    };

    const getPosition = (match) => {
        console.log(match);
        if (match.position === 0) {
            return "rf";
        } else if (match.position === 1) {
            return "rm";
        } else if (match.position === 2) {
            return "rc";
        } else if (match.position === 3) {
            return "bf";
        } else if (match.position === 4) {
            return "bm";
        } else if (match.position === 5) {
            return "bc";
        }
    };

    const onSubmit = async () => {
        if (userId == null) {
            Alert.alert("Error", "Please select a user.");
            return;
        }
        console.log(matches[0]);
        const upsertPromises = matches.map((match) => {
            let vals;
            if (teamBased) {
                vals = {
                    competition_id: competition.id,
                    match_id: match.id,
                    user_id: userId,
                };
            } else {
                console.log("pos: " + getPosition(match.position));
                vals = {
                    competition_id: competition.id,
                    match_number: match.match,
                    robot_position: getPosition(match),
                    user_id: userId,
                };
            }
            return supabase.from(getTableName()).upsert(vals, {
                onConflict: teamBased ? "competition_id, match_id" : "competition_id, match_number, robot_position",
            });
        });
        const upsertResults = await Promise.all(upsertPromises);
        for (const result of upsertResults) {
            if (result.error) {
                console.error(result);
                Alert.alert("Error", "Failed to set scout assignment(s).");
                return;
            }
        }
        setNameCb(name);
        setVisible(false);
    };

    const deleteScoutAssignment = async () => {
        const deletePromises = matches.map((match) => {
            return supabase.from(getTableName()).delete().match({ competition_id: competition.id, match_id: match.id });
        });
        const deleteResults = await Promise.all(deletePromises);
        for (const result of deleteResults) {
            if (result.error) {
                console.error(result.error);
                Alert.alert("Error", "Failed to delete scout assignment(s).");
                return;
            }
        }
        setNameCb(null);
        setVisible(false);
    };

    const onDelete = () => {
        Alert.alert("Confirm", "Are you sure you want to delete this scout assignment?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteScoutAssignment(),
            },
        ]);
    };

    return (
        <>
            {matches && (
                <StandardModal title={"Set scout assignment"} visible={visible}>
                    {matches.length === 1 && (
                        <>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 18,
                                    fontWeight: "600",
                                    textAlign: "center",
                                }}
                            >
                                Match: {matches[0].match}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 18,
                                    fontWeight: "600",
                                    textAlign: "center",
                                }}
                            >
                                Team: {matches[0].teamFormatted}
                            </Text>
                        </>
                    )}
                    <Text
                        style={{
                            color: colors.text,
                        }}
                    >
                        Search for a user
                    </Text>
                    <Spacer />
                    <TextInput
                        style={styles.user_name_input}
                        placeholder="User's name"
                        onChangeText={(text) => setName(text)}
                        value={name}
                    />
                    <Spacer />

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            zIndex: 100,
                            // align with competition name input
                            marginTop: 10,
                        }}
                    >
                        <SelectMenu
                            setSelected={setUserId}
                            data={names.map((f) => ({
                                value: f.name,
                                key: f.id,
                            }))}
                            searchEnabled={false}
                            searchPlaceholder={"Search for a user..."}
                            placeholder={"Select a user..."}
                            notFoundText={"No users found"}
                            maxHeight={100}
                        />
                    </View>

                    <Spacer />
                    <View style={styles.button_row}>
                        <StandardButton
                            color={colors.primary}
                            onPress={() => setVisible(false)}
                            text={"Cancel"}
                            width={"40%"}
                        />
                        <StandardButton
                            color={"#29a329"}
                            onPress={() => {
                                console.log("submitting scout assignment");
                                onSubmit().catch(console.error);
                            }}
                            text={"Submit"}
                            width={"40%"}
                        />
                    </View>
                    {(matches.length > 1 || matches[0].assignmentExists) && (
                        <View style={styles.button_row}>
                            <StandardButton
                                color={"#e60000"}
                                onPress={() => {
                                    console.log("deleting scout assignment");
                                    onDelete();
                                }}
                                text={"Delete"}
                                width={"40%"}
                            />
                        </View>
                    )}
                </StandardModal>
            )}
        </>
    );
}
