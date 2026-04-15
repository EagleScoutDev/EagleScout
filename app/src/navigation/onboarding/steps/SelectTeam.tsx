import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { styles as sharedStyles } from "../styles";
import { type TBATeam, TBATeams } from "@/lib/database/TBATeams";
import type { OnboardingScreenProps } from "@/navigation/onboarding";
import { UIText } from "@/ui/components/UIText";
import { onboardingMutations } from "@/lib/mutations/onboarding";
import { authMutations } from "@/lib/mutations/auth";

export interface SelectTeamProps extends OnboardingScreenProps<"SelectTeam"> {}
export function SelectTeam({ navigation }: SelectTeamProps) {
    const [team, setTeam] = useState("");
    const [queriedTeams, setQueriedTeams] = useState<TBATeam[]>([]);
    const { mutate: registerTeam } = useMutation(onboardingMutations.registerUserWithOrganization);
    const { mutateAsync: signOut } = useMutation(authMutations.signOut);

    useEffect(() => {
        (async () => {
            const teams = await TBATeams.searchTeams(team);
            setQueriedTeams(teams);
        })();
    }, [team]);

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
                                onPress={() => {
                                    registerTeam(
                                        { teamNumber: item.number },
                                        {
                                            onSuccess: async (data) => {
                                                if (data === "team-exists") {
                                                    await signOut();
                                                    Alert.alert(
                                                        "Sign up complete!",
                                                        "You have completed sign up. You will be able to log in when one of the team's captains approve you.",
                                                    );
                                                    navigation.navigate("Login");
                                                } else {
                                                    navigation.navigate("EnterTeamEmail");
                                                }
                                            },
                                            onError: (error: any) => {
                                                console.error(error);
                                                Alert.alert(
                                                    "Error registering with team",
                                                    "Unable to register you with the team provided. Please try again later.",
                                                );
                                            },
                                        },
                                    );
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
