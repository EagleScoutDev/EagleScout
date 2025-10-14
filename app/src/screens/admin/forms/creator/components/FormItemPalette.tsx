import { ScrollView } from "react-native-gesture-handler";
import { UIButton, UIButtonFrame } from "../../../../../ui/UIButton.tsx";
import { Color } from "../../../../../lib/color.ts";
import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import type { Icon } from "../../../../../ui/icons";

export interface FormItemToolbarProps<T extends string = string> {
    items: readonly { readonly key: T, readonly icon: Icon, readonly name: string }[]
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
        }
    })

    return (
        <ScrollView key="toolbar" horizontal={true} contentContainerStyle={styles.toolbar}>
            {
                items.map(({ key, icon, name }) => (
                    <UIButton
                        key={key}
                        frame={UIButtonFrame.fill}
                        color={Color.parse(colors.card)}
                        style={styles.item}
                        onPress={() => onPress(key)}
                    >
                        {icon({ size: 24, fill: colors.primary })}
                    </UIButton>
                ))
            }
        </ScrollView>
    );
}
