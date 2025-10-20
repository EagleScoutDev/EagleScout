import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { UpcomingRoundsView } from "./UpcomingRoundsView";
import { TabHeader } from "../../ui/navigation/TabHeader.tsx";
import type { ScoutMenuScreenProps } from "./ScoutingFlow";
import { SafeAreaView } from "react-native-safe-area-context";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../ui/UIButton.tsx";
import { UIMenu } from "../../ui/UIMenu.tsx";
import { useRef } from "react";

export interface ScoutFlowHomeProps extends ScoutMenuScreenProps<"Dashboard"> {}
export function ScoutFlowHome({ navigation }: ScoutFlowHomeProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: "2%",
            flex: 1,
        },
        heading_two: {
            fontSize: 24,
            fontWeight: "600",
            color: colors.text,
            paddingLeft: 20,
        },
        button_text: {
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            marginHorizontal: "5%",
        },
        scout_button: {
            backgroundColor: colors.primary,
            padding: "5%",
            paddingRight: "0%",
            borderRadius: 25,
            justifyContent: "center",
            position: "absolute",
            bottom: "4%",
            right: "5%",
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <TabHeader title={"Home"} />
            <Text style={styles.heading_two}>Upcoming Rounds</Text>
            <UpcomingRoundsView navigation={navigation} />
        </SafeAreaView>
    );
}
