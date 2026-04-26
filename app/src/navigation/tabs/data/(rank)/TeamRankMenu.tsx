import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { DataTabScreenProps } from "../index";
import { type CompetitionReturnData } from "@/lib/db/models/Competition";
import { Form } from "@/lib/forms";
import { UIList } from "@/ui/components/UIList";
import { UIText } from "@/ui/components/UIText";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

interface Question {
    question: string;
    index: number;
}

export interface TeamRankMenuProps extends DataTabScreenProps<"TeamRank"> {}
export function TeamRankMenu({ navigation }: TeamRankMenuProps) {
    const { data: currentCompetition } = useQuery(queries.competitions.current);
    const { data: allCompetitions = [] } = useQuery({
        ...queries.competitions.all,
        enabled: !currentCompetition,
    });

    const [manualComp, setManualComp] = useState<CompetitionReturnData | null>(null);

    const activeComp = manualComp ?? currentCompetition ?? null;

    const onPress = (index: number, question: string) => {
        if (!activeComp) return;
        navigation.navigate("TeamRank/View", {
            compId: activeComp.id,
            compName: activeComp.name,
            questionIndex: index,
            questionText: question,
        });
    };

    if (!activeComp) {
        return (
            <SafeAreaProvider>
                <UIList>
                    <View style={{ padding: 16, alignItems: "center" }}>
                        <UIText size={20} bold style={{ marginBottom: 8 }}>
                            No Active Competition
                        </UIText>
                        <UIText style={{ textAlign: "center", marginBottom: 16 }}>
                            Please choose which competition you would like to view data for.
                        </UIText>
                    </View>
                    <UIList.Section>
                        {allCompetitions.map((item, i) => (
                            <UIList.Row
                                key={i}
                                label={item.name}
                                onPress={() => setManualComp(item)}
                            />
                        ))}
                    </UIList.Section>
                </UIList>
            </SafeAreaProvider>
        );
    }

    const currForm = activeComp.matchForm.formStructure as Form.Structure;
    const formSections = currForm ? Form.splitSections(currForm) : [];

    return (
        <SafeAreaProvider>
            <UIList>
                <View style={{ padding: 16 }}>
                    <UIText size={24} bold style={{ marginBottom: 8 }}>
                        {activeComp.name}
                    </UIText>
                    <UIText size={12} placeholder>
                        Choose a question to begin.
                    </UIText>
                </View>
                {formSections.map((section, i) => {
                    const items: { item: Form.Question; i: number }[] = [];
                    let currentIndex = section.start + 1;

                    for (const item of section.items) {
                        if (item.type === Form.ItemType.number) {
                            items.push({ item, i: currentIndex });
                        }
                        currentIndex++;
                    }

                    return (
                        <UIList.Section key={i} title={section.title}>
                            {items.map(({ item, i }) => (
                                <UIList.Row
                                    key={i}
                                    label={item.question}
                                    onPress={() => onPress(i, item.question)}
                                />
                            ))}
                        </UIList.Section>
                    );
                })}
            </UIList>
        </SafeAreaProvider>
    );
}
