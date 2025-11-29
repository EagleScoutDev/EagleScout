import { useState } from "react";
import { UIText } from "../../ui/UIText";
import { Keyboard, SafeAreaView, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { styles } from "./styles";
import { StandardButton } from "../../ui/StandardButton";
import { MinimalSectionHeader } from "../../ui/MinimalSectionHeader";
import type { OnboardingScreenProps } from ".";

export interface LoginProps extends OnboardingScreenProps<"Login"> {
    onSubmit: (username: string, password: string) => void;
    error: string;
}
export function LoginForm({ navigation, onSubmit, error }: LoginProps) {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    const { colors } = useTheme();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.background}>
                {error !== "" && (
                    <View style={styles.error}>
                        <UIText style={styles.error_text}>{error}</UIText>
                    </View>
                )}
                <UIText style={styles.titleText}>Log In</UIText>
                <>
                    <View>
                        <MinimalSectionHeader title={"Email"} />
                        <TextInput
                            autoCapitalize={"none"}
                            onChangeText={(text) => setUsername(text)}
                            value={username}
                            placeholder="john.doe@team114.org"
                            placeholderTextColor={"gray"}
                            style={{
                                ...styles.input,
                                borderColor:
                                    error === "auth/missing-email" ||
                                    error === "auth/invalid-email" ||
                                    error === "auth/internal-error"
                                        ? "red"
                                        : "gray",
                            }}
                            inputMode={"email"}
                        />
                        <View style={{ height: 30 }} />
                        <MinimalSectionHeader title={"Password"} />
                        <TextInput
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            placeholder={"Password"}
                            placeholderTextColor={"gray"}
                            style={{
                                ...styles.input,
                                borderColor:
                                    error === "auth/internal-error" || error === "auth/wrong-password" ? "red" : "gray",
                            }}
                            secureTextEntry={true}
                        />
                        <StandardButton
                            text={"Log In"}
                            textColor={username === "" || password === "" ? "dimgray" : colors.primary}
                            disabled={username === "" || password === ""}
                            onPress={() => onSubmit(username, password)}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.link_container}
                        onPress={() => {
                            navigation.navigate("Login");
                            setUsername("");
                            setPassword("");
                        }}
                    >
                        <UIText style={styles.text}>Reset Password</UIText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.link_container}
                        onPress={() => {
                            navigation.navigate("Signup");
                            setUsername("");
                            setPassword("");
                        }}
                    >
                        <UIText style={styles.text}>Create Account</UIText>
                    </TouchableOpacity>
                </>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
