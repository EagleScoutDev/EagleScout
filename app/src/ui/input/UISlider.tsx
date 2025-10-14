import { View, Text, StyleSheet } from "react-native";
import RNSlider from "@react-native-community/slider";
import { type Theme, useTheme } from "@react-navigation/native";
import { useState } from "react";
import { exMemo } from "../../lib/react/util/memo.ts";

export interface UISliderProps {
    min: number;
    max: number;
    step?: number | undefined;
    minLabel: string | null;
    maxLabel: string | null;
    value: number;
    onInput?: undefined | ((x: number) => void);
    disabled?: boolean | undefined;
}
export function UISlider({ min, max, step = 1, value, onInput, disabled = false, minLabel, maxLabel }: UISliderProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [draft, setDraft] = useState<number>(value);

    return (
        <View>
            <RNSlider
                disabled={disabled}
                value={draft}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.text}
                maximumValue={max}
                minimumValue={min}
                step={step}
                onValueChange={setDraft}
                onSlidingComplete={() => onInput && onInput(draft)}
            />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{minLabel ?? min.toString()}</Text>
                <Text style={styles.value}>{draft}</Text>
                <Text style={styles.label}>{maxLabel ?? max.toString()}</Text>
            </View>
        </View>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        labelContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        label: { color: colors.text, fontSize: 12 },
        value: {
            color: colors.primary,
            fontSize: 13,
            alignSelf: "center",
            textAlign: "center",
            fontWeight: "bold",
        },
    })
);
