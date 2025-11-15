import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";

export interface SegmentedOptionProps<T extends string> {
    options: { title: T }[];

    selected: T;
    onPress: (option: T) => void;
}
export function UISegmentedControl<T extends string>({ options, selected, onPress }: SegmentedOptionProps<T>) {
    "use memo";
    const { colors } = useTheme();
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "nowrap",
                alignContent: "center",
                padding: 2,
                borderRadius: 10,
                backgroundColor: colors.border, //< TODO: this isn't a border
            }}
        >
            {options.map(({ title }) => (
                <TouchableOpacity
                    key={title}
                    style={{
                        flex: 1,
                        padding: 10,
                        borderWidth: selected === title ? 2 : 0,
                        borderRadius: 8,
                        borderColor: colors.primary,
                        backgroundColor: selected === title ? colors.background : colors.border,
                    }}
                    onPress={() => onPress(title)}
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
            ))}
        </View>
    );
}
