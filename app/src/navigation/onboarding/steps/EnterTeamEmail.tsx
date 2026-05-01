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
import { supabase } from "@/lib/supabase";
import { type OnboardingScreenProps } from "..";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { MinimalSectionHeader } from "@/ui/MinimalSectionHeader";
import { StandardButton } from "@/ui/StandardButton";
import { useUserStore } from "@/lib/stores/user";
import { Account } from "@/lib/db/account";

interface EnterTeamEmailProps extends OnboardingScreenProps<"EnterTeamEmail"> {}
export function EnterTeamEmail({ navigation }: EnterTeamEmailProps) {
    const { colors } = useTheme();
    const [email, setEmail] = useState<string>("");
    const userAttribute = useUserStore((state) => state.account);
    const orgId = userAttribute?.orgId ?? null;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.background}>
                <View>
                    <UIText style={styles.titleText}>Enter Team Email</UIText>
                    <View>
                        <MinimalSectionHeader title="Team Email" />
                        <TextInput
                            onChangeText={setEmail}
                            value={email}
                            placeholder="dev@team114.org"
                            placeholderTextColor="gray"
                            style={styles.input}
                        />
                    </View>
                    <StandardButton
                        text={"Next"}
                        textColor={email === "" ? "dimgray" : colors.primary.hex}
                        disabled={email === ""}
                        onPress={async () => {
                            const { error: orgEmailError } = await supabase
                                .from("organizations")
                                .update({
                                    email,
                                })
                                .eq("id", orgId);
                            if (orgEmailError) {
                                console.error(orgEmailError);
                                Alert.alert(
                                    "Error setting team email",
                                    "Unable to set team email. Please try again later.",
                                );
                            }
                            // FIXME: don't do a full resync
                            await useUserStore.getState().sync();
                            const currentUser =
                                await Account.ensure();
                            const { error: userAdminError } = await supabase
                                .from("user_attributes")
                                .update({
                                    scouter: true,
                                    admin: true,
                                })
                                .eq("id", currentUser.id);
                            if (userAdminError) {
                                console.error(userAdminError);
                                Alert.alert(
                                    "Error making you an admin",
                                    "Unable to make you an admin. Please try again later.",
                                );
                            }
                            // todo: navigate to home screen, without requiring another login
                            navigation.navigate("Login");
                            Alert.alert(
                                "Success!",
                                "Please log in again to start using Eaglescout",
                            );
                        }}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
