import { View } from "react-native";
import { UIText } from "../UIText.tsx";
import RNSlider from "@react-native-community/slider";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ThreeCenterLayout } from "../layout/ThreeCenterLayout";
import { Color } from "../../lib/color.ts";

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

    // Sync draft state with value prop when it changes (e.g., after form reset)
    useEffect(() => {
        setDraft(value);
    }, [value]);

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
                <UIText size={12}>{minLabel ?? min.toString()}</UIText>
                <UIText size={12} bold color={Color.parse(colors.primary)}>
                    {draft}
                </UIText>
                <UIText size={12}>{maxLabel ?? max.toString()}</UIText>
            </ThreeCenterLayout>
        </View>
    );
}
