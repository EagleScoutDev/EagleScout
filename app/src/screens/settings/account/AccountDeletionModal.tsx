import { Alert, StyleSheet, TextInput, View } from "react-native";
import { UIText } from "../../../ui/UIText";
import { useState } from "react";

import { UIRadio } from "../../../ui/input/UIRadio";
import { MinimalSectionHeader } from "../../../ui/MinimalSectionHeader";
import { StandardButton } from "../../../ui/StandardButton";
import { supabase } from "../../../lib/supabase";
import { type SettingsMenuScreenProps } from "../SettingsMenu";
import { useUserStore } from "../../../lib/stores/user";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

export interface AccountDeletionModalProps extends SettingsMenuScreenProps<"Account/Delete"> {}
export function AccountDeletionModal({ navigation }: AccountDeletionModalProps) {
    const [password, setPassword] = useState("");
    const [reason, setReason] = useState("");
    const { colors } = useTheme();

    const { logout } = useUserStore();

    const styles = StyleSheet.create({
        text_input: {
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: "100%",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            color: colors.fg.hex,
        },
        button_row: { flexDirection: "row", justifyContent: "space-evenly" },
    });

    return (
        <View>
            <View
                style={{
                    width: "80%",
                    alignSelf: "center",
                    marginTop: "5%",
                    display: "flex",
                    gap: 10,
                }}
            >
                <UIText size={25}>We are sorry to see you go!</UIText>
                <View style={{ width: "100%", paddingBottom: 10 }}>
                    <UIText>Please let us know why you are leaving:</UIText>
                    <UIRadio
                        required={true}
                        onInput={setReason}
                        value={reason}
                        options={["Graduating from team", "Leaving team", "Concerns over data usage", "Other"]}
                    />
                </View>
                <UIText>Please enter your account password to confirm deletion.</UIText>
                <View style={{ width: "100%" }}>
                    <MinimalSectionHeader title={"Password"} />
                    <TextInput
                        style={styles.text_input}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                    <UIText
                        level={1}
                        style={{ alignSelf: "center", textAlign: "center", marginTop: -5, marginBottom: 10 }}
                    >
                        Notice: If your password is inputted incorrectly, your account will not be deleted and you will
                        be signed out!
                    </UIText>
                </View>
            </View>
            <StandardButton
                color={colors.danger.hex}
                onPress={async () => {
                    Alert.alert("Are you sure?", "This action is irreversible.", [
                        {
                            text: "Cancel",
                            onPress: () => {
                                setPassword("");
                                setReason("");
                                navigation.goBack();
                            },
                            style: "cancel",
                        },
                        {
                            text: "Delete",
                            onPress: async () => {
                                const { data: userData, error: getUserError } = await supabase.auth.getUser();
                                if (getUserError) {
                                    Alert.alert("Error getting user", getUserError.message);
                                    return;
                                }
                                const { data, error: authError } = await supabase.auth.signInWithPassword({
                                    email: userData.user?.email || "",
                                    password: password,
                                });
                                if (authError) {
                                    if (authError.status === 400) {
                                        Alert.alert(
                                            "Error",
                                            "Invalid password. Your account has not been deleted. Log in again to request deletion."
                                        );
                                        await logout();
                                        return;
                                    }
                                    Alert.alert("Error checking password", authError.name);
                                    return;
                                }
                                await supabase.auth
                                    .updateUser({
                                        data: {
                                            requested_deletion: true,
                                        },
                                    })
                                    .then(() =>
                                        supabase.from("deletion_requests").insert({
                                            user_id: userData.user?.id,
                                            reason: reason || "No reason given",
                                            processed: false,
                                        })
                                    )
                                    .then(() => logout())
                                    .finally(() => Alert.alert("Success", "Account delete requested."));
                            },
                        },
                    ]);
                }}
                text={"Delete Account"}
                width={"60%"}
            />
            <UIText level={1} style={{ alignSelf: "center", textAlign: "center", marginTop: 10 }}>
                Account deletion requests may take up to 30 days to process.
            </UIText>
        </View>
    );
}
