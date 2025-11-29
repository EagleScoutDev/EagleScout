import { ScrollView } from "react-native-gesture-handler";
import { UIButton, UIButtonStyle } from "../../../../../ui/UIButton";
import { Color } from "../../../../../lib/color";
import { StyleSheet } from "react-native";

import type { Icon } from "../../../../../ui/icons";
import { useTheme } from "../../../../../lib/contexts/ThemeContext.ts";

export interface FormItemToolbarProps<T extends string = string> {
    items: readonly { readonly key: T; readonly icon: Icon; readonly name: string }[];
    onPress: (key: T) => void;
}
export function FormItemPalette<T extends string = string>({ items, onPress }: FormItemToolbarProps<T>) {
    "use memo";

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
                    color={Color.parse(colors.bg1.hex)}
                    buttonStyle={styles.item}
                    onPress={() => onPress(key)}
                >
                    {icon({ size: 24, fill: colors.primary.hex })}
                </UIButton>
            ))}
        </ScrollView>
    );
}
