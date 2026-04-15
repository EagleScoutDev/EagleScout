import { Alert } from "react-native";
import AsyncStorage from "expo-sqlite/kv-store";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { profileMutations } from "@/lib/mutations/profiles";
import { type SettingsTabScreenProps } from "../index";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UIForm } from "@/ui/components/UIForm";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";

export interface AccountEditProfileParams {
    initialFirstName: string;
    initialLastName: string;
}
export interface AccountEditProfileProps extends SettingsTabScreenProps<"Account/EditProfile"> {}
export function AccountEditProfile({ navigation, route }: AccountEditProfileProps) {
    const { initialFirstName, initialLastName } = route.params;
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const { mutate: updateProfile, isPending: loading } = useMutation(
        profileMutations.updateProfile,
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, paddingBottom: 20 }}>
                <UIForm>
                    <UIForm.Section title="Name">
                        <UIForm.TextInput
                            label="First Name"
                            value={firstName}
                            onChange={setFirstName}
                        />
                        <UIForm.TextInput
                            label="Last Name"
                            value={lastName}
                            onChange={setLastName}
                        />
                    </UIForm.Section>
                    <UIButton
                        loading={loading}
                        text={"Save"}
                        style={UIButtonStyle.fill}
                        size={UIButtonSize.xl}
                        onPress={async () => {
                            updateProfile(
                                { firstName, lastName },
                                {
                                    onSuccess: async () => {
                                        await AsyncStorage.setItem(
                                            "user",
                                            JSON.stringify({
                                                ...JSON.parse((await AsyncStorage.getItem("user"))!),
                                                first_name: firstName,
                                                last_name: lastName,
                                            }),
                                        );

                                        setFirstName("");
                                        setLastName("");
                                        navigation.pop();
                                    },
                                    onError: () => {
                                        Alert.alert("Error updating your profile");
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
