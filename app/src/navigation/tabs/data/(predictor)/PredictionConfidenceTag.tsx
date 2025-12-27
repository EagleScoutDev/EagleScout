import { Pressable, StyleSheet, View } from "react-native";
import { type SetStateAction } from "react";
import { PredictionConfidence } from "@/lib/PredictionConfidence";
import { UIText } from "@/ui/components/UIText";

export interface PredictionConfidenceTagProps {
    confidence: PredictionConfidence;
    setModal: (boolean: SetStateAction<boolean>) => void;
    tagOnly?: boolean;
}
export function PredictionConfidenceTag({ confidence, setModal, tagOnly = false }: PredictionConfidenceTagProps) {
    const getConfidenceText = (c: PredictionConfidence) => {
        switch (c) {
            case PredictionConfidence.LOW:
                return "Low";
            case PredictionConfidence.MEDIUM:
                return "Medium";
            case PredictionConfidence.HIGH:
                return "High";
            default:
                return "Unknown";
        }
    };

    const width = 100;

    const styles = StyleSheet.create({
        low_container: {
            padding: 10,
            borderRadius: 8,
            backgroundColor: "crimson",
            width: width,
        },
        medium_container: {
            padding: 10,
            borderRadius: 8,
            backgroundColor: "chocolate",
            width: width,
        },
        high_container: {
            padding: 10,
            borderRadius: 8,
            backgroundColor: "green",
            width: width,
        },
        text: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
        },
    });

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
            }}
        >
            {!tagOnly && <UIText bold>Prediction Confidence</UIText>}
            <Pressable
                onPress={() => setModal(true)}
                style={
                    confidence === PredictionConfidence.HIGH
                        ? styles.high_container
                        : confidence === PredictionConfidence.MEDIUM
                          ? styles.medium_container
                          : styles.low_container
                }
            >
                <UIText style={styles.text}>{getConfidenceText(confidence).toUpperCase()}</UIText>
            </Pressable>
        </View>
    );
}
