import { type NavigationProp, type Theme, useTheme } from "@react-navigation/native";
import * as Bs from "./ui/icons";
import { PressableOpacity } from "./ui/components/PressableOpacity.tsx";
import { StyleSheet, Text, View } from "react-native";
import type { RootStackParamList } from "./App.tsx";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

export interface PlusMenuProps {
    navigation: NavigationProp<RootStackParamList, any>;
}
export function PlusMenu({ navigation }: PlusMenuProps) {
    "use memo";
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const modal = useBottomSheetModal();

    return (
        <View style={{ width: "100%" }}>
            <PressableOpacity
                style={styles.item}
                onPress={() => {
                    modal.dismiss();
                    navigation.navigate("App", {
                        screen: "Home",
                        params: { screen: "Match", initial: false },
                    });
                }}
            >
                <View style={styles.icon}>
                    <Bs.JournalPlus size="100%" fill={colors.text} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.title}>New Report</Text>
                    <Text style={styles.subtitle}>
                        Scouting reports are used to collect data on a robot for a single match.
                    </Text>
                </View>
            </PressableOpacity>
            <PressableOpacity
                style={styles.item}
                onPress={() => {
                    modal.dismiss();
                    navigation.navigate("App", {
                        screen: "Home",
                        params: { screen: "Pit", initial: false, params: { screen: "Match" } },
                    });
                }}
            >
                <View style={styles.icon}>
                    <Bs.Tag size="100%" fill={colors.text} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.title}>Pit Scout</Text>
                    <Text style={styles.subtitle}>
                        Pit scouting reports are used to collect data on a robot's capabilities and features.
                    </Text>
                </View>
            </PressableOpacity>
            <PressableOpacity
                style={styles.item}
                onPress={() => {
                    modal.dismiss();
                    navigation.navigate("App", {
                        screen: "Home",
                        params: { screen: "Note", initial: false },
                    });
                }}
            >
                <View style={styles.icon}>
                    <Bs.Sticky size="100%" fill={colors.text} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.title}>New Note</Text>
                    <Text style={styles.subtitle}>
                        Notes are singular observations on robot performance. They are not as comprehensive as scout
                        reports.
                    </Text>
                </View>
            </PressableOpacity>
            <PressableOpacity
                style={styles.item}
                onPress={() => {
                    modal.dismiss();
                    navigation.navigate("App", {
                        screen: "Data",
                        params: { screen: "MatchBetting" },
                    });
                }}
            >
                <View style={styles.icon}>
                    <Bs.CashCoin size="100%" fill={colors.text} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.title}>Match Bet</Text>
                    <Text style={styles.subtitle}>Bet on a match</Text>
                </View>
            </PressableOpacity>
        </View>
    );
}

const getStyles = (colors: Theme["colors"]) =>
    StyleSheet.create({
        item: {
            flex: 1,
            padding: 16,
            flexDirection: "row",
            gap: 16,

            borderBottomWidth: 1,
            borderColor: colors.border,
        },
        icon: {
            backgroundColor: colors.card,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            flex: 1,
            aspectRatio: 1,
        },
        info: {
            flexDirection: "column",
            flex: 6,
        },
        title: {
            color: colors.text,
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 4,
        },
        subtitle: {
            color: colors.text,
            opacity: 0.6,
            fontSize: 14,
        },
    });
