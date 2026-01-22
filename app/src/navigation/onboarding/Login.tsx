import { useState } from "react";
import { TextInput, View } from "react-native";
import { styles } from "./styles";
import type { OnboardingScreenProps } from ".";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { MinimalSectionHeader } from "@/ui/MinimalSectionHeader";
import { StandardButton } from "@/ui/StandardButton";
import { PressableOpacity } from "@/components/PressableOpacity";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export interface LoginProps extends OnboardingScreenProps<"Login"> {
    onSubmit: (username: string, password: string) => void;
    error: string | null;
}
export function LoginForm({ navigation, onSubmit, error }: LoginProps) {
    const { colors } = useTheme();

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.background}>
                {error !== null && (
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
                            textColor={username === "" || password === "" ? "dimgray" : colors.primary.hex}
                            disabled={username === "" || password === ""}
                            onPress={() => onSubmit(username, password)}
                        />
                    </View>
                    <PressableOpacity
                        style={styles.link_container}
                        onPress={() => {
                            navigation.navigate("ResetPassword");
                            setUsername("");
                            setPassword("");
                        }}
                    >
                        <UIText style={styles.text}>Reset Password</UIText>
                    </PressableOpacity>
                    <PressableOpacity
                        style={styles.link_container}
                        onPress={() => {
                            navigation.navigate("Signup");
                            setUsername("");
                            setPassword("");
                        }}
                    >
                        <UIText style={styles.text}>Create Account</UIText>
                    </PressableOpacity>
                </>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
