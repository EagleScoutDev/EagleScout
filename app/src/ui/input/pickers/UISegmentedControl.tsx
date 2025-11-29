import { TouchableOpacity, View } from "react-native";
import { UIText } from "../../../ui/UIText";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

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
                backgroundColor: colors.border.hex, //< TODO: this isn't a border
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
                        borderColor: colors.primary.hex,
                        backgroundColor: selected === title ? colors.bg0.hex : colors.border.hex,
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
