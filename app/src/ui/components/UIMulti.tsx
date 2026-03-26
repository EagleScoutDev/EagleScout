import { StyleSheet, View } from "react-native";
import { UIText } from "./UIText";
import { exMemo } from "@/lib/util/react/memo";
import { PressableOpacity } from "@/components/PressableOpacity";
import * as Bs from "@/ui/icons";
import type { Theme } from "@/ui/lib/theme";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/ui/context/ThemeContext";

export interface MultiProps {
    value: number;
    onInput?: undefined | ((value: number) => void);
}
export function UIMulti({ value, onInput }: MultiProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 4,
                flex:2
            }}>
            <PressableOpacity
                style={[styles.button, { backgroundColor: colors.danger.hex }]}
                disabled={value<10}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    onInput && onInput(value - 10);
                }}
            >
                <UIText style={styles.number}>-10</UIText>
            </PressableOpacity>
            <PressableOpacity
                style={[styles.button, { backgroundColor: colors.danger.hex }]}
                disabled={value<5}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onInput && onInput(value - 5);
                }}
            >
                <UIText style={styles.number}>-5</UIText>
            </PressableOpacity>
            <PressableOpacity
                style={[styles.button, { backgroundColor: colors.danger.hex }]}
                disabled={value === 0}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onInput && onInput(value - 1);
                }}
            >
                <UIText style={styles.number}>-1</UIText>
            </PressableOpacity>
            </View>

            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><UIText style={styles.bigNumber}>{value}</UIText></View>

            <View style={{
                flexDirection: "column-reverse",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: 4,
                flex:2
            }}>
            <PressableOpacity
                style={[styles.button, { backgroundColor: colors.primary.hex }]}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onInput && onInput(value + 1);
                }}
            >
                <UIText style={styles.number}>+1</UIText>
            </PressableOpacity>
            <PressableOpacity
                style={[styles.button, { backgroundColor: colors.primary.hex }]}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onInput && onInput(value + 5);
                }}
            >
                <UIText style={styles.number}>+5</UIText>
            </PressableOpacity>
            <PressableOpacity
                style={[styles.button, { backgroundColor: colors.primary.hex }]}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    onInput && onInput(value + 10);
                }}
            >
                <UIText style={styles.number}>+10</UIText>
            </PressableOpacity>
            </View>
        </View>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        button: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            height:67,
            flex: 1,
        },
        bigNumber:{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            width: 50,
            color: colors.fg.hex,
        },
        number: {
            fontSize: 17,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.fg.hex,
            width:120
        },
    }),
);
