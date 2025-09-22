import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StandardButton } from "../../ui/StandardButton.tsx";
import { supabase } from "../../lib/supabase.ts";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { StandardModal } from "./StandardModal.tsx";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { getIdealTextColor } from "../../lib/color.ts";
import type { Setter } from "../../lib/react";
import type { CompetitionReturnData } from "../../database/Competitions.ts";

export interface EditCompetitionModalProps {
    setVisible: Setter<boolean>;
    onRefresh: () => void;
    value: CompetitionReturnData;
}
export function EditCompetitionModal({ setVisible, onRefresh, value }: EditCompetitionModalProps) {
    const { colors } = useTheme();

    const [name, setName] = useState(value.name);
    const [startTime, setStartTime] = useState(new Date(value.startTime));
    const [endTime, setEndTime] = useState(new Date(value.endTime));

    const [showStartDate, setShowStartDate] = useState(Platform.OS === "ios");
    const [showStartTime, setShowStartTime] = useState(Platform.OS === "ios");
    const [showEndDate, setShowEndDate] = useState(Platform.OS === "ios");
    const [showEndTime, setShowEndTime] = useState(Platform.OS === "ios");

    const changesMade = () => {
        if (name !== value.name) return true;
        if (startTime !== value.startTime) return true;
        if (endTime !== value.endTime) return true;
        return false;
    };

    const styles = StyleSheet.create({
        label: {
            color: colors.text,
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
        },
        label_background: {
            backgroundColor: colors.card,
            borderRadius: 10,
            padding: 10,
            flex: 0.7,
        },
        date_row: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
        },
        date_background: {
            backgroundColor: colors.border,
            borderRadius: 10,
            padding: 10,
            flex: 1,
            marginLeft: 5,
        },
    });

    const updateCompetition = async () => {
        const { data, error } = await supabase
            .from("competitions")
            .update({
                name: name,
                start_time: startTime,
                end_time: endTime,
            })
            .eq("id", value.id);

        return error;
    };

    const deleteCompetition = async () => {
        const { data, error } = await supabase.from("competitions").delete().eq("id", value.id);
        if (error) {
            console.error(error);
            Alert.alert(
                "Error",
                "There was an error deleting the competition. Please try again.",
                [
                    {
                        text: "OK",
                        onPress: () => {},
                    },
                ],
                { cancelable: false }
            );
        } else {
            setVisible(false);
            onRefresh();
        }
    };

    return (
        <StandardModal title={`Edit "${name}"`} visible={true}>
            <TextInput
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    padding: 10,
                    borderRadius: 10,
                    width: "100%",
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: colors.text,
                }}
                placeholder="Competition Name"
                placeholderTextColor={colors.text}
                onChangeText={(text) => {
                    setName(text);
                }}
                value={name}
            />
            <View style={styles.date_row}>
                <View style={styles.label_background}>
                    <Text style={styles.label}>Start Time</Text>
                </View>
            </View>
            <View style={styles.date_row}>
                {Platform.OS !== "ios" && (
                    <>
                        <TouchableOpacity style={styles.date_background} onPress={() => setShowStartDate(true)}>
                            <Text style={styles.date}>{startTime.toLocaleDateString("en-US")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.date_background} onPress={() => setShowStartTime(true)}>
                            <Text style={styles.date}>{startTime.toLocaleTimeString("en-US")}</Text>
                        </TouchableOpacity>
                    </>
                )}
                {showStartDate && (
                    <RNDateTimePicker
                        value={startTime}
                        mode={"date"}
                        onChange={(event, date) => {
                            if (Platform.OS !== "ios") {
                                setShowStartDate(false);
                            }
                            if (event.type === "set") {
                                setStartTime(date);
                            }
                        }}
                    />
                )}
                {showStartTime && (
                    <RNDateTimePicker
                        value={startTime}
                        mode={"time"}
                        onChange={(event, date) => {
                            if (Platform.OS !== "ios") {
                                setShowStartTime(false);
                            }
                            if (event.type === "set") {
                                setStartTime(date);
                            }
                        }}
                    />
                )}
            </View>
            <View style={styles.date_row}>
                <View style={styles.label_background}>
                    <Text style={styles.label}>End Time</Text>
                </View>
            </View>
            <View style={styles.date_row}>
                {Platform.OS !== "ios" && (
                    <TouchableOpacity style={styles.date_background} onPress={() => setShowEndDate(true)}>
                        <Text style={styles.date}>{endTime.toLocaleDateString("en-US")}</Text>
                    </TouchableOpacity>
                )}
                {Platform.OS !== "ios" && (
                    <TouchableOpacity style={styles.date_background} onPress={() => setShowEndTime(true)}>
                        <Text style={styles.date}>{endTime.toLocaleTimeString("en-US")}</Text>
                    </TouchableOpacity>
                )}
                {showEndDate && (
                    <RNDateTimePicker
                        value={endTime}
                        mode={"date"}
                        onChange={(event, date) => {
                            if (Platform.OS !== "ios") {
                                setShowEndDate(false);
                            }
                            if (event.type === "set") {
                                setEndTime(date);
                            }
                        }}
                    />
                )}
                {showEndTime && (
                    <RNDateTimePicker
                        value={endTime}
                        mode={"time"}
                        onChange={(event, date) => {
                            if (Platform.OS !== "ios") {
                                setShowEndTime(false);
                            }
                            if (event.type === "set") {
                                setEndTime(date);
                            }
                        }}
                    />
                )}
            </View>
            <View
                style={{
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <StandardButton
                        textColor={getIdealTextColor(colors.notification)}
                        text={"Delete"}
                        color={colors.notification}
                        width={"40%"}
                        onPress={() => {
                            Alert.alert(
                                "Delete " + name + "?",
                                "Are you sure you want to delete this competition? This action cannot be undone.\nWARNING: This will delete all scout reports for this competition.",
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => {
                                            setVisible(false);
                                        },
                                        style: "cancel",
                                    },
                                    {
                                        text: "Delete",
                                        onPress: async () => deleteCompetition(),
                                    },
                                ],
                                { cancelable: false }
                            );
                        }}
                    />

                    <StandardButton
                        text={"Cancel"}
                        color={colors.border}
                        textColor={colors.text}
                        width={"40%"}
                        onPress={() => setVisible(false)}
                    />
                </View>
                <StandardButton
                    text={"Save"}
                    color={colors.primary}
                    width={"100%"}
                    onPress={async () => {
                        if (!changesMade()) {
                            setVisible(false);
                            return;
                        }

                        if (startTime > endTime) {
                            Alert.alert(
                                "Error",
                                "The start time must be before the end time.",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {},
                                        style: "cancel",
                                    },
                                ],
                                { cancelable: false }
                            );
                            return;
                        }

                        const error = await updateCompetition();

                        if (error) {
                            console.error(error);
                            Alert.alert(
                                "Error",
                                "There was an error updating the competition. Please try again.",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {},
                                        style: "cancel",
                                    },
                                ],
                                { cancelable: false }
                            );
                        } else {
                            setVisible(false);
                            onRefresh();
                        }
                    }}
                />
            </View>
        </StandardModal>
    );
}
