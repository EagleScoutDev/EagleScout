import { ActivityIndicator, Pressable, View } from "react-native";
import { useState } from "react";
import { QuestionSummary } from "./QuestionSummary";
import { isTablet } from "@/lib/deviceType";
import * as Bs from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export function TeamReportSummary({
    team_number,
    competitionId,
}: {
    team_number: number;
    competitionId: number;
}) {
    const { colors } = useTheme();
    const [generateSummary, setGenerateSummary] = useState<boolean>(false);

    const { data: competition } = useQuery(queries.competitions.forId({ id: competitionId }));
    const { data: responses = [] } = useQuery(
        queries.matchReports.forTeamAtComp({ teamNumber: team_number, compId: competitionId }),
    );

    const formStructure = competition?.matchForm.formStructure;

    if (responses.length === 0) {
        return (
            <View
                style={{
                    marginVertical: "10%",
                    marginBottom: "20%",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: colors.bg1.hex,
                    marginHorizontal: "5%",
                    padding: "5%",
                    borderRadius: 12,

                    maxWidth: "85%",
                    alignSelf: "center",
                    minWidth: "85%",
                }}
            >
                <UIText size={20} color={colors.danger} style={{ textAlign: "center" }}>
                    No reports found for this team.
                </UIText>
            </View>
        );
    }

    return (
        <View
            style={{
                marginTop: "10%",
                flexDirection: isTablet() ? "row" : "column",
                flexWrap: isTablet() ? "wrap" : "nowrap",
            }}
        >
            {formStructure ? (
                formStructure.map((item, index) => {
                    return (
                        <QuestionSummary
                            item={item}
                            index={index}
                            data={responses.map((response) => {
                                return {
                                    data: response.data[index],
                                    match: response.matchNumber,
                                };
                            })}
                            generate_ai_summary={generateSummary}
                            graph_disabled={false}
                            show_question={true}
                            only_average={false}
                        />
                    );
                })
            ) : (
                <ActivityIndicator />
            )}
            <Pressable
                onPress={() => setGenerateSummary(true)}
                style={{
                    marginVertical: "10%",
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    backgroundColor: "#bf1cff",
                    marginHorizontal: "5%",
                    padding: "5%",
                    borderRadius: 12,
                }}
            >
                <Bs.Stars width="10%" height="100%" fill="white" style={{ alignSelf: "center" }} />
                <UIText size={20} bold style={{ color: "white", textAlign: "center" }}>
                    Generate AI Summary
                </UIText>
            </Pressable>
        </View>
    );
}
