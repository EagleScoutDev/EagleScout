import { Alert } from "react-native";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { type SettingsMenuScreenProps } from "../SettingsMenu";
import { UIForm } from "../../../ui/UIForm.tsx";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton.tsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export interface AccountChangePasswordProps extends SettingsMenuScreenProps<"Account/ChangePassword"> {}
export function AccountChangePassword({ navigation }: AccountChangePasswordProps) {
    "use memo";
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <UIForm>
                    {[
                        UIForm.Section({
                            items: [
                                UIForm.TextInput({
                                    label: "New Password",
                                    secure: true,
                                    value: newPassword,
                                    onChange: (x) => setNewPassword(x.trim()),
                                }),
                                UIForm.TextInput({
                                    label: "Confirm New Password",
                                    secure: true,
                                    value: confirmPassword,
                                    onChange: setConfirmPassword,
                                }),
                            ],
                        }),
                        <UIButton
                            text={"Save"}
                            style={UIButtonStyle.fill}
                            size={UIButtonSize.xl}
                            onPress={async () => {
                                if (newPassword === "" || confirmPassword === "") {
                                    return Alert.alert("Error", "New password cannot be blank.");
                                }
                                if (newPassword !== confirmPassword) {
                                    return Alert.alert("Error", "Passwords do not match");
                                }

                                const { error } = await supabase.auth.updateUser({ password: newPassword });
                                if (error) {
                                    console.log(error);
                                    if (error.code === "same_password") {
                                        Alert.alert("Error", "Your entered password was the same as the current one.");
                                    } else {
                                        Alert.alert("Error", "An error occurred, please try again.");
                                    }
                                    return;
                                }

                                setNewPassword("");
                                setConfirmPassword("");
                                Alert.alert("Success", "Your password has been updated!");
                                navigation.goBack();
                            }}
                        />,
                    ]}
                </UIForm>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
