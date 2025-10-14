import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import React from "react";

export const TabHeader = ({ title, description }: { title: string; description?: string }) => {
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
};
