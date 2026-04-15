import { useState } from "react";
import {
    Alert,
    Keyboard,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { type OnboardingScreenProps } from ".";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { MinimalSectionHeader } from "@/ui/MinimalSectionHeader";
import { StandardButton } from "@/ui/StandardButton";
import { useMutation } from "@tanstack/react-query";
import { authMutations } from "@/lib/mutations/auth";

export interface ResetPasswordProps extends OnboardingScreenProps<"ResetPassword"> {}
export function ResetPassword({ navigation }: ResetPasswordProps) {
    const { colors } = useTheme();
    const [email, setEmail] = useState("");
    const { mutateAsync: resetPassword, isPending } = useMutation(authMutations.resetPassword);

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
                            isLoading={isPending}
                            onPress={async () => {
                                if (email === "") {
                                    Alert.alert("Email cannot be blank.", "Please try again", [{ text: "OK" }], { cancelable: false });
                                    return;
                                }
                                try {
                                    await resetPassword({ email });
                                    Alert.alert("Password reset email sent", "Please check your email", [{ text: "OK" }], { cancelable: false });
                                } catch (error: any) {
                                    console.error("Error resetting password:", error);
                                    Alert.alert("Error resetting password", "Please try again", [{ text: "OK" }], { cancelable: false });
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
