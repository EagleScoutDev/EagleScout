import { StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { UpcomingRoundsView } from "./UpcomingRoundsView";
import { TabHeader } from "../../ui/navigation/TabHeader";
import type { ScoutMenuScreenProps } from "./ScoutingFlow";
import { SafeAreaView } from "react-native-safe-area-context";

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
    });

    return (
        <SafeAreaView style={styles.container}>
            <TabHeader title={"Home"} />
            <Text style={styles.heading_two}>Upcoming Rounds</Text>
            <UpcomingRoundsView navigation={navigation} />
        </SafeAreaView>
    );
}
