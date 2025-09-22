import { Alert, StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { MinimalSectionHeader } from "../../../components/MinimalSectionHeader";
import { StandardButton } from "../../../components/StandardButton";
import { supabase } from "../../../lib/supabase";
import { type SettingsMenuScreenProps } from "../SettingsMenu";

export interface AccountChangePasswordProps extends SettingsMenuScreenProps<"Account/ChangePassword"> {}
export function AccountChangePassword({ navigation }: AccountChangePasswordProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        text_input: {
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: "100%",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            color: colors.text,
        },
        button_row: { flexDirection: "row", justifyContent: "space-evenly" },
    });

    return (
        <View>
            <View style={{ width: "80%", alignSelf: "center", marginTop: "5%" }}>
                <MinimalSectionHeader title={"New Password"} />
                <TextInput
                    style={styles.text_input}
                    // placeholder="New Password"
                    onChangeText={(text) => setNewPassword(text)}
                    value={newPassword}
                    secureTextEntry={true}
                />
                <MinimalSectionHeader title={"Confirm New Password"} />
                <TextInput
                    style={styles.text_input}
                    // placeholder="Confirm New Password"
                    onChangeText={(text) => setConfirmNewPassword(text)}
                    value={confirmNewPassword}
                    secureTextEntry={true}
                />
            </View>
            <StandardButton
                isLoading={false}
                color={newPassword !== confirmNewPassword || newPassword === "" ? "grey" : colors.primary}
                onPress={async () => {
                    if (newPassword === "" || confirmNewPassword === "") {
                        console.log("New password cannot be blank.");
                        Alert.alert(
                            "New password cannot be blank.",
                            "Please try again",
                            [
                                {
                                    text: "OK",
                                    onPress: () => console.log("OK Pressed"),
                                },
                            ],
                            { cancelable: false }
                        );
                        return;
                    }
                    if (newPassword === confirmNewPassword) {
                        supabase.auth.updateUser({ password: newPassword }).then(({ error }) => {
                            if (error) {
                                Alert.alert(
                                    "Error",
                                    error.message,
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => console.log("OK Pressed"),
                                        },
                                    ],
                                    { cancelable: false }
                                );
                            } else {
                                setNewPassword("");
                                setConfirmNewPassword("");
                                Alert.alert(
                                    "Password Updated",
                                    "Your password has been updated!",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => console.log("OK Pressed"),
                                        },
                                    ],
                                    { cancelable: false }
                                );
                                navigation.goBack();
                            }
                        });
                    } else {
                        console.log("Passwords do not match");
                        Alert.alert(
                            "Passwords do not match",
                            "Please try again",
                            [
                                {
                                    text: "OK",
                                    onPress: () => console.log("OK Pressed"),
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                }}
                text={"Save"}
                width={"60%"}
            />
        </View>
    );
}
