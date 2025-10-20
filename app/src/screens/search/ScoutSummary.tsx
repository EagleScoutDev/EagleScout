import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { QuestionSummary } from "./QuestionSummary";
import { CompetitionsDB } from "../../database/Competitions";
import { isTablet } from "../../lib/deviceType";
import { type MatchReportReturnData, MatchReportsDB } from "../../database/ScoutMatchReports";
import * as Bs from "../../ui/icons";

export function ScoutSummary({ team_number, competitionId }: { team_number: number; competitionId: number }) {
    const { colors } = useTheme();
    const [formStructure, setFormStructure] = useState<Array<Object> | null>(null);
    const [responses, setResponses] = useState<MatchReportReturnData[] | null>(null);

    const [generateSummary, setGenerateSummary] = useState<boolean>(false);

    useEffect(() => {
        CompetitionsDB.getCompetitionById(competitionId).then((competition) => {
            if (!competition) {
                return;
            }
            MatchReportsDB.getReportsForTeamAtCompetition(team_number, competition.id).then((reports) => {
                setResponses(reports);
                console.log("scout reports for team " + team_number + " : " + reports);
                console.log("no reports? " + (reports.length === 0));
            });
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
                    // align content horizontally
                    alignItems: "center",
                    backgroundColor: colors.card,
                    marginHorizontal: "5%",
                    padding: "5%",
                    borderRadius: 12,

                    maxWidth: "85%",
                    alignSelf: "center",
                    minWidth: "85%",
                }}
            >
                <Text style={{ color: "red", fontSize: 20, textAlign: "center" }}>No reports found for this team.</Text>
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
                <Text
                    style={{
                        color: "white",
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    Generate AI Summary
                </Text>
            </Pressable>
        </View>
    );
}
