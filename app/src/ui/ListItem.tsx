import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type JSX } from "react";
import { isTablet } from "../lib/deviceType";
import * as Bs from "./icons";
import { exMemo } from "../lib/react";
import { type Theme, useTheme } from "@react-navigation/native";

interface ListItemProps {
    icon?: JSX.Element | null | undefined;
    text: string;
    caret: boolean;
    disabled: boolean;
    onPress: () => void;
}

export const ListItem = ({ text, onPress, caret = true, disabled = false, icon = null }: ListItemProps) => {
    const s = styles(useTheme());

    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={s.list_item}>
            {icon && <View style={s.icon}>{icon}</View>}
            <Text style={disabled ? s.disabled_text : s.text}>{text}</Text>
            {caret && <Bs.ChevronRight size="16" style={s.caret} />}
        </TouchableOpacity>
    );
};

const styles = exMemo(({ colors }: Theme) =>
    StyleSheet.create({
        list_item: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            padding: isTablet() ? 20 : 16,
            backgroundColor: colors.card,
        },
        text: {
            fontSize: 15,
            fontWeight: 600,
            color: colors.text,
        },
        disabled_text: {
            fontSize: 15,
            fontWeight: 600,
            color: "gray",
        },
        icon: {
            paddingRight: 16,
        },
        caret: {
            marginLeft: "auto",
        },
    })
);
