import { StyleSheet, View } from "react-native";
import { UIText } from "../../../../ui/UIText";
import { PressableOpacity } from "../../../../ui/components/PressableOpacity";
import { useTheme } from "../../../../lib/contexts/ThemeContext.ts";

export interface ActionMenuProps<T> {
    title: string;
    options: { text: string; role: "success" | "fail"; value: T }[][];
    onPress: (value: T, success: boolean) => void;
}
export function ActionGrid<T>({ title, options: rows, onPress }: ActionMenuProps<T>) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        row: {
            flexDirection: "row",
            gap: 16,
            flex: 1,
        },
        button: {
            backgroundColor: colors.primary.hex,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            padding: 16,
            width: "100%",
            flex: 1,
        },
        failButton: {
            backgroundColor: colors.danger.hex,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            padding: 16,
            width: "100%",
            flex: 1,
        },
    });

    return (
        <View style={{ alignItems: "center", flex: 1 }}>
            <UIText size={24} bold style={{ marginTop: 8, marginBottom: 8 }}>
                {title}
            </UIText>
            <View style={{ width: "100%", flex: 1, gap: 16 }}>
                {rows.map((row, y) => (
                    <View key={y} style={styles.row}>
                        {row.map(({ text, value, role }, x) => {
                            return (
                                <PressableOpacity
                                    key={x}
                                    style={role === "success" ? styles.button : styles.failButton}
                                    onPress={() => onPress(value, role === "success")}
                                >
                                    <UIText size={20} color={colors.primary.hex}>
                                        {text}
                                    </UIText>
                                </PressableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
}
