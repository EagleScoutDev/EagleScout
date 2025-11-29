import { Pressable, StyleSheet, View } from "react-native";
import { UIText } from "../ui/UIText";
import { type Theme, useTheme } from "@react-navigation/native";

export interface UITabsProps {
    tabs: string[];
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}
export function UITabs({ tabs, selectedTab, setSelectedTab }: UITabsProps) {
    "use memo";
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <Pressable
                    key={tab}
                    onPress={() => setSelectedTab(tab)}
                    style={[styles.baseTab, selectedTab === tab ? styles.selected_tab : styles.tab]}
                >
                    <UIText style={selectedTab === tab ? styles.selected_tab_text : styles.tab_text}>{tab}</UIText>
                </Pressable>
            ))}
        </View>
    );
}

const getStyles = (colors: Theme["colors"]) =>
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
    });
