import { Text, View } from "react-native";

interface BadgeProps {
    text: string;
    color: string;
    backgroundColor: string;
}

export const UIBadge = ({ text, color, backgroundColor }: BadgeProps) => {
    "use memo";

    return (
        <View
            style={{
                backgroundColor,
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 2,
                marginTop: 5,
            }}
        >
            <Text
                style={{
                    color,
                    fontSize: 12,
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                {text}
            </Text>
        </View>
    );
};
