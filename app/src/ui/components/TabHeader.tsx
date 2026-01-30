import { View } from "react-native";
import { UIText } from "@/ui/components/UIText";
import React from "react";

export interface TabHeaderProps {
    title: string;
    description?: string;
}
export function TabHeader({ title, description }: TabHeaderProps) {
    return (
        <View style={{ marginBottom: 8, paddingHorizontal: 30 }}>
            <UIText size={34} bold style={{ marginTop: 30 }}>
                {title}
            </UIText>
            {description && (
                <UIText size={16} style={{ marginTop: 6 }}>
                    {description}
                </UIText>
            )}
        </View>
    );
}
