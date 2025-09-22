import { useState, type PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { exMemo } from "../../lib/react";

export interface FormSectionProps {
    title: string | null;
    disabled?: boolean;
}

export function FormSection({ children, title, disabled = false }: PropsWithChildren<FormSectionProps>) {
    const { colors } = useTheme();
    const s = styles(colors);

    const [visible, setVisible] = useState(true);

    return (
        <View style={s.external_area}>
            <View style={s.container}>
                {/*TODO: Display a little green checkmark (like a JUNIT test passing) if all required questions in the section are filled out*/}
                <View style={s.header}>
                    {title !== null && (
                        <Text
                            style={s.title}
                            disabled={disabled}
                            onPress={() => {
                                if (disabled) return;
                                setVisible(!visible);
                            }}
                        >
                            {title}
                        </Text>
                    )}
                </View>
                {visible && children}
            </View>
        </View>
    );
}

const styles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        container: {
            paddingTop: "5%",
            paddingBottom: "3%",
            width: "100%",
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
            // marginVertical: '3%',
        },
    })
);
