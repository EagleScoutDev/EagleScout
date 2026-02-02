import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { useTheme } from "@/ui/context/ThemeContext";
import type { Icon } from "@/ui/icons";
import { UIButton, UIButtonStyle } from "@/ui/components/UIButton";

export interface FormItemToolbarProps<T extends string = string> {
    items: readonly { readonly key: T; readonly icon: Icon; readonly name: string }[];
    onPress: (key: T) => void;
}
export function FormItemPalette<T extends string = string>({
    items,
    onPress,
}: FormItemToolbarProps<T>) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        toolbar: {
            paddingHorizontal: 16,
            paddingBottom: 8, // For the scroll bar
            gap: 5,
        },
        item: {
            width: 70,
            height: 40,
            borderRadius: 6,
        },
    });

    return (
        <ScrollView key="toolbar" horizontal={true} contentContainerStyle={styles.toolbar}>
            {items.map(({ key, icon, name }) => (
                <UIButton
                    key={key}
                    style={UIButtonStyle.fill}
                    color={colors.bg1}
                    buttonStyle={styles.item}
                    onPress={() => onPress(key)}
                >
                    {icon({ size: 24, fill: colors.primary.hex })}
                </UIButton>
            ))}
        </ScrollView>
    );
}
