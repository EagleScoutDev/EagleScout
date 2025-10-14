import { useTheme } from "@react-navigation/native";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { CompetitionsDB } from "../../database/Competitions";
import type { Setter } from "../../lib/react/util/types";

interface QuestionFormulaCreatorProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    chosenQuestionIndices: number[];
    setChosenQuestionIndices: Setter<number[]>;
    compId: number;
}

export function QuestionFormulaCreator({
    visible,
    setVisible,
    chosenQuestionIndices,
    setChosenQuestionIndices,
    compId,
}: QuestionFormulaCreatorProps) {
    const { colors } = useTheme();
    const [form, setForm] = useState<any[]>();

    useEffect(() => {
        setChosenQuestionIndices([]);
    }, []);

    useEffect(() => {
        CompetitionsDB.getCompetitionById(compId).then((comp) => {
            setForm(comp.form);
        });
    }, [compId]);

    return (
        <Modal
            presentationStyle={"pageSheet"}
            visible={visible}
            animationType={"slide"}
            onRequestClose={() => {
                if (chosenQuestionIndices.length === 0) {
                    setVisible(false);
                }
            }}
        >
            <View style={{ backgroundColor: colors.card, flex: 1 }}>
                <Text
                    style={{
                        color: colors.text,
                        textAlign: "center",
                        fontSize: 20,
                        marginTop: "4%",
                    }}
                >
                    Choose Questions
                </Text>
                {chosenQuestionIndices.length > 0 && (
                    <Pressable
                        style={{ position: "absolute", right: "4%", top: "2%" }}
                        onPress={() => {
                            console.log("saving");
                            setVisible(false);
                        }}
                    >
                        <Text
                            style={{
                                color: colors.primary,
                                fontWeight: "bold",
                                textAlign: "center",
                                fontSize: 16,
                            }}
                        >
                            Save
                        </Text>
                    </Pressable>
                )}
                {chosenQuestionIndices.length === 0 ? (
                    <Text
                        style={{
                            color: "gray",
                            textAlign: "center",
                            fontSize: 16,
                            marginTop: "1%",
                            marginBottom: "2%",
                        }}
                    >
                        Pick at least one to get started.
                    </Text>
                ) : (
                    <View style={{ marginVertical: "4%" }} />
                )}
                {/*{form !== undefined && (*/}
                {/*<Text*/}
                {/*  style={{color: colors.text, fontSize: 16, marginHorizontal: '4%'}}>*/}
                {/*  {form !== undefined ? form.length : -1} questions*/}
                {/*</Text>*/}
                <FlatList
                    data={form}
                    renderItem={({ item, index }) => {
                        if (item.type === "heading") {
                            return (
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        marginVertical: "4%",
                                        marginLeft: "4%",
                                    }}
                                    key={index}
                                >
                                    {item.title}
                                </Text>
                            );
                        }
                        if (item.type === "number") {
                            return (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        marginVertical: "1%",
                                        alignItems: "center",
                                        marginHorizontal: "4%",
                                    }}
                                >
                                    <BouncyCheckbox
                                        fillColor={colors.primary}
                                        text={item.question}
                                        isChecked={chosenQuestionIndices.includes(index)}
                                        textStyle={{
                                            color: colors.text,
                                            textDecorationLine: "none",
                                        }}
                                        onPress={(isChecked) => {
                                            if (isChecked) {
                                                setChosenQuestionIndices([...chosenQuestionIndices, index]);
                                            } else {
                                                setChosenQuestionIndices(
                                                    chosenQuestionIndices.filter((i) => i !== index)
                                                );
                                            }
                                        }}
                                    />
                                </View>
                            );
                        }
                        return null;
                    }}
                />
                {/*)}*/}
            </View>
        </Modal>
    );
}
