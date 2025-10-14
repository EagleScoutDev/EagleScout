import { type NavigationProp, type Theme, useNavigation, useTheme } from "@react-navigation/native";
import * as Bs from "./ui/icons";
import { exMemo } from "./lib/react/util/memo.ts";
import { PressableOpacity } from "./ui/components/PressableOpacity.tsx";
import { Text, View } from "react-native";
import type { RootStackParamList } from "./App.tsx";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

export interface PlusMenuProps {
    navigation: NavigationProp<RootStackParamList, any>
}
export function PlusMenu({ navigation }: PlusMenuProps) {
    const { colors } = useTheme();
    const s = styles(colors);

    const modal = useBottomSheetModal()

    return (
        <>
            <View style={{ width: "100%" }}>
                <PressableOpacity
                    style={s.item}
                    onPress={() => {
                        modal.dismiss();
                        navigation.navigate("App", {
                            screen: "Home",
                            params: { screen: "Match", initial: false },
                        });
                    }}
                >
                    <View style={s.icon}>
                        <Bs.JournalPlus size="100%" fill={colors.text} />
                    </View>
                    <View style={s.info}>
                        <Text style={s.title}>New Report</Text>
                        <Text style={s.subtitle}>
                            Scouting reports are used to collect data on a robot for a single match.
                        </Text>
                    </View>
                </PressableOpacity>
                <PressableOpacity
                    style={s.item}
                    onPress={() => {
                        modal.dismiss();
                        navigation.navigate("App", {
                            screen: "Home",
                            params: { screen: "Pit", initial: false, params: { screen: "Match" } },
                        });
                    }}
                >
                    <View style={s.icon}>
                        <Bs.Tag size="100%" fill={colors.text} />
                    </View>
                    <View style={s.info}>
                        <Text style={s.title}>Pit Scout</Text>
                        <Text style={s.subtitle}>
                            Pit scouting reports are used to collect data on a robot's capabilities and features.
                        </Text>
                    </View>
                </PressableOpacity>
                <PressableOpacity
                    style={s.item}
                    onPress={() => {
                        modal.dismiss();
                        navigation.navigate("App", {
                            screen: "Home",
                            params: { screen: "Note", initial: false },
                        });
                    }}
                >
                    <View style={s.icon}>
                        <Bs.Sticky size="100%" fill={colors.text} />
                    </View>
                    <View style={s.info}>
                        <Text style={s.title}>New Note</Text>
                        <Text style={s.subtitle}>
                            Notes are singular observations on robot performance. They are not as comprehensive as scout
                            reports.
                        </Text>
                    </View>
                </PressableOpacity>
                <PressableOpacity
                    style={s.item}
                    onPress={() => {
                        modal.dismiss();
                        navigation.navigate("App", {
                            screen: "Data",
                            params: { screen: "MatchBetting" },
                        });
                    }}
                >
                    <View style={s.icon}>
                        <Bs.CashCoin size="100%" fill={colors.text} />
                    </View>
                    <View style={s.info}>
                        <Text style={s.title}>Match Bet</Text>
                        <Text style={s.subtitle}>Bet on a match</Text>
                    </View>
                </PressableOpacity>
            </View>
        </>
    );
};

const styles = exMemo(
    (colors: Theme["colors"]) =>
        ({
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
        } as const)
);
