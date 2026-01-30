import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { MatchReportsDB } from "@/lib/database/ScoutMatchReports";
import type { BrowseTabScreenProps } from "../index";
import * as Reefscape from "@/frc/reefscape";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";

export interface TeamAutoPathsParams {
    team_number: number;
    competitionId: number;
}
export interface TeamAutoPathsProps extends BrowseTabScreenProps<"AutoPaths"> {}
export function TeamAutoPaths({ route }: TeamAutoPathsProps) {
    const { team_number, competitionId } = route.params;
    const { colors } = useTheme();

    const [autoPaths, setAutoPaths] = useState<Reefscape.AutoPath[] | undefined>();
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        CompetitionsDB.getCompetitionById(competitionId).then(async (competition) => {
            if (!competition) {
                return;
            }
            const reports = await MatchReportsDB.getReportsForTeamAtCompetition(
                team_number,
                competition.id,
            );
            setAutoPaths(
                reports
                    .map((report) => report.autoPath)
                    .filter((autoPath) => autoPath) as Reefscape.AutoPath[],
            );
        });
    }, [team_number]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <UIText>
                        {autoPaths ? `Path ${currentIndex + 1} of ${autoPaths.length}` : ""}
                    </UIText>
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
                                    backgroundColor: colors.bg1.hex,
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
                                    backgroundColor: colors.bg1.hex,
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
