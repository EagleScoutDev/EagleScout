import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import React from "react";

export interface TabHeaderProps {
    title: string;
    description?: string;
}
export function TabHeader({ title, description }: TabHeaderProps) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 8, paddingHorizontal: 30 }}>
            <Text
                style={{
                    fontSize: 34,
                    fontWeight: "600",
                    color: colors.text,
                    marginTop: 30,
                }}
            >
                {title}
            </Text>
            {description && (
                <Text
                    style={{
                        fontSize: 16,
                        color: colors.text,
                        marginTop: 6,
                    }}
                >
                    {description}
                </Text>
            )}
        </View>
    );
}
