import { Pressable } from "react-native";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";

export interface ActionButtonProps {
    label: string;
    role: "success" | "fail";

    value: number;
    onPress: () => void;
}
export function ActionButton({ label, role, value, onPress }: ActionButtonProps) {
    const { colors } = useTheme();
    const color = role === "success" ? colors.primary : colors.danger;

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
