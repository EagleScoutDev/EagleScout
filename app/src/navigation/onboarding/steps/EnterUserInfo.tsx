import { useState } from "react";
import {
    Alert,
    Keyboard,
    SafeAreaView,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { styles } from "../styles";
import type { OnboardingScreenProps } from "..";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { MinimalSectionHeader } from "@/ui/MinimalSectionHeader";
import { StandardButton } from "@/ui/StandardButton";
import { useMutation } from "@tanstack/react-query";
import { profileMutations } from "@/lib/mutations/profiles";

interface EnterUserInfoProps extends OnboardingScreenProps<"EnterUserInfo"> {}
export function EnterUserInfo({ navigation }: EnterUserInfoProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const { colors } = useTheme();
    const { mutateAsync: updateProfile, isPending } = useMutation(profileMutations.updateProfile);

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
                        textColor={
                            firstName === "" || lastName === "" ? "dimgray" : colors.primary.hex
                        }
                        disabled={firstName === "" || lastName === ""}
                        isLoading={isPending}
                        onPress={async () => {
                            try {
                                await updateProfile({ firstName, lastName });
                                navigation.navigate("SelectTeam");
                            } catch (error: any) {
                                console.error(error);
                                Alert.alert(
                                    "Error setting profile",
                                    "Unable to set profile information. Please try logging in again.",
                                );
                            }
                        }}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
