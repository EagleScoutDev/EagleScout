import {
    Alert,
    Keyboard,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { UIText } from "../../ui/UIText";
import { useMemo, useState } from "react";

import { styles } from "./styles";
import { supabase } from "../../lib/supabase";
import { MinimalSectionHeader } from "../../ui/MinimalSectionHeader";
import { StandardButton } from "../../ui/StandardButton";
import { type OnboardingScreenProps } from ".";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface SignupProps extends OnboardingScreenProps<"Signup"> {}
export function Signup({ navigation }: SignupProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const formComplete = useMemo(
        () => email !== "" || password !== "" || confirmPassword !== "",
        [email, password, confirmPassword]
    );

    const { colors } = useTheme();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.background}>
                <UIText style={styles.titleText}>Sign Up</UIText>
                <View>
                    <View>
                        <MinimalSectionHeader title="Email" />
                        <TextInput
                            inputMode="email"
                            autoCapitalize="none"
                            onChangeText={setEmail}
                            value={email}
                            placeholder="john.doe@team114.org"
                            placeholderTextColor="gray"
                            style={styles.input}
                        />
                        <View style={{ height: 30 }} />
                        <MinimalSectionHeader title="Password" />
                        <TextInput
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Password"
                            placeholderTextColor="gray"
                            style={styles.input}
                        />
                        <MinimalSectionHeader title={"Confirm Password"} />
                        <TextInput
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            placeholderTextColor="gray"
                            style={styles.input}
                        />

                        <StandardButton
                            text="Register"
                            textColor={formComplete ? "dimgray" : colors.primary.hex}
                            disabled={!formComplete}
                            onPress={async () => {
                                if (password !== confirmPassword) {
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
                                    return;
                                }

                                const { error } = await supabase.auth.signUp({
                                    email: email,
                                    password: password,
                                    options: {
                                        emailRedirectTo: "eaglescout://confirm-signup",
                                    },
                                });
                                if (error) {
                                    console.error(error);
                                    Alert.alert("Error signing up", error.toString());
                                } else {
                                    Alert.alert(
                                        "Success!",
                                        "You received an email to confirm your account. Please follow the instructions in the email for next steps."
                                    );
                                    navigation.navigate("Login");
                                }
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.link_container}
                        onPress={() => {
                            navigation.navigate("Login");
                            setEmail("");
                            setPassword("");
                        }}
                    >
                        <UIText style={styles.text}>Log In</UIText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
