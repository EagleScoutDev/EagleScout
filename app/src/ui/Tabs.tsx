import { Pressable, StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { exMemo } from "../lib/react";

export const Tabs = ({
    tabs,
    selectedTab,
    setSelectedTab,
}: {
    tabs: string[];
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}) => {
    const { colors } = useTheme();
    const s = styles(colors);

    return (
        <View style={s.container}>
            {tabs.map((tab) => (
                <Pressable
                    onPress={() => {
                        setSelectedTab(tab);
                    }}
                    style={selectedTab === tab ? s.selected_tab : s.tab}
                >
                    <Text style={selectedTab === tab ? s.selected_tab_text : s.tab_text}>{tab}</Text>
                </Pressable>
            ))}
        </View>
    );
};

const baseTabStyle = {
    flexDirection: "row",
    alignItems: "center",
    padding: "2%",
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
} as const
const styles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            paddingVertical: "2%",
            paddingHorizontal: "5%",
        },
        tab: {
            ...baseTabStyle,
            backgroundColor: colors.background,
        },
        tab_text: {
            color: colors.text,
            fontWeight: "normal",
        },
        selected_tab: {
            ...baseTabStyle,
            backgroundColor: colors.text,
        },
        selected_tab_text: {
            color: colors.background,
            fontWeight: "bold",
        },
    })
);
