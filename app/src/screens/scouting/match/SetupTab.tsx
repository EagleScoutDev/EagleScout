import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { StandardButton } from "../../../ui/StandardButton.tsx";
import type { Setter } from "../../../lib/react";
import type { Alliance, Orientation } from "../../../games/common";
import type { CompetitionReturnData } from "../../../database/Competitions.ts";
import { useTheme } from "@react-navigation/native";
import { MatchInformation } from "./components/MatchInformation.tsx";

export interface SetupTabProps {
    match: number | null;
    setMatch: Setter<number | null>;
    team: number | null;
    setTeam: Setter<number | null>;
    teamsForMatch: number[];
    competition: CompetitionReturnData;

    orientation: Orientation;
    setOrientation: Setter<Orientation>;
    alliance: Alliance;
    setAlliance: Setter<Alliance>;

    next: () => void;
}
export function SetupTab({
    match,
    setMatch,
    team,
    setTeam,
    teamsForMatch,
    competition,
    orientation,
    setOrientation,
    alliance,
    setAlliance,
    next,
}: SetupTabProps) {
    const { colors } = useTheme();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        width: "100%",
                    }}
                >
                    {competition != null && (
                        <Text
                            style={{
                                color: colors.text,
                                fontWeight: "bold",
                                fontSize: 20,
                                textAlign: "center",
                                margin: "5%",
                            }}
                        >
                            {competition.name}
                        </Text>
                    )}
                    <MatchInformation
                        match={match}
                        setMatch={setMatch}
                        team={team}
                        setTeam={setTeam}
                        teamsForMatch={teamsForMatch}
                        orientation={orientation}
                        setOrientation={setOrientation}
                        alliance={alliance}
                        setAlliance={setAlliance}
                    />
                </View>
                <View style={{ width: "100%", marginBottom: "5%" }}>
                    <StandardButton
                        text={"Next"}
                        onPress={next}
                        color={colors.primary}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
