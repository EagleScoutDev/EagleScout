import { Pressable, ScrollView, View } from "react-native";
import { Theme, type ThemeOption } from "@/ui/lib/theme";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";

export interface ThemePickerProps {
    options: { id: ThemeOption; name: string }[];
    value: ThemeOption;
    onSubmit: (theme: ThemeOption) => void;
}
export function ThemePicker({ options, value, onSubmit }: ThemePickerProps) {
    const { colors } = useTheme();

    return (
        <View>
            <ScrollView
                style={{
                    margin: 20,
                    padding: 2,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: colors.border.hex,
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
                                borderColor: selected ? colors.fg.hex : colors.bg1.hex,
                                padding: 10,
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: selected ? colors.bg0.hex : colors.bg1.hex,
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
