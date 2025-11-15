import { Pressable, StyleSheet, View } from "react-native";
import * as Bs from "../ui/icons";
import type { Setter } from "../lib/util/react/types";
import { Alliance, Orientation } from "../frc/common/common";

export interface OrientationChooserProps {
    orientation: Orientation;
    setOrientation: Setter<Orientation>;
    alliance: Alliance;
    setAlliance: Setter<Alliance>;
}
export const OrientationChooser = ({ orientation, setOrientation, alliance, setAlliance }: OrientationChooserProps) => {
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

const styles = StyleSheet.create({
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
});
