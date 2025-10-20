import { useTheme } from "@react-navigation/native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text } from "react-native";

export const PlayerIcon = ({
    emoji,
    amount,
    name,
    alliance,
}: {
    emoji: string;
    amount: number;
    name: string;
    alliance: "red" | "blue";
}) => {
    const { colors } = useTheme();
    return (
        <BottomSheetView style={{ alignItems: "center" }}>
            <Text
                style={{
                    color: colors.text,
                    fontSize: 60,
                    fontWeight: "bold",
                }}
            >
                {emoji}
            </Text>
            <Text
                style={{
                    color: colors.text,
                    fontSize: 14,
                }}
            >
                {name}
            </Text>
            <Text
                style={{
                    color: alliance === "red" ? "red" : "blue",
                    fontSize: 18,
                    fontWeight: "bold",
                }}
            >
                {amount}
            </Text>
        </BottomSheetView>
    );
};
