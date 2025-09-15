import React, { Pressable, StyleSheet, Text, View } from 'react-native';
import { PredictionConfidence } from '../../lib/PredictionConfidence';
import { useTheme } from '@react-navigation/native';
import { type SetStateAction } from 'react';

const PredictionConfidenceTag = ({
    confidence,
    setModal,
    tagOnly = false,
}: {
    confidence: PredictionConfidence;
    setModal: (boolean: SetStateAction<boolean>) => void;
    tagOnly?: boolean;
}) => {
    const { colors } = useTheme();

    const getConfidenceText = (c: PredictionConfidence) => {
        switch (c) {
            case PredictionConfidence.LOW:
                return 'Low';
            case PredictionConfidence.MEDIUM:
                return 'Medium';
            case PredictionConfidence.HIGH:
                return 'High';
            default:
                return 'Unknown';
        }
    };

    const width = 100;

    const styles = StyleSheet.create({
        low_container: {
            padding: 10,
            borderRadius: 8,
            backgroundColor: 'crimson',
            width: width,
        },
        medium_container: {
            padding: 10,
            borderRadius: 8,
            backgroundColor: 'chocolate',
            width: width,
        },
        high_container: {
            padding: 10,
            borderRadius: 8,
            backgroundColor: 'green',
            width: width,
        },
        text: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
            {!tagOnly && (
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                    Prediction Confidence
                </Text>
            )}
            <Pressable
                onPress={() => setModal(true)}
                style={
                    confidence === PredictionConfidence.HIGH
                        ? styles.high_container
                        : confidence === PredictionConfidence.MEDIUM
                            ? styles.medium_container
                            : styles.low_container
                }>
                <Text style={styles.text}>
                    {getConfidenceText(confidence).toUpperCase()}
                </Text>
            </Pressable>
        </View>
    );
};

export default PredictionConfidenceTag;
