import { useEffect, useState } from "react";
import { UIText } from "../../ui/UIText";
import { Pressable, View } from "react-native";
import { CompetitionsDB } from "../../database/Competitions";
import { MatchReportsDB } from "../../database/ScoutMatchReports";
import { useTheme } from "@react-navigation/native";
import type { SearchMenuScreenProps } from "./SearchMenu";
import * as Reefscape from "../../frc/reefscape";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export interface AutoPathsForTeamParams {
    team_number: number;
    competitionId: number;
}
export interface AutoPathsForTeamProps extends SearchMenuScreenProps<"AutoPaths"> {}
export function AutoPathsForTeam({ route }: AutoPathsForTeamProps) {
    const { team_number, competitionId } = route.params;
    const { colors } = useTheme();
    const [autoPaths, setAutoPaths] = useState<Reefscape.AutoPath[] | undefined>();
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        CompetitionsDB.getCompetitionById(competitionId).then(async (competition) => {
            if (!competition) {
                return;
            }
            const reports = await MatchReportsDB.getReportsForTeamAtCompetition(team_number, competition.id);
            setAutoPaths(
                reports.map((report) => report.autoPath).filter((autoPath) => autoPath) as Reefscape.AutoPath[]
            );
        });
    }, [team_number]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <UIText
                    style={{
                        fontWeight: "bold",
                        fontSize: 25,
                        paddingLeft: "5%",
                        color: colors.text,
                    }}
                >
                    Auto Paths for Team {team_number}
                </UIText>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <UIText>{autoPaths ? `Path ${currentIndex + 1} of ${autoPaths.length}` : ""}</UIText>
                    {autoPaths ? (
                        <Reefscape.AutoPathView path={autoPaths[currentIndex]!} />
                    ) : (
                        <UIText size={25}>No auto paths found</UIText>
                    )}
                    {autoPaths ? (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                width: "100%",
                                marginTop: 10,
                                gap: 10,
                            }}
                        >
                            <Pressable
                                style={{
                                    backgroundColor: colors.card,
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                                onPress={() => {
                                    if (currentIndex > 0) {
                                        setCurrentIndex(currentIndex - 1);
                                    }
                                }}
                            >
                                <UIText>Previous</UIText>
                            </Pressable>
                            <Pressable
                                style={{
                                    backgroundColor: colors.card,
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                                onPress={() => {
                                    if (currentIndex < autoPaths.length - 1) {
                                        setCurrentIndex(currentIndex + 1);
                                    }
                                }}
                            >
                                <UIText>Next</UIText>
                            </Pressable>
                        </View>
                    ) : (
                        <UIText size={20}>:(</UIText>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
