import { ActivityIndicator, Pressable, View } from "react-native";
import { useEffect, useState } from "react";
import { QuestionSummary } from "./QuestionSummary";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { isTablet } from "@/lib/deviceType";
import { type MatchReportReturnData, MatchReportsDB } from "@/lib/database/ScoutMatchReports";
import * as Bs from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";

export function TeamReportSummary({
    team_number,
    competitionId,
}: {
    team_number: number;
    competitionId: number;
}) {
    const { colors } = useTheme();
    const [formStructure, setFormStructure] = useState<object[] | null>(null);
    const [responses, setResponses] = useState<MatchReportReturnData[] | null>(null);

    const [generateSummary, setGenerateSummary] = useState<boolean>(false);

    useEffect(() => {
        CompetitionsDB.getCompetitionById(competitionId).then((competition) => {
            if (!competition) {
                return;
            }
            MatchReportsDB.getReportsForTeamAtCompetition(team_number, competition.id).then(
                (reports) => {
                    setResponses(reports);
                    console.log("scout reports for team " + team_number + " : " + reports);
                    console.log("no reports? " + (reports.length === 0));
                },
            );
            setFormStructure(competition.form);
        });
    }, [competitionId, team_number]);

    if (responses && responses.length === 0) {
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
            {formStructure && responses ? (
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
