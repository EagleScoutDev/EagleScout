import { Pressable, StyleSheet, View } from "react-native";
import * as Bs from "@/ui/icons";
import type { Setter } from "@/lib/util/react/types";
import { Alliance } from "@/frc/common/common";

export interface AllianceChooserProps {
    alliance: Alliance;
    setAlliance: Setter<Alliance>;
}
export function AllianceChooser({ alliance, setAlliance }: AllianceChooserProps) {
    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.side, { backgroundColor: Alliance.getColor(Alliance.red).hex }]}
                onPress={() => setAlliance(Alliance.red)}
            >
                {alliance === Alliance.red ? <Bs.CheckLg size="24" fill="white" /> : null}
            </Pressable>
            <Pressable
                style={[styles.side, { backgroundColor: Alliance.getColor(Alliance.blue).hex }]}
                onPress={() => setAlliance(Alliance.blue)}
            >
                {alliance === Alliance.blue ? <Bs.CheckLg size="24" fill="white" /> : null}
            </Pressable>
        </View>
    );
}

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
        width: "50%",
    },
});
