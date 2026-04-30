import { View } from "react-native";
import { UIText } from "@/ui/components/UIText";
import React from "react";
import { useCurrentCompetition } from "@/lib/stores/currentComp";
import * as Bs from "@/ui/icons"

export interface TabHeaderProps {
    title: string;
    description?: string;
}
export function TabHeader({ title, description }: TabHeaderProps) {
    const { online } = useCurrentCompetition(false);
    console.log("online?", online);
    return (
        <View style={{ marginBottom: 8, paddingHorizontal: 30 }}>
            <View style={{ flexDirection: "row", marginTop: 30, alignItems: "center" }}>
                <Bs.CloudSlash size={30} fill={"#292929"}></Bs.CloudSlash>
                <UIText size={34} bold style={{ marginLeft: 16}}>
                    {title}
                </UIText>
            </View>
            {description && (
                <UIText size={16} style={{ marginTop: 6 }}>
                    {description}
                </UIText>
            )}
        </View>
    );
}
