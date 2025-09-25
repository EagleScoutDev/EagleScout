import { View, Text } from "react-native";
import RNSlider from "@react-native-community/slider";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Question } from "../Question.tsx";

export function SliderLabel({ text }: { text: string }) {
    const { colors } = useTheme();
    return (
        <Text
            style={{
                color: colors.text,
                fontSize: 12,
            }}
        >
            {text}
        </Text>
    );
}

export interface SliderProps {
    min: number;
    max: number;
    step?: number | undefined;
    minLabel: string | null;
    maxLabel: string | null;
    value: number;
    onInput: (x: number) => void;
    disabled?: boolean | undefined;
}
export function Slider({ min, max, step = 1, value, onInput, disabled = false, minLabel, maxLabel }: SliderProps) {
    const { colors } = useTheme();

    const [localValue, setLocalValue] = useState<number>(value);

    return (
        <View>
            <RNSlider
                disabled={disabled}
                value={localValue}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.text}
                maximumValue={max}
                minimumValue={min}
                step={step}
                onValueChange={setLocalValue}
                onSlidingComplete={() => onInput(localValue)}
            />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <SliderLabel text={minLabel ? minLabel : min.toString()} />
                <Text
                    style={{
                        color: colors.primary,
                        fontSize: 13,
                        alignSelf: "center",
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    {localValue}
                </Text>
                <SliderLabel text={maxLabel ? maxLabel : max.toString()} />
            </View>
        </View>
    );
}
