import { Pressable, StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { exMemo } from "../lib/react/util/memo.ts";

export const UITabs = ({
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
                    key={tab}
                    onPress={() => setSelectedTab(tab)}
                    style={[s.baseTab, selectedTab === tab ? s.selected_tab : s.tab]}
                >
                    <Text style={selectedTab === tab ? s.selected_tab_text : s.tab_text}>{tab}</Text>
                </Pressable>
            ))}
        </View>
    );
};

const styles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            paddingVertical: "2%",
            paddingHorizontal: "5%",
        },
        baseTab: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "2%",
            borderRadius: 10,
        },
        tab: {
            backgroundColor: colors.background,
        },
        tab_text: {
            color: colors.text,
            fontWeight: "normal",
        },
        selected_tab: {
            backgroundColor: colors.text,
        },
        selected_tab_text: {
            color: colors.background,
            fontWeight: "bold",
        },
    })
);
