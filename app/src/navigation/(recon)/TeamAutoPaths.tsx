import { useState } from "react";
import { Pressable, View } from "react-native";
import * as Rebuilt from "@/frc/rebuilt";
import type { RootStackScreenProps } from "../index";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export interface TeamAutoPathsParams {
    team_number: number;
    competitionId: number;
}
export interface TeamAutoPathsProps extends RootStackScreenProps<"TeamAutoPaths"> {}
export function TeamAutoPaths({ route }: TeamAutoPathsProps) {
    const { team_number, competitionId } = route.params;
    const { colors } = useTheme();

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const { data: autoPaths = [] } = useQuery({
        ...queries.matchReports.forTeamAtComp({ teamNumber: team_number, compId: competitionId }),
        select: (reports) =>
            reports
                .map((report) => report.autoPath)
                .filter((autoPath) => autoPath) as Rebuilt.AutoPath[],
    });

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
                        <Rebuilt.AutoPathView path={autoPaths[currentIndex]!} />
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
