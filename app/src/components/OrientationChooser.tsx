import { Pressable, StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { Alliance, Orientation } from "../games/common";
import * as Bs from "../ui/icons";
import type { Setter } from "../lib/util/react/types";
import { exMemo } from "../lib/util/react/memo.ts";

export interface OrientationChooserProps {
    orientation: Orientation;
    setOrientation: Setter<Orientation>;
    alliance: Alliance;
    setAlliance: Setter<Alliance>;
}
export const OrientationChooser = ({ orientation, setOrientation, alliance, setAlliance }: OrientationChooserProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const leftAlliance = Orientation.getLeft(orientation);
    const rightAlliance = Alliance.toggle(leftAlliance);

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.side, { backgroundColor: Alliance.getColor(leftAlliance).hex }]}
                onPress={() => setAlliance(leftAlliance)}
            >
                {alliance === leftAlliance ? <Bs.CheckLg size="24" fill="white" /> : null}
            </Pressable>
            <Pressable style={styles.center} onPress={() => setOrientation(Orientation.toggle(orientation))}>
                <Bs.ArrowLeftRight size="24" fill="black" />
            </Pressable>
            <Pressable
                style={[styles.side, { backgroundColor: Alliance.getColor(rightAlliance).hex }]}
                onPress={() => setAlliance(Alliance.toggle(leftAlliance))}
            >
                {alliance === rightAlliance ? <Bs.CheckLg size="24" fill="white" /> : null}
            </Pressable>
        </View>
    );
};

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            height: 40,
            borderRadius: 10,
            overflow: "hidden",
        },
        side: {
            alignItems: "center",
            justifyContent: "center",
            width: "40%",
        },
        center: {
            justifyContent: "center",
            alignItems: "center",
            width: "20%",
        },
    })
);
