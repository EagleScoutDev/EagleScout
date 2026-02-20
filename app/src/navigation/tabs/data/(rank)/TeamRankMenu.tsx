import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { DataTabScreenProps } from "../index";
import { type CompetitionReturnData, CompetitionsDB } from "@/lib/database/Competitions";
import { Form } from "@/lib/forms";
import { UIList } from "@/ui/components/UIList";
import { UIText } from "@/ui/components/UIText";
import { UISectionList } from "@/ui/components/UISectionList";

interface Question {
    question: string;
    index: number;
}

export interface TeamRankMenuProps extends DataTabScreenProps<"TeamRank"> {}
export function TeamRankMenu({ navigation }: TeamRankMenuProps) {
    // competition form
    const [currForm, setCurrForm] = useState<Form.Structure>();

    // used to get data for the competition
    const [compID, setCompID] = useState<number>();

    const [compName, setCompName] = useState<string>();

    const [noActiveCompetition, setNoActiveCompetition] = useState<boolean>(false);

    const [fullCompetitionsList, setFullCompetitionsList] = useState<CompetitionReturnData[]>([]);

    useEffect(() => {
        CompetitionsDB.getCurrentCompetition().then((competition) => {
            if (!competition) {
                setNoActiveCompetition(true);
                CompetitionsDB.getCompetitions().then((c) => {
                    setFullCompetitionsList(c);
                });
                return;
            }

            setCurrForm(competition.form as Form.Structure);
            setCompID(competition.id);
            setCompName(competition.name);
        });
    }, []);

    const onPress = (index: number, question: string) => {
        if (!compID) return;
        const payload: Question & { compId: number; compName?: string | undefined } = {
            index,
            question,
            compId: compID,
            compName: compName,
        };
        navigation.navigate("TeamRank/View", {
            compId: payload.compId,
            compName: payload.compName,
            questionIndex: payload.index,
            questionText: payload.question,
        });
    };

    if (noActiveCompetition) {
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
                        {fullCompetitionsList.map((item, i) => (
                            <UIList.Label
                                key={i}
                                label={item.name}
                                onPress={() => {
                                    setNoActiveCompetition(false);
                                    setCurrForm(item.form as Form.Structure);
                                    setCompID(item.id);
                                    setCompName(item.name);
                                }}
                            />
                        ))}
                    </UIList.Section>
                </UIList>
            </SafeAreaProvider>
        );
    }

    const formSections = currForm ? Form.splitSections(currForm) : [];

    return (
        <SafeAreaProvider>
            <UIList>
                <View style={{ padding: 16 }}>
                    <UIText size={24} bold style={{ marginBottom: 8 }}>
                        {compName ? compName : "No Competition Selected"}
                    </UIText>
                    <UIText size={12} placeholder>
                        Choose a question to begin.
                    </UIText>
                </View>
                {formSections.map((section, i) => {
                    const items: { item: Form.Question; i: number }[] = [];
                    let currentIndex = section.start + 1; // Start after the heading

                    for (const item of section.items) {
                        if (item.type === Form.ItemType.number) {
                            items.push({ item, i: currentIndex });
                        }
                        currentIndex++;
                    }

                    return (
                        <UIList.Section key={i} title={section.title}>
                            {items.map(({ item, i }) => (
                                <UIList.Label
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
