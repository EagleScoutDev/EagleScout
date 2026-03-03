import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import type { Theme } from "@/ui/lib/theme";
import * as Haptics from "expo-haptics";

export interface UISecondsProps {
    value: number; // ms
    onInput?: undefined | ((x: number) => void);
    disabled?: boolean | undefined;
}

export function UISeconds({ value, onInput, disabled = false }: UISecondsProps) {
    const { colors } = useTheme();

    const styles = useMemo(() => getStyles(colors), [colors]);

    const [displayValue, setDisplayValue] = useState(value);
    const [holding, setHolding] = useState(false);

    const baseRef = useRef(value);
    const startHolding = useRef(0);

    useEffect(() => {
        if (!holding) setDisplayValue(value);
    }, [value, holding]);

    useEffect(() => {
        if (!holding) return;

        const update = setInterval(() => {
            setDisplayValue((baseRef.current + (Date.now() - startHolding.current)/1000));
        }, 50);

        return () => clearInterval(update);
    }, [holding]);

    return (
        <View>
            <Pressable
                disabled={disabled}
                style={[
                    styles.button,
                    { backgroundColor: colors.danger.hex, opacity: disabled ? 0.5 : 1 },
                ]}
                onPressIn={() => {
                    if (disabled) return;
                    baseRef.current = value;
                    startHolding.current = Date.now();
                    setHolding(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                onPressOut={() => {
                    if (disabled) return;
                    setHolding(false);

                    onInput?.((value + (Date.now() - startHolding.current)/1000));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }}
            >
                <UIText style={styles.number}>{(displayValue).toFixed(3)}</UIText>
            </Pressable>
        </View>
    );
}

const getStyles = (colors: Theme["colors"]) =>
    StyleSheet.create({
        button: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            height: 200,
            flex: 1,
        },
        number: {
            fontSize: 80,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.fg.hex,
        },
    });
