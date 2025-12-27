import { TouchableOpacity, View } from "react-native";
import { UIText } from "@/ui/components/UIText";
import { useTheme } from "@/ui/context/ThemeContext";

export interface SegmentedOptionProps<T extends string> {
    options: { title: T }[];

    selected: T;
    onPress: (option: T) => void;
}
export function UISegmentedControl<T extends string>({ options, selected, onPress }: SegmentedOptionProps<T>) {
    const { colors } = useTheme();
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "nowrap",
                alignContent: "center",
                padding: 2,
                borderWidth: 1,
                borderColor: colors.border.hex,
                borderRadius: 10,
                backgroundColor: colors.bg1.hex,
            }}
        >
            {options.map(({ title }) => (
                <TouchableOpacity
                    key={title}
                    style={{
                        flex: 1,
                        padding: 10,
                        borderWidth: selected === title ? 1 : 0,
                        borderRadius: 7,
                        borderColor: colors.border.hex,
                        backgroundColor: selected === title ? colors.bg2.hex : colors.bg1.hex,
                    }}
                    onPress={() => onPress(title)}
                >
                    <UIText bold={selected === title} style={{ textAlign: "center" }}>
                        {title}
                    </UIText>
                </TouchableOpacity>
            ))}
        </View>
    );
}
