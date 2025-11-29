import type { Icon } from "./icons";
import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Color } from "../lib/color.ts";

export interface UIFabProps {
    icon: Icon;
    onPress: () => void;
}
export function UIFab({ icon, onPress }: UIFabProps) {
    "use memo";

    const { colors } = useTheme();

    const insets = useSafeAreaInsets();

    return (
        <Pressable
            onPress={onPress}
            style={{
                position: "absolute",
                bottom: insets.bottom + 20,
                right: insets.right + 20,
                width: 60,
                height: 60,
                borderRadius: 60,
                backgroundColor: colors.primary,
            }}
        >
            {icon({ size: 60, color: Color.parse(colors.primary).fg.hex })}
        </Pressable>
    );
}
