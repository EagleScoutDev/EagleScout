import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { useTheme, type Theme } from "@react-navigation/native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { exMemo } from "../../lib/util/react/memo.ts";

export interface StepperProps {
    value: number;
    onInput?: undefined | ((value: number) => void);
}
export function UIStepper({ value, onInput }: StepperProps) {
    "use memo";
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                disabled={value === 0}
                onPress={() => {
                    onInput && onInput(value + 1);
                    ReactNativeHapticFeedback.trigger("impactLight");
                }}
            >
                <View style={[styles.button, value === 0 ? styles.buttonDisabled : null]}>
                    <Text style={styles.buttonText}>-</Text>
                </View>
            </TouchableOpacity>

            <Text style={styles.number}>{value}</Text>

            <TouchableOpacity
                onPress={() => {
                    onInput && onInput(value - 1);
                    ReactNativeHapticFeedback.trigger("impactLight");
                }}
            >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
        },
        button: {
            backgroundColor: "gray", //< TODO: follow theme
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            padding: 10,
            width: 100,
            height: 75,
        },
        buttonDisabled: {
            backgroundColor: "darkgray", //< TODO: follow theme
        },
        buttonText: {
            color: "white",
            fontSize: 30,
        },
        number: {
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            width: 80,
            color: colors.text,
        },
    })
);
