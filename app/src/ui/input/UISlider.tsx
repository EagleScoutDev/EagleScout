import { Text, View } from "react-native";
import RNSlider from "@react-native-community/slider";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { ThreeCenterLayout } from "../layout/ThreeCenterLayout.tsx";

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
    "use memo";
    const { colors } = useTheme();

    const [draft, setDraft] = useState<number>(value);

    return (
        <View>
            <RNSlider
                disabled={disabled}
                value={value}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.text}
                maximumValue={max}
                minimumValue={min}
                step={step}
                tapToSeek
                onValueChange={setDraft}
                onSlidingComplete={onInput ?? (() => {})}
            />
            <ThreeCenterLayout>
                <Text style={{ color: colors.text, fontSize: 12 }}>{minLabel ?? min.toString()}</Text>
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "bold" }}>{draft}</Text>
                <Text style={{ color: colors.text, fontSize: 12 }}>{maxLabel ?? max.toString()}</Text>
            </ThreeCenterLayout>
        </View>
    );
}
