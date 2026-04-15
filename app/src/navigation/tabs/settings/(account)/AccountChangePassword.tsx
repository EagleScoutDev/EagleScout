import { Alert } from "react-native";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authMutations } from "@/lib/mutations/auth";
import { type SettingsTabScreenProps } from "../index";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UIForm } from "@/ui/components/UIForm";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";

export interface AccountChangePasswordProps extends SettingsTabScreenProps<"Account/ChangePassword"> {}
export function AccountChangePassword({ navigation }: AccountChangePasswordProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { mutate: updatePassword, isPending } = useMutation(authMutations.updatePassword);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <UIForm>
                    <UIForm.Section>
                        <UIForm.TextInput
                            label="New Password"
                            secure
                            value={newPassword}
                            onChange={(x) => setNewPassword(x.trim())}
                        />
                        <UIForm.TextInput
                            label="Confirm New Password"
                            secure
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />
                    </UIForm.Section>
                    <UIButton
                        text={"Save"}
                        style={UIButtonStyle.fill}
                        size={UIButtonSize.xl}
                        loading={isPending}
                        onPress={async () => {
                            if (newPassword === "" || confirmPassword === "") {
                                return Alert.alert("Error", "New password cannot be blank.");
                            }
                            if (newPassword !== confirmPassword) {
                                return Alert.alert("Error", "Passwords do not match");
                            }

                            updatePassword(
                                { password: newPassword },
                                {
                                    onSuccess: () => {
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        Alert.alert("Success", "Your password has been updated!");
                                        navigation.goBack();
                                    },
                                    onError: (error: any) => {
                                        console.log(error);
                                        if (error.code === "same_password") {
                                            Alert.alert(
                                                "Error",
                                                "Your entered password was the same as the current one.",
                                            );
                                        } else {
                                            Alert.alert("Error", "An error occurred, please try again.");
                                        }
                                    },
                                },
                            );
                        }}
                    />
                </UIForm>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
