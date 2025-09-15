import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import PredictionConfidenceTag from './PredictionConfidenceTag';
import { PredictionConfidence } from '../../lib/PredictionConfidence';

const explanations: Map<PredictionConfidence, string> = new Map([
    [
        PredictionConfidence.UNDEFINED,
        'Not enough data to make an accurate prediction - more scouting reports are needed.',
    ],
    [
        PredictionConfidence.LOW,
        'Every team in this match has at least 2 scouting reports.',
    ],
    [
        PredictionConfidence.MEDIUM,
        'Every team in this match has at least 4 scouting reports.',
    ],
    [
        PredictionConfidence.HIGH,
        'Every team in this match has at least 6 scouting reports.',
    ],
]);

const PredictionExplainerModal = ({
    visible,
    setVisible,
}: {
    visible: boolean;
    setVisible: (boolean: boolean) => void;
}) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        explanation_row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderColor: colors.border,
        },
        explanation_text: {
            color: colors.text,
            fontSize: 16,
            flexWrap: 'wrap',
            flex: 0.8,
        },
    });
    return (
        <Modal
            presentationStyle={'pageSheet'}
            visible={visible}
            animationType={'slide'}
            onRequestClose={() => {
                setVisible(false);
            }}>
            <View style={{ backgroundColor: colors.card, flex: 1 }}>
                <View style={{ padding: '6%' }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>
                        Prediction Tag Explanation
                    </Text>
                    {Array.from(explanations).map(([confidence, explanation]) => (
                        <View style={styles.explanation_row} key={confidence}>
                            <PredictionConfidenceTag
                                confidence={confidence}
                                setModal={() => { }}
                                tagOnly={true}
                            />
                            <Text style={styles.explanation_text}>{explanation}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

export default PredictionExplainerModal;
