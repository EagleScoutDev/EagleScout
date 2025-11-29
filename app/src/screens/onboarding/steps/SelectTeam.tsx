import { useEffect, useState } from "react";
import { UIText } from "../../../ui/UIText";
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
import { styles as sharedStyles } from "../styles";
import { type TBATeam, TBATeams } from "../../../database/TBATeams";
import { supabase } from "../../../lib/supabase";
import type { OnboardingScreenProps } from "..";

export interface SelectTeamProps extends OnboardingScreenProps<"SelectTeam"> {}
export function SelectTeam({ navigation }: SelectTeamProps) {
    const [team, setTeam] = useState("");
    const [queriedTeams, setQueriedTeams] = useState<TBATeam[]>([]);

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
                                onPress={async () => {
                                    const { data, error } = await supabase.rpc("register_user_with_organization", {
                                        team_number: item.number,
                                    });
                                    if (error) {
                                        console.error(error);
                                        Alert.alert(
                                            "Error registering with team",
                                            "Unable to register you with the team provided. Please try again later."
                                        );
                                    } else {
                                        if (data === "team-exists") {
                                            await supabase.auth.signOut();
                                            Alert.alert(
                                                "Sign up complete!",
                                                "You have completed sign up. You will be able to log in when one of the team's captains approve you."
                                            );
                                            navigation.navigate("Login");
                                        } else {
                                            navigation.navigate("EnterTeamEmail");
                                        }
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
