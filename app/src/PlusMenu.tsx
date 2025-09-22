import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { isTablet } from "./lib/deviceType";
import { type RootStackScreenProps } from "./App";
import * as Bs from "./ui/icons";
import { exMemo } from "./lib/react";

interface PlusMenuProps extends RootStackScreenProps<"PlusMenu"> {}
export const PlusMenu = ({ route, navigation }: PlusMenuProps) => {
    const { colors } = useTheme();
    const s = styles(colors);

    return (
        <>
            <Pressable
                onPress={() => {
                    navigation.pop();
                }}
                style={{
                    backgroundColor: "grey",
                    // make the blue part semi-transparent
                    minHeight: "100%",
                    maxHeight: "100%",
                    opacity: 0.4,
                    // z stack so it is in the back
                    zIndex: -1,
                }}
            />
            <View style={s.container}>
                <TouchableOpacity
                    style={s.grouping}
                    onPress={() => {
                        navigation.pop();
                        navigation.replace("App", {
                            screen: "Home",
                            params: { screen: "Match", initial: false },
                        });
                    }}
                >
                    <View style={s.icon_box}>
                        <Bs.JournalPlus size="100%" fill={colors.text} />
                    </View>
                    <View style={s.text_container}>
                        <Text style={s.title_text}>New Report</Text>
                        <Text style={s.subtitle_text}>
                            Scouting reports are used to collect data on a robot for a single match.
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s.grouping}
                    onPress={() => {
                        navigation.pop();
                        navigation.replace("App", {
                            screen: "Home",
                            params: { screen: "Pit", initial: false, params: { screen: "Match" } },
                        });
                    }}
                >
                    <View style={s.icon_box}>
                        <Bs.Tag size="100%" fill={colors.text} />
                    </View>
                    <View style={s.text_container}>
                        <Text style={s.title_text}>Pit Scout</Text>
                        <Text style={s.subtitle_text}>
                            Pit scouting reports are used to collect data on a robot's capabilities and features.
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s.grouping}
                    onPress={() => {
                        navigation.pop();
                        navigation.replace("App", {
                            screen: "Home",
                            params: { screen: "Note", initial: false },
                        });
                    }}
                >
                    <View style={s.icon_box}>
                        <Bs.Sticky size="100%" fill={colors.text} />
                    </View>
                    <View style={s.text_container}>
                        <Text style={s.title_text}>New Note</Text>
                        <Text style={s.subtitle_text}>
                            Notes are singular observations on robot performance. They are not as comprehensive as scout
                            reports.
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s.grouping}
                    onPress={() => {
                        navigation.pop();
                        navigation.navigate("App", {
                            screen: "Data",
                            params: { screen: "MatchBetting" }
                        });
                    }}
                >
                    <View style={s.icon_box}>
                        <Bs.CashCoin size="100%" fill={colors.text} />
                    </View>
                    <View style={s.text_container}>
                        <Text style={s.title_text}>Match Bet</Text>
                        <Text style={s.subtitle_text}>Bet on a match</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = exMemo((colors: Theme["colors"]) => ({
    container: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: colors.background,
        paddingBottom: "10%",
        flexDirection: isTablet() ? "row" : "column",
    },
    title_text: {
        color: colors.text,
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle_text: {
        color: colors.text,
        opacity: 0.6,
        fontSize: 14,
    },
    grouping: {
        flexDirection: isTablet() ? "column" : "row",
        backgroundColor: colors.background,
        justifyContent: isTablet() ? "space-between" : "flex-start",
        borderBottomWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: "5%",
        margin: "1%",
        flex: 1,
    },
    icon_box: {
        backgroundColor: colors.card,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: isTablet() ? "0%" : "4%",
        padding: isTablet() ? "4%" : "6%",
        marginRight: isTablet() ? "0%" : "4%",
        flex: 1,
        aspectRatio: 1,
        alignSelf: isTablet() ? "auto" : "center",
        marginBottom: isTablet() ? 30 : "0%",
    },
    text_container: {
        flexDirection: "column",
        flex: 6,
    },
} as const));
