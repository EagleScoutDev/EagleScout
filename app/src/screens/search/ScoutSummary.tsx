import { ActivityIndicator, Pressable, View } from "react-native";
import { useEffect, useState } from "react";

import { QuestionSummary } from "./QuestionSummary";
import { CompetitionsDB } from "../../database/Competitions";
import { isTablet } from "../../lib/deviceType";
import { type MatchReportReturnData, MatchReportsDB } from "../../database/ScoutMatchReports";
import * as Bs from "../../ui/icons";
import { UIText } from "../../ui/UIText";
import { Color } from "../../lib/color.ts";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

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
                    backgroundColor: colors.bg1.hex,
                    marginHorizontal: "5%",
                    padding: "5%",
                    borderRadius: 12,

                    maxWidth: "85%",
                    alignSelf: "center",
                    minWidth: "85%",
                }}
            >
                <UIText size={20} color={Color.parse(colors.danger.hex)} style={{ textAlign: "center" }}>
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
