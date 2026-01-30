import { useState } from "react";
import { Alert, Keyboard, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { supabase } from "@/lib/supabase";
import { type OnboardingScreenProps } from ".";
import { UIText } from "@/ui/components/UIText";
import { useTheme } from "@/ui/context/ThemeContext";
import { MinimalSectionHeader } from "@/ui/MinimalSectionHeader";
import { StandardButton } from "@/ui/StandardButton";

export interface SetNewPasswordProps extends OnboardingScreenProps<"SetNewPassword"> {}

export function SetNewPassword({ navigation }: SetNewPasswordProps) {
    const { colors } = useTheme();
    const [password, setPassword] = useState("");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.background}>
                <UIText style={styles.titleText}>Set New Password</UIText>
                <>
                    <View>
                        <MinimalSectionHeader title={"New Password"} />
                        <TextInput
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            placeholder={"Password"}
                            placeholderTextColor={"gray"}
                            style={{
                                ...styles.input,
                                borderColor: password === "" ? "gray" : colors.primary.hex,
                            }}
                            secureTextEntry={true}
                        />
                        <StandardButton
                            text={"Set New Password"}
                            textColor={password === "" ? "dimgray" : colors.primary.hex}
                            disabled={password === ""}
                            onPress={async () => {
                                if (password === "") {
                                    Alert.alert(
                                        "Password cannot be blank.",
                                        "Please try again",
                                        [
                                            {
                                                text: "OK",
                                                onPress: () => console.log("OK Pressed"),
                                            },
                                        ],
                                        { cancelable: false },
                                    );
                                    return;
                                }
                                const { error } = await supabase.auth.updateUser({
                                    password,
                                });
                                if (error) {
                                    Alert.alert(
                                        "Error resetting password",
                                        "Please try again",
                                        [
                                            {
                                                text: "OK",
                                                onPress: () => console.log("OK Pressed"),
                                            },
                                        ],
                                        { cancelable: false },
                                    );
                                } else {
                                    Alert.alert(
                                        "Successfully reset password",
                                        "Please log in again to continue",
                                        [
                                            {
                                                text: "OK",
                                                onPress: () => {
                                                    supabase.auth.signOut();
                                                    navigation.navigate("Login");
                                                    setPassword("");
                                                },
                                            },
                                        ],
                                        { cancelable: false },
                                    );
                                }
                            }}
                        />
                    </View>
                </>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
