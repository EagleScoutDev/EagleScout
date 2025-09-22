import { Text, TouchableOpacity } from "react-native";

export function SegmentedOption({ colors, selected, title, onPress }) {
    return (
        <TouchableOpacity
            style={{
                borderWidth: 2,
                borderColor: selected === title ? colors.primary : colors.border,
                padding: 10,
                borderRadius: 10,
                flex: 1,
                backgroundColor: selected === title ? colors.background : colors.border,
            }}
            onPress={onPress}
        >
            <Text
                style={{
                    color: colors.text,
                    textAlign: "center",
                    fontWeight: selected === title ? "bold" : "normal",
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
