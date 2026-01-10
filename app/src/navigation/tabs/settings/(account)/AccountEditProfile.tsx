import { Alert } from "react-native";
import AsyncStorage from "expo-sqlite/kv-store";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
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
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, paddingBottom: 20 }}>
                <UIForm>
                    {UIForm.Section({
                        header: "Name",
                        items: [
                            UIForm.TextInput({
                                label: "First Name",
                                value: firstName,
                                onChange: setFirstName,
                            }),
                            UIForm.TextInput({
                                label: "Last Name",
                                value: lastName,
                                onChange: setLastName,
                            }),
                        ],
                    })}
                    <UIButton
                        loading={loading}
                        text={"Save"}
                        style={UIButtonStyle.fill}
                        size={UIButtonSize.xl}
                        onPress={async () => {
                            setLoading(true);

                            const {
                                data: { user },
                            } = await supabase.auth.getUser();
                            if (user === null) {
                                console.error("User does not exist");
                                return Alert.alert("User does not exist");
                            }

                            let { error } = await supabase
                                .from("profiles")
                                .update({ first_name: firstName, last_name: lastName })
                                .eq("id", user.id);
                            if (error) {
                                console.error(error);
                                return Alert.alert("Error updating your profile");
                            }

                            await AsyncStorage.setItem(
                                "user",
                                JSON.stringify({
                                    ...JSON.parse((await AsyncStorage.getItem("user"))!),
                                    first_name: firstName,
                                    lsat_name: lastName,
                                }),
                            );
                            setLoading(false);

                            setFirstName("");
                            setLastName("");
                            navigation.pop();
                        }}
                    />
                </UIForm>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
