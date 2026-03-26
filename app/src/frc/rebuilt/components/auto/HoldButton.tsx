import { Pressable, StyleSheet, View } from "react-native";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import type { Theme } from "@/ui/lib/theme";
import * as Haptics from "expo-haptics";



export interface UISecondsProps {
    label: string;
    value: number; // ms
    disabled?: boolean | undefined;
    onInput?: undefined | ((x: number) => void);
}

export function HoldButton({ value, disabled = false, label, onInput}: UISecondsProps) {
    const { colors } = useTheme();

    const styles = useMemo(() => getStyles(colors), [colors]);

    const [displayValue, setDisplayValue] = useState(value);
    const [holding, setHolding] = useState(false);

    const baseRef = useRef(value);
    const startHolding = useRef(0);
    const lastPress = useRef(0);


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

                    if(Date.now()-lastPress.current<300){
                        onInput?.(0);
                        return;
                    }
                    onInput?.((value + (Date.now() - startHolding.current)/1000));
                    lastPress.current = Date.now();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }}
            >
                <UIText style={styles.text}>{label}</UIText>
                <UIText style={styles.number}>{(displayValue).toFixed(3)}</UIText>
            </Pressable>
    );
}

const getStyles = (colors: Theme["colors"]) =>
    StyleSheet.create({
        button: {
            backgroundColor: colors.primary.hex,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 16,
            flex: 1,
            borderRadius: 10,
        },
        number: {
            fontSize: 50,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.fg.hex,
        },
        text: {
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.fg.hex,
        },
    });
