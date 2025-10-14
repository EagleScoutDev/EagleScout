import { type PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { exMemo } from "../../lib/react/util/memo.ts";

export interface FormSectionProps {
    title: string;
}
export function FormSection({ children, title }: PropsWithChildren<FormSectionProps>) {
    const { colors } = useTheme();
    const s = styles(colors);

    return (
        <View style={s.external_area}>
            <View style={s.container}>
                {/* TODO: Display a little green checkmark (like a JUNIT test passing) if all required questions in the section are filled out */}
                <View style={s.header}>
                    <Text style={s.title}>
                        {title}
                    </Text>
                </View>
                {children}
            </View>
        </View>
    );
}

const styles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        container: {
            width: "100%",
            paddingTop: "5%",
            paddingBottom: "3%",
            paddingHorizontal: "5%",
            borderColor: colors.border,
            borderTopWidth: 2,
            borderBottomWidth: 2,
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            color: colors.text,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        external_area: {
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
        },
    })
);
