import { useTheme } from "@/ui/context/ThemeContext";
import type { UIIconName } from "@/ui/components/UIIcon";
import type { Color } from "@/ui/lib/color";
import { Platform } from "react-native";

interface RawUIToolbarItem {
    role?: "done" | "cancel" | undefined;
    text: string;
    color?: Color;
    icon?: UIIconName | { [K in typeof Platform.OS]?: UIIconName };
    iosTint?: Color | null;
    onPress?: (() => void | Promise<void>) | undefined;
}
export type UIToolbarItem = ({ role: RawUIToolbarItem["role"] } & Partial<RawUIToolbarItem>) | RawUIToolbarItem;
