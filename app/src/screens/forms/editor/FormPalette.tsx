import { exMemo } from "../../../lib/react";
import { type Theme, useTheme } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type Icon } from "../../../ui/icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { type Key, useMemo, useState } from "react";

export interface FormPaletteProps<K extends Key = string> {
    options: { key: K; icon: Icon; name: string; desc: string }[];
    onPress: (key: K) => void;
}
export function FormPalette<K extends Key>({ options, onPress }: FormPaletteProps<K>) {
    const { colors } = useTheme();
    const s = styles(colors);

    const snapPoints = useMemo(() => [90, "40%"], []);
    const [snapPoint, setSnapPoint] = useState(0);

    return (
        <BottomSheet
            backgroundStyle={{ backgroundColor: colors.background }}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            index={snapPoint}
            onChange={setSnapPoint}
            // onAnimate={(fromIndex, toIndex) => setSnapPoint(toIndex)}
        >
            {snapPoint === 0 ? (
                <View>
                    <ScrollView horizontal={true} contentContainerStyle={s.pillBar}>
                        {options.map(({ key, icon, name }) => (
                            <TouchableOpacity key={key} style={s.pill} onPress={() => onPress(key)}>
                                {icon({ size: 24, fill: colors.primary })}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <ScrollView>
                    {options.map(({ key, icon, name }) => (
                        <TouchableOpacity key={key} style={s.line} onPress={() => onPress(key)}>
                            {icon({ size: 24, fill: colors.primary })}
                            <Text style={s.lineName}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </BottomSheet>
    );
}

const styles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        pillBar: {
            paddingHorizontal: 10,
            marginBottom: 10,
            gap: 5,
        },
        pill: {
            width: 60,
            height: 40,
            backgroundColor: colors.card,
            borderRadius: 5,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
        },
        line: {
            paddingHorizontal: 10,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor: colors.border,
        },
        lineName: {
            marginLeft: 10,
            fontSize: 16,
        },
    })
);
