import type { Icon } from "./icons";
import { Pressable } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Color } from "../lib/color.ts";
import { useTheme } from "../lib/contexts/ThemeContext.ts";

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
                backgroundColor: colors.primary.hex,
            }}
        >
            {icon({ size: 60, color: Color.parse(colors.primary.hex).fg.hex })}
        </Pressable>
    );
}
