import { useState } from "react";
import {
    FlatList,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { styles as sharedStyles } from "../styles";
import type { OnboardingScreenProps } from "@/navigation/onboarding";
import { UIText } from "@/ui/components/UIText";
import { onboardingMutations } from "@/lib/mutations/onboarding";
import { authMutations } from "@/lib/mutations/session";
import { queries } from "@/lib/queries";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";

export interface SelectTeamProps extends OnboardingScreenProps<"SelectTeam"> { }
export function SelectTeam({ navigation }: SelectTeamProps) {
    const [team, setTeam] = useState("");
    const { data: queriedTeams = [] } = useQuery({
        ...queries.tbaTeams.search({ query: team }),
        enabled: team.length > 0,
    });
    const registerTeam = useMutation(onboardingMutations.registerUserWithOrganization);
    const signOut = useMutation(authMutations.signOut);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.background}>
                <View style={styles.container}>
                    <UIText style={styles.titleText}>Select Your Team</UIText>
                    <TextInput
                        onChangeText={setTeam}
                        value={team}
                        placeholder="Search"
                        placeholderTextColor="gray"
                        style={styles.input}
                    />
                    <FlatList
                        data={queriedTeams}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        const data = await registerTeam.mutateAsync({ teamNumber: item.number });
                                        if (data === "team-exists") {
                                            await signOut.mutateAsync();
                                            await AsyncAlert.alert(
                                                "Sign up complete!",
                                                "You have completed sign up. You will be able to log in when one of the team's captains approve you.",
                                            );
                                            navigation.navigate("Login");
                                        } else {
                                            navigation.navigate("EnterTeamEmail");
                                        }
                                    } catch (error: any) {
                                        console.error(error);
                                        await AsyncAlert.alert(
                                            "Error registering with team",
                                            "Unable to register you with the team provided. Please try again later.",
                                        );
                                    }
                                }}
                            >
                                <View style={styles.teamContainer}>
                                    <UIText style={styles.teamNumber}>{item.number}</UIText>
                                    <UIText style={styles.teamName}>{item.name}</UIText>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.number.toString()}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    ...sharedStyles,
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    teamContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderBottomWidth: 1,
        borderColor: "gray",
        gap: 10,
    },
    teamNumber: {
        color: "rgb(191, 219, 247)",
        fontSize: 20,
        fontWeight: "bold",
    },
    teamName: {
        color: "gray",
        fontSize: 20,
        fontWeight: "bold",
    },
});
