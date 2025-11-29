import { useState } from "react";
import { UIText } from "../../../ui/UIText";
import { Alert, Keyboard, SafeAreaView, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { styles } from "../styles";
import { MinimalSectionHeader } from "../../../ui/MinimalSectionHeader";
import { StandardButton } from "../../../ui/StandardButton";
import { supabase } from "../../../lib/supabase";
import type { OnboardingScreenProps } from "..";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

interface EnterUserInfoProps extends OnboardingScreenProps<"EnterUserInfo"> {}
export function EnterUserInfo({ navigation }: EnterUserInfoProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const { colors } = useTheme();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.background}>
                <View>
                    <UIText style={styles.titleText}>Set Up Your Account</UIText>
                    <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <View>
                            <MinimalSectionHeader title="First Name" />
                            <TextInput
                                onChangeText={setFirstName}
                                value={firstName}
                                placeholder="First Name"
                                placeholderTextColor="gray"
                                style={styles.input}
                            />
                        </View>
                        <View>
                            <MinimalSectionHeader title="Last Name" />
                            <TextInput
                                onChangeText={setLastName}
                                value={lastName}
                                placeholder="Last Name"
                                placeholderTextColor="gray"
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <StandardButton
                        text={"Next"}
                        textColor={firstName === "" || lastName === "" ? "dimgray" : colors.primary.hex}
                        disabled={firstName === "" || lastName === ""}
                        onPress={async () => {
                            const {
                                data: { user },
                            } = await supabase.auth.getUser();
                            if (!user) {
                                console.error("No user found");
                                Alert.alert(
                                    "Error setting profile",
                                    "Unable to set profile information. Please try logging in again."
                                );
                                return;
                            }
                            const { error: profilesSetError } = await supabase
                                .from("profiles")
                                .update({
                                    first_name: firstName,
                                    last_name: lastName,
                                })
                                .eq("id", user.id);
                            if (profilesSetError) {
                                console.error(profilesSetError);
                                Alert.alert(
                                    "Error setting profile",
                                    "Unable to set profile information. Please try logging in again."
                                );
                            }
                            navigation.navigate("SelectTeam");
                        }}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
