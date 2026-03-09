import { View } from "react-native";
import RNSlider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { ThreeCenterLayout } from "@/ui/components/layout/ThreeCenterLayout";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";

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
export function UISlider({
    min,
    max,
    step = 1,
    value,
    onInput,
    disabled = false,
    minLabel,
    maxLabel,
}: UISliderProps) {
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
                minimumTrackTintColor={colors.primary.hex}
                maximumTrackTintColor={colors.fg.hex}
                maximumValue={max}
                minimumValue={min}
                step={step}
                tapToSeek
                onValueChange={setDraft}
                onSlidingComplete={onInput ?? (() => {})}
            />
            <ThreeCenterLayout>
                <UIText size={12}>{minLabel ?? min.toString()}</UIText>
                <UIText size={12} bold color={colors.primary}>
                    {draft}
                </UIText>
                <UIText size={12}>{maxLabel ?? max.toString()}</UIText>
            </ThreeCenterLayout>
        </View>
    );
}
