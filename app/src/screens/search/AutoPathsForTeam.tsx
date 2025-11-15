import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CompetitionsDB } from "../../database/Competitions";
import { MatchReportsDB } from "../../database/ScoutMatchReports";
import { useTheme } from "@react-navigation/native";
import type { SearchMenuScreenProps } from "./SearchMenu";
import * as Reefscape from "../../frc/reefscape";

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
        <View style={{ flex: 1 }}>
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 25,
                    paddingLeft: "5%",
                    color: colors.text,
                }}
            >
                Auto Paths for Team {team_number}
            </Text>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <Text style={{ color: colors.text }}>
                    {autoPaths ? `Path ${currentIndex + 1} of ${autoPaths.length}` : ""}
                </Text>
                {autoPaths ? (
                    <Reefscape.AutoPathView path={autoPaths[currentIndex]!} />
                ) : (
                    <Text style={{ color: colors.text, fontSize: 25 }}>No auto paths found</Text>
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
                            <Text style={{ color: colors.text }}>Previous</Text>
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
                            <Text style={{ color: colors.text }}>Next</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Text style={{ color: colors.text, fontSize: 20 }}>:(</Text>
                )}
            </View>
        </View>
    );
}
