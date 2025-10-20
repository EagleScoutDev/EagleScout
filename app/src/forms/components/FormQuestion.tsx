import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { type PropsWithChildren } from "react";
import type { Icon } from "../../ui/icons";

export interface FormQuestionProps {
    icon?: Icon | null;
    title: string;
    required?: boolean;
}
export function FormQuestion({ icon, title, required = false, children }: PropsWithChildren<FormQuestionProps>) {
    "use memo";
    const { colors } = useTheme();

    return (
        <View>
            <View style={{ flexDirection: "row" }}>
                {icon && icon({ size: 20, fill: colors.primary, style: { marginRight: 10 } })}
                <Text
                    style={{
                        textAlign: "left",
                        fontSize: 18,
                        fontWeight: 500,
                        color: colors.text,
                    }}
                >
                    {title}
                    {required && <Text style={{ color: colors.notification }}>*</Text>}
                </Text>
            </View>

            {children && <View style={{ marginTop: 8 }}>{children}</View>}
        </View>
    );
}
