import { StyleSheet, View } from "react-native";
import { UIText } from "../../ui/UIText";
import { useTheme } from "@react-navigation/native";
import { StandardButton } from "../../ui/StandardButton";
import type { OnboardingScreenProps } from ".";

export interface EntrypointProps extends OnboardingScreenProps<"Entrypoint"> {}
export function EntrypointHome({ navigation }: EntrypointProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgb(0,0,25)",
        },
        title: {
            color: "rgb(191, 219, 247)",
            fontSize: 40,
            fontWeight: "bold",
        },
        subtitle: {
            color: "gray",
            fontSize: 20,
            fontWeight: "bold",
        },
    });

    return (
        <View style={styles.container}>
            {/*    logo*/}
            <View style={{ alignItems: "center", flex: 0.5 }}>
                <UIText style={styles.title}>Eaglescout</UIText>
                <UIText style={styles.subtitle}>The future of scouting is now.</UIText>
            </View>
            <View style={{ width: "100%", position: "absolute", bottom: "10%" }}>
                <StandardButton
                    textColor={"white"}
                    color={"rgb(0,0,25)"}
                    isLoading={false}
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                    text={"Login"}
                />
                <StandardButton
                    textColor={colors.primary}
                    color={"rgb(0,0,25)"}
                    isLoading={false}
                    onPress={() => {
                        navigation.navigate("Signup");
                    }}
                    text={"Sign Up"}
                />
            </View>
        </View>
    );
}
