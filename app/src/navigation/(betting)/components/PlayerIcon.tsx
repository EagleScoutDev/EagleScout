import { BottomSheetView } from "@gorhom/bottom-sheet";
import { UIText } from "@/ui/components/UIText.tsx";
import { useTheme } from "@/ui/context/ThemeContext.ts";

export interface PlayerIconProps {
    emoji: string;
    amount: number;
    name: string;
    alliance: "red" | "blue";
}
export function PlayerIcon({ emoji, amount, name, alliance }: PlayerIconProps) {
    const { colors } = useTheme();
    return (
        <BottomSheetView style={{ alignItems: "center" }}>
            <UIText
                style={{
                    color: colors.fg.hex,
                    fontSize: 60,
                    fontWeight: "bold",
                }}
            >
                {emoji}
            </UIText>
            <UIText
                style={{
                    color: colors.fg.hex,
                    fontSize: 14,
                }}
            >
                {name}
            </UIText>
            <UIText
                style={{
                    color: alliance === "red" ? "red" : "blue",
                    fontSize: 18,
                    fontWeight: "bold",
                }}
            >
                {amount}
            </UIText>
        </BottomSheetView>
    );
}
