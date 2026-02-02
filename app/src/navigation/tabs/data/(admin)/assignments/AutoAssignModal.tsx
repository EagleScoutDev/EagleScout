import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { NumberInput } from "@/ui/components/NumberInput";
import { supabase } from "@/lib/supabase";
import type { Setter } from "@/lib/util/react/types";
import { exMemo } from "@/lib/util/react/memo";
import { StandardButton } from "@/ui/StandardButton";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIModal } from "@/ui/components/UIModal";
import { UIText } from "@/ui/components/UIText";
import { UICheckbox } from "@/ui/components/UICheckbox";
import type { Theme } from "@/ui/lib/theme";

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
            Alert.alert(
                "Error",
                "Number of rounds must be greater than or equal to number of rounds in a shift",
            );
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
            <UIModal title={"Auto-Assign rounds"} visible={visible}>
                {processing && (
                    <View style={s.spinner}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
                <UIText>Select users that will scout:</UIText>
                <ScrollView style={s.userlist}>
                    {users.map((user, idx) => (
                        <View key={user.id} style={s.user}>
                            <UICheckbox
                                key={usersKey}
                                value={usersChecked[idx]}
                                onInput={(value) => {
                                    let newUsersChecked = usersChecked;
                                    newUsersChecked[idx] = !newUsersChecked[idx];
                                    setUsersChecked(newUsersChecked);
                                    setUsersKey(usersKey + 1);
                                }}
                            />
                            <UIText style={{ marginLeft: "auto" }}>{user.name}</UIText>
                        </View>
                    ))}
                </ScrollView>

                <UIText>Number of rounds:</UIText>
                <NumberInput
                    onInput={(x) => x !== null && (setNRounds(x), true)}
                    value={nRounds}
                    min={1}
                    style={s.numinput}
                    placeholder="Number of rounds"
                />

                <UIText>Number of rounds in a shift:</UIText>
                <NumberInput
                    onInput={(x) => x !== null && (setNRounds(x), true)}
                    value={nShiftRounds}
                    min={1}
                    style={s.numinput}
                    placeholder="Number of rounds in a shift:"
                />

                <View style={s.button_row}>
                    <StandardButton
                        color={colors.primary.hex}
                        onPress={() => setVisible(false)}
                        text={"Cancel"}
                        width={"40%"}
                    />
                    <StandardButton
                        color={"#29a329"}
                        onPress={() => onSubmit()}
                        text={"Submit"}
                        width={"40%"}
                    />
                </View>
            </UIModal>
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
        numinput: {
            height: 40,
            width: "100%",
            margin: 5,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            color: colors.fg.hex,
            borderColor: colors.fg.hex,
        },
        userlist: {
            maxHeight: "50%",
            width: "100%",
        },
        user: {
            flexDirection: "row",
            alignItems: "center",
        },
        button_row: { flexDirection: "row", justifyContent: "space-evenly" },
    }),
);
