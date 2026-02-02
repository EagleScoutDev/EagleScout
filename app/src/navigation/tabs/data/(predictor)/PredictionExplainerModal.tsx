import { Modal, StyleSheet, View } from "react-native";
import { PredictionConfidenceTag } from "./PredictionConfidenceTag";
import { PredictionConfidence } from "@/lib/PredictionConfidence";
import type { Setter } from "@/lib/util/react/types";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";

const explanations: Map<PredictionConfidence, string> = new Map([
    [
        PredictionConfidence.UNDEFINED,
        "Not enough data to make an accurate prediction - more scouting reports are needed.",
    ],
    [PredictionConfidence.LOW, "Every team in this match has at least 2 scouting reports."],
    [PredictionConfidence.MEDIUM, "Every team in this match has at least 4 scouting reports."],
    [PredictionConfidence.HIGH, "Every team in this match has at least 6 scouting reports."],
]);

export interface PredictionExplainerModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
}
export function PredictionExplainerModal({ visible, setVisible }: PredictionExplainerModalProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        explanation_row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderColor: colors.border.hex,
        },
        explanation_text: {
            color: colors.fg.hex,
            fontSize: 16,
            flexWrap: "wrap",
            flex: 0.8,
        },
    });
    return (
        <Modal
            presentationStyle={"pageSheet"}
            visible={visible}
            animationType={"slide"}
            onRequestClose={() => {
                setVisible(false);
            }}
        >
            <View style={{ backgroundColor: colors.bg1.hex, flex: 1 }}>
                <View style={{ padding: "6%" }}>
                    <UIText size={20} bold style={{ textAlign: "center" }}>
                        Prediction Tag Explanation
                    </UIText>
                    {Array.from(explanations).map(([confidence, explanation]) => (
                        <View style={styles.explanation_row} key={confidence}>
                            <PredictionConfidenceTag
                                confidence={confidence}
                                setModal={() => {}}
                                tagOnly={true}
                            />
                            <UIText style={styles.explanation_text}>{explanation}</UIText>
                        </View>
                    ))}
                </View>
            </View>
        </Modal>
    );
}
