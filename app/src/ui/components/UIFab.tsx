import type { Icon } from "@/ui/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/ui/context/ThemeContext";
import { PlatformPressable } from "@react-navigation/elements";

export interface UIFabProps {
    icon: Icon;
    onPress: () => void;
}
export function UIFab({ icon, onPress }: UIFabProps) {
    const { colors } = useTheme();

    const insets = useSafeAreaInsets();

    return (
        <PlatformPressable
            onPress={onPress}
            style={{
                position: "absolute",
                bottom: insets.bottom + 20,
                right: insets.right + 20,
                width: 60,
                height: 60,
                borderRadius: 60,
                backgroundColor: colors.primary.hex,
                zIndex: 10000,
            }}
        >
            {icon({ size: 60, color: colors.primary.fg.hex })}
        </PlatformPressable>
    );
}
