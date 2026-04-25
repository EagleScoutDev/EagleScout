import { Dimensions, Pressable, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useState } from "react";
import { type FormReturnData } from "@/lib/db/models/Form";
import type { Setter } from "@/lib/util/react/types";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIModal } from "@/ui/components/UIModal";
import { UIText } from "@/ui/components/UIText";
import { Form } from "@/lib/forms";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export interface CombinedGraphProps {
    modalActive: boolean;
    setModalActive: Setter<boolean>;
    team_number: number;
    competitionId: number;
    questionIndices: number[];
}
export function CombinedGraph({
    team_number,
    competitionId,
    modalActive,
    setModalActive,
    questionIndices,
}: CombinedGraphProps) {
    const { colors, dark } = useTheme();

    const chartConfig = {
        backgroundGradientFrom: colors.bg1.hex,
        backgroundGradientFromOpacity: 1.0,
        backgroundGradientTo: colors.bg1.hex,
        backgroundGradientToOpacity: 1.0,
        color: (opacity = 1) => (dark ? `rgba(255, 255, 255, ${opacity})` : "rgba(0, 0, 0, 1)"),
        backgroundColor: colors.bg1.hex,
        strokeWidth: 2,
        useShadowColorFromDataset: false,
        fillShadowGradient: colors.bg1.hex,
    };

    const { data: relevantReports = [] } = useQuery({
        ...queries.matchReports.forTeamAtComp({
            teamNumber: team_number,
            compId: competitionId,
        }),
        select: (reports) => reports.sort((a, b) => a.matchNumber - b.matchNumber),
        enabled: modalActive,
    });

    const { data: competition } = useQuery({
        ...queries.competitions.forId({ id: competitionId }),
        enabled: modalActive,
    });

    const { data: form } = useQuery({
        ...queries.forms.forId({ id: competition?.formId ?? -1 }),
        enabled: modalActive && !!competition?.formId,
    });

    const [questionToColor, setQuestionToColor] = useState<Map<string, string>>(new Map());

    if (form !== undefined) {
        const newMap = new Map<string, string>();
        for (let index of questionIndices) {
            const item = form.formStructure[index];
            if (Form.Item.isQuestion(item)) {
                newMap.set(
                    item.question,
                    `rgba(${(index * 100) % 255}, ${(index * 50) % 255}, ${(index * 25) % 255}, 1.0)`,
                );
            }
        }
        if (JSON.stringify(Array.from(newMap.entries())) !== JSON.stringify(Array.from(questionToColor.entries()))) {
            setQuestionToColor(newMap);
        }
    }

    return (
        <UIModal
            title={"Team " + team_number.toString(10) + " Performance"}
            visible={modalActive}
            backdropPressBehavior={"none"}
            onDismiss={() => {
                setModalActive(false);
            }}
        >
            <View>
                {relevantReports.length > 0 && form !== undefined && (
                    <>
                        <View
                            style={{
                                alignItems: "flex-start",
                                justifyContent: "center",
                                alignSelf: "center",
                            }}
                        >
                            {Array.from(questionToColor.keys()).map((question, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginVertical: "2%",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            backgroundColor: questionToColor.get(question),
                                            marginRight: "2%",
                                        }}
                                    />
                                    <UIText size={16} bold>
                                        {question}
                                    </UIText>
                                </View>
                            ))}
                        </View>
                        <LineChart
                            data={{
                                labels: relevantReports.map((report) =>
                                    report.matchNumber.toString(10),
                                ),
                                datasets: questionIndices.map((index) => ({
                                    data: relevantReports.map((report) => report.data[index]),
                                    color: () =>
                                        questionToColor.get(
                                            Form.Item.assertQuestion(form.formStructure[index]).question,
                                        ) ?? "rgba(0, 0, 0, 1.0)",
                                    strokeWidth: 4, // optional
                                })),
                            }}
                            width={Dimensions.get("window").width * 0.85} // from react-native
                            height={Dimensions.get("window").height / 4}
                            chartConfig={chartConfig}
                            bezier
                        />
                    </>
                )}
                <UIText bold style={{ textAlign: "center" }}>
                    Match Number
                </UIText>
            </View>
            <Pressable style={{ marginTop: "4%" }} onPress={() => setModalActive(false)}>
                <UIText size={16} color={colors.primary}>
                    Close
                </UIText>
            </Pressable>
        </UIModal>
    );
}
