import { StyleSheet, View } from "react-native";
import { UIText } from "../../ui/UIText";
import { type Theme, useTheme } from "@react-navigation/native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { exMemo } from "../../lib/util/react/memo";
import { PressableOpacity } from "../components/PressableOpacity";
import * as Bs from "../icons";

export interface StepperProps {
    value: number;
    onInput?: undefined | ((value: number) => void);
}
export function UIStepper({ value, onInput }: StepperProps) {
    "use memo";
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <PressableOpacity
                style={[styles.button, { backgroundColor: colors.notification }]}
                disabled={value === 0}
                onPress={() => {
                    ReactNativeHapticFeedback.trigger("impactLight");
                    onInput && onInput(value - 1);
                }}
            >
                <Bs.DashLg size={28} fill={"white"} />
            </PressableOpacity>

            <UIText style={styles.number}>{value}</UIText>

            <PressableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => {
                    ReactNativeHapticFeedback.trigger("impactLight");
                    onInput && onInput(value + 1);
                }}
            >
                <Bs.PlusLg size={28} fill={"white"} />
            </PressableOpacity>
        </View>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        button: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            padding: 10,
            height: 48,
            flex: 1,
        },
        number: {
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            width: 100,
            color: colors.text,
        },
    })
);
