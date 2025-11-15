import { Color } from "../../../../lib/color";
import { Pressable, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

export interface ActionButtonProps {
    label: string;
    role: "success" | "fail";

    value: number;
    onPress: () => void;
}
export function ActionButton({ label, role, value, onPress }: ActionButtonProps) {
    "use memo";

    const { colors } = useTheme();
    const color = role === "success" ? Color.parse(colors.primary) : Color.parse(colors.notification);

    return (
        <Pressable
            style={{
                backgroundColor: color.hex,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: 16,
                flex: 1,
                borderRadius: 10,
            }}
            onPress={onPress}
        >
            <Text
                style={{
                    color: color.fg.hex,
                    fontWeight: "bold",
                }}
            >
                {label}
            </Text>
            <Text
                style={{
                    color: color.fg.hex,
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 38,
                }}
            >
                {value}
            </Text>
        </Pressable>
    );
}
