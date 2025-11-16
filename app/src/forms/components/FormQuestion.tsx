import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { type PropsWithChildren } from "react";
import type { Icon } from "../../ui/icons";

export interface FormQuestionProps {
    icon?: Icon | null;
    title: string;
    required?: boolean;
    inline?: boolean;
}
export function FormQuestion({
    icon,
    title,
    required = false,
    inline = false,
    children,
}: PropsWithChildren<FormQuestionProps>) {
    "use memo";
    const { colors } = useTheme();

    return (
        <View style={inline ? { flex: 1, flexDirection: "row", alignItems: "center" } : undefined}>
            <View style={{ flexDirection: "row" }}>
                {icon && icon({ size: 18, fill: colors.primary, style: { marginRight: 10 } })}
                <Text
                    style={{
                        textAlign: "left",
                        fontSize: 16,
                        fontWeight: 500,
                        color: colors.text,
                    }}
                >
                    {title}
                    {required && <Text style={{ color: colors.notification }}>*</Text>}
                </Text>
            </View>

            {children && inline ? children : <View style={{ marginTop: 6 }}>{children}</View>}
        </View>
    );
}
