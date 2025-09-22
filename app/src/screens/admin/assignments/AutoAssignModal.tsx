import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { StandardModal } from "../../../components/modals/StandardModal";
import { StandardButton } from "../../../ui/StandardButton";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { exMemo, type Setter } from "../../../lib/react";
import { type Theme, useTheme } from "@react-navigation/native";
import { NumberInput } from "../../../ui/input/Number.tsx";

export interface AutoAssignModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    compId: number;
}
export function AutoAssignModal({ visible, setVisible, compId }: AutoAssignModalProps) {
    const [users, setUsers] = useState([]);
    const [usersChecked, setUsersChecked] = useState<boolean[]>([]);
    const [usersKey, setUsersKey] = useState(0);
    const [nRounds, setNRounds] = useState(0);
    const [nShiftRounds, setNShiftRounds] = useState(0);
    const [processing, setProcessing] = useState(false);
    const { colors } = useTheme();
    const s = styles(colors);

    useEffect(() => {
        supabase
            .from("profiles")
            .select("id, name")
            .then(({ data, error }) => {
                if (error) {
                    console.error(error);
                } else {
                    setUsers(data);
                    setUsersChecked(new Array(data.length).fill(false));
                }
            });
    }, []);

    const onSubmit = () => {
        if (nRounds < nShiftRounds) {
            Alert.alert("Error", "Number of rounds must be greater than or equal to number of rounds in a shift");
            return;
        }
        const selectedUsers = users.filter((user, idx) => usersChecked[idx]);
        const userIds = selectedUsers.map((user) => user.id);
        if (userIds.length < 6) {
            Alert.alert("Error", "You must select at least 6 users");
            return;
        }
        setProcessing(true);
        supabase
            .rpc("assign_rounds", {
                competition_id_arg: compId,
                user_ids: userIds,
                number_of_rounds: nRounds,
                number_of_rounds_in_shift: nShiftRounds,
            })
            .then(({ data, error }) => {
                setProcessing(false);
                if (error) {
                    console.error(error);
                    Alert.alert("Error", "Failed to auto-assign rounds");
                } else {
                    Alert.alert("Success", "Successfully auto-assigned rounds");
                    setVisible(false);
                }
            });
    };

    return (
        <>
            <StandardModal title={"Auto-Assign rounds"} visible={visible}>
                {processing && (
                    <View style={s.spinner}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
                <Text style={s.label}>Select users that will scout:</Text>
                <ScrollView style={s.userlist}>
                    {users.map((user, idx) => (
                        <View key={user.id} style={s.user}>
                            <View style={{ flex: 1 }}>
                                <BouncyCheckbox
                                    key={usersKey}
                                    onClick={() => {
                                        let newUsersChecked = usersChecked;
                                        newUsersChecked[idx] = !newUsersChecked[idx];
                                        setUsersChecked(newUsersChecked);
                                        console.log(usersChecked);
                                        setUsersKey(usersKey + 1);
                                    }}
                                    isChecked={usersChecked[idx]}
                                    bounceEffectIn={1}
                                    bounceEffectOut={1}
                                    style={{
                                        marginRight: "6%",
                                    }}
                                    textStyle={{
                                        textDecorationLine: "none",
                                    }}
                                    iconStyle={{
                                        borderRadius: 3,
                                    }}
                                    fillColor={colors.text}
                                    innerIconStyle={{ borderRadius: 3 }}
                                />
                            </View>
                            <Text style={s.user_name}>{user.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text style={s.label}>Number of rounds:</Text>
                <NumberInput
                    onInput={setNRounds}
                    value={nRounds}
                    min={1}
                    style={s.numinput}
                    placeholder="Number of rounds"
                />

                <Text style={s.label}>Number of rounds in a shift:</Text>
                <NumberInput
                    onInput={setNShiftRounds}
                    value={nShiftRounds}
                    min={1}
                    style={s.numinput}
                    placeholder="Number of rounds in a shift:"
                />

                <View style={s.button_row}>
                    <StandardButton
                        color={colors.primary}
                        onPress={() => setVisible(false)}
                        text={"Cancel"}
                        width={"40%"}
                    />
                    <StandardButton color={"#29a329"} onPress={() => onSubmit()} text={"Submit"} width={"40%"} />
                </View>
            </StandardModal>
        </>
    );
}

const styles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        spinner: {
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
        },
        label: {
            color: colors.text,
        },
        numinput: {
            height: 40,
            width: "100%",
            margin: 5,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            color: colors.text,
            borderColor: colors.text,
        },
        userlist: {
            maxHeight: "50%",
            width: "100%",
        },
        user: {
            flexDirection: "row",
            alignItems: "center",
        },
        user_name: {
            flex: 8,
            color: colors.text,
        },
        button_row: { flexDirection: "row", justifyContent: "space-evenly" },
    })
);
