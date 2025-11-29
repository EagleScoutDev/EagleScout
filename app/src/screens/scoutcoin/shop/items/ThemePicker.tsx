import { Pressable, ScrollView, View } from "react-native";
import { UIText } from "../../../../ui/UIText";
import { useTheme } from "@react-navigation/native";
import { Theme, ThemeOption } from "../../../../theme";

export interface ThemePickerProps {
    options: { id: ThemeOption; name: string }[];
    value: ThemeOption;
    onSubmit: (theme: ThemeOption) => void;
}
export function ThemePicker({ options, value, onSubmit }: ThemePickerProps) {
    "use memo";
    const { colors } = useTheme();

    return (
        <View>
            <ScrollView
                style={{
                    margin: 20,
                    padding: 2,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: colors.border,
                    alignContent: "center",
                    height: "36%",
                }}
            >
                {options.map(({ id, name }) => {
                    const selected = value === id;
                    const theme = Theme.get(id);
                    return (
                        <Pressable
                            key={id}
                            onPress={() => onSubmit(id)}
                            style={{
                                flexDirection: "row",
                                flex: 1,
                                borderWidth: 2,
                                borderRadius: 10,
                                borderColor: selected ? colors.text : colors.card,
                                padding: 10,
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: selected ? colors.background : colors.card,
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <UIText size={16} bold style={{ flex: 1 }}>
                                    {name}
                                </UIText>

                                <View
                                    style={{
                                        borderRadius: 200,
                                        width: 40,
                                        height: 40,
                                        backgroundColor: theme.motif.hex,
                                    }}
                                />
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}
