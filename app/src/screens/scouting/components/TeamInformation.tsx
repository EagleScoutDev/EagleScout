import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import type { Setter } from "../../../lib/react/util/types";

export interface TeamInformationProps {
    team: string;
    setTeam: Setter<string>;
}
export function TeamInformation({ team, setTeam }: TeamInformationProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        textInput: {
            borderColor: "gray",
            borderBottomWidth: 2,
            padding: 10,
            color: colors.text,
            fontFamily: "monospace",
            minWidth: "20%",
            textAlign: "center",
        },
        badInput: {
            borderColor: colors.notification,
            borderBottomWidth: 2,
            padding: 10,
            color: colors.notification,
            fontFamily: "monospace",
            minWidth: "20%",
            textAlign: "center",
        },
        subtitle: {
            textAlign: "left",
            padding: "2%",
            color: colors.text,
            opacity: 0.6,
            fontWeight: "bold",
        },
        label: {
            color: colors.text,
            textAlign: "left",
            fontWeight: "bold",
            fontSize: 16,
        },
        box: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginVertical: "3%",
        },
        container: {
            width: "100%",
            flexDirection: "column",
            backgroundColor: colors.card,
            padding: "2%",
            borderRadius: 10,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>TEAM INFORMATION</Text>
            <View style={styles.box}>
                <Text style={styles.label}>Team Number</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={"000"}
                    placeholderTextColor={"gray"}
                    maxLength={7}
                    value={team}
                    onChangeText={(text) => setTeam(text)}
                    keyboardType={"numeric"}
                />
            </View>
        </View>
    );
}
