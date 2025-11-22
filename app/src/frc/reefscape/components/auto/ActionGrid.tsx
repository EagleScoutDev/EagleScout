import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Color } from "../../../../lib/color";
import { PressableOpacity } from "../../../../ui/components/PressableOpacity";

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
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            padding: 16,
            width: "100%",
            flex: 1,
        },
        failButton: {
            backgroundColor: colors.notification,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            padding: 16,
            width: "100%",
            flex: 1,
        },
        text: {
            color: Color.parse(colors.primary).fg.rgba,
            fontSize: 20,
        },
    });

    return (
        <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold", marginTop: 8, marginBottom: 8 }}>
                {title}
            </Text>
            <View style={{ width: "100%", flex: 1, gap: 16 }}>
                {rows.map((row, y) => (
                    <View key={y} style={styles.row}>
                        {row.map(({ text, value, role }, x) => (
                            <PressableOpacity
                                key={x}
                                style={role === "success" ? styles.button : styles.failButton}
                                onPress={() => onPress(value, role === "success")}
                            >
                                <Text style={styles.text}>{text}</Text>
                            </PressableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}
