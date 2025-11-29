import { Color } from "../../../../lib/color";
import { UIText } from "../../../../ui/UIText";
import { Pressable } from "react-native";
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
            <UIText bold>{label}</UIText>
            <UIText size={38} bold style={{ textAlign: "center" }}>
                {value}
            </UIText>
        </Pressable>
    );
}
