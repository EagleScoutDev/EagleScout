import { useState } from "react";
import { UIText } from "../../ui/UIText";
import {
    Alert,
    Keyboard,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { styles } from "./styles";
import { StandardButton } from "../../ui/StandardButton";
import { MinimalSectionHeader } from "../../ui/MinimalSectionHeader";
import { supabase } from "../../lib/supabase";
import { type OnboardingScreenProps } from ".";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface ResetPasswordProps extends OnboardingScreenProps<"ResetPassword"> {}
export function ResetPassword({ navigation }: ResetPasswordProps) {
    const { colors } = useTheme();
    const [email, setEmail] = useState("");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.background}>
                <UIText style={styles.titleText}>Reset Password</UIText>
                <>
                    <View>
                        <MinimalSectionHeader title={"Email"} />
                        <TextInput
                            autoCapitalize={"none"}
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="john.doe@team114.org"
                            placeholderTextColor={"gray"}
                            style={{
                                ...styles.input,
                                borderColor: email === "" ? "gray" : colors.primary.hex,
                            }}
                            inputMode={"email"}
                        />
                        <StandardButton
                            text={"Reset Password"}
                            textColor={email === "" ? "dimgray" : colors.primary.hex}
                            disabled={email === ""}
                            onPress={async () => {
                                if (email === "") {
                                    console.log("Email cannot be blank.");
                                    Alert.alert(
                                        "Email cannot be blank.",
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
                                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                    redirectTo: "eaglescout://forgot-password",
                                });
                                if (error) {
                                    console.log("Error resetting password:", error);
                                    Alert.alert(
                                        "Error resetting password",
                                        "Please try again",
                                        [
                                            {
                                                text: "OK",
                                                onPress: () => console.log("OK Pressed"),
                                            },
                                        ],
                                        { cancelable: false }
                                    );
                                } else {
                                    console.log("Password reset email sent");
                                    Alert.alert(
                                        "Password reset email sent",
                                        "Please check your email",
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
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.link_container}
                        onPress={() => {
                            navigation.navigate("Login");
                            setEmail("");
                        }}
                    >
                        <UIText style={styles.text}>Log In</UIText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.link_container}
                        onPress={() => {
                            navigation.navigate("Signup");
                            setEmail("");
                        }}
                    >
                        <UIText style={styles.text}>Create Account</UIText>
                    </TouchableOpacity>
                </>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
