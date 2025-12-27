import { View } from "react-native";
import { type PropsWithChildren } from "react";
import type { Icon } from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";

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
    const { colors } = useTheme();

    return (
        <View style={inline ? { flex: 1, flexDirection: "row", alignItems: "center" } : undefined}>
            <View style={{ flexDirection: "row" }}>
                {icon && icon({ size: 18, color: colors.primary.hex, style: { marginRight: 10 } })}
                <UIText size={16} bold style={{ textAlign: "left" }}>
                    {title}
                    {required && <UIText color={colors.danger}>*</UIText>}
                </UIText>
            </View>

            {children && inline ? children : <View style={{ marginTop: 6 }}>{children}</View>}
        </View>
    );
}
