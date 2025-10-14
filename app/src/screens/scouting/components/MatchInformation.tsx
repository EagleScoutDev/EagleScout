import { type Theme, useTheme } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { NumberInput } from "../../../ui/components/NumberInput.tsx";
import { OrientationChooser } from "../../../components/OrientationChooser.tsx";
import { type Setter } from "../../../lib/react/util/types";
import type { Alliance, Orientation } from "../../../games/common";
import { exMemo } from "../../../lib/react/util/memo.ts";

export interface MatchInformationProps {
    match: number | null;
    setMatch: Setter<number | null>;
    team: number | null;
    setTeam: Setter<number | null>;
    teamsForMatch: number[];

    orientation: Orientation;
    setOrientation: Setter<Orientation>;
    alliance: Alliance;
    setAlliance: Setter<Alliance>;
}
export function MatchInformation({ match, setMatch, team, setTeam, teamsForMatch, orientation, setOrientation, alliance, setAlliance }: MatchInformationProps) {
    const { colors } = useTheme();
    const s = styles(colors);

    return <View style={s.container}>
        <Text style={s.subtitle}>Match Information</Text>
        <View style={s.box}>
            <Text style={s.label}>Match Number</Text>
            <NumberInput
                style={match !== null && (match > 400 || match === 0) ? s.badInput : s.textInput}
                placeholder="000"
                placeholderTextColor="gray"
                max={999}
                value={match}
                onInput={setMatch}
            />
        </View>
        {match !== null && match === 0 && (
            <Text style={{ color: colors.notification, textAlign: "center" }}>Match number cannot be 0</Text>
        )}
        {match !== null && match > 400 && (
            <Text style={{ color: colors.notification, textAlign: "center" }}>
                Match number cannot be greater than 400
            </Text>
        )}

        <View style={s.box}>
            <Text style={s.label}>Team Number</Text>
            <NumberInput
                style={s.textInput}
                placeholder="000"
                placeholderTextColor="gray"
                max={9999999}
                value={team}
                onInput={(text) => setTeam(text)}
            />
        </View>
        {team !== null && !teamsForMatch.includes(team) && (
            <Text style={{ color: colors.notification, textAlign: "center" }}>
                Warning: Team {team} is not in this match
            </Text>
        )}

        <OrientationChooser
            orientation={orientation}
            setOrientation={setOrientation}
            alliance={alliance}
            setAlliance={setAlliance}
        />
    </View>
}

const styles = exMemo((colors: Theme["colors"]) => StyleSheet.create({
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
        textTransform: "uppercase",
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
        flexDirection: "column",
        minWidth: "85%",
        backgroundColor: colors.card,
        margin: "2%",
        padding: 5,
        borderRadius: 10,
    },
}))
