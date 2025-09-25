import { StandardModal } from "../../../../components/modals/StandardModal.tsx";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, type default as React, useState } from "react";
import { StandardButton } from "../../../../ui/StandardButton.tsx";
import { useTheme } from "@react-navigation/native";
import { NewQuestionSeparator } from "../NewQuestionSeparator.tsx";
import type { Setter } from "../../../../lib/react";
import { Form } from "../../../../lib/forms";

function Spacer() {
    return <View style={{ height: "2%" }} />;
}

export interface FormCheckboxesProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    onSubmit: (value: Form.Checkboxes) => void;
    value: Form.Checkboxes;
    styles: StyleSheet.NamedStyles<any>;
}
export function FormCheckboxes({ visible, setVisible, styles, onSubmit, value }: CheckboxesProps) {
    const { colors } = useTheme();
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<string[]>([]);

    const [addOptionModalVisible, setAddOptionModalVisible] = useState(false);
    const [setIndex, setSetIndex] = useState(0);
    const [optionText, setOptionText] = useState("");

    useEffect(() => {
        if (value && value.type === "checkbox") {
            setQuestion(value.question);
            setOptions(value.options);
        }
    }, [value]);

    const submit = () => {
        if (question === "") {
            Alert.alert("Please enter a question");
            return false;
        }
        onSubmit({
            type: Form.ItemType.checkbox,
            question,
            options,
        });
        return true;
    };

    return (
        <StandardModal
            title="New FormCheckboxes Question"
            visible={visible}
            onDismiss={() => {
                setVisible(false);
            }}
        >
            <Text style={styles.label}>Question</Text>
            <Spacer />
            <TextInput
                style={styles.textInput}
                placeholder="Question"
                onChangeText={(text) => setQuestion(text)}
                value={question}
            />
            <Text style={{ color: colors.text }}>
                Click '+' to add a new checkbox option. To delete an option, long press on it.
            </Text>
            <Spacer />
            <Text style={styles.label}>Options:</Text>
            <ScrollView
                style={{
                    maxHeight: "70%",
                    width: "100%",
                }}
                onStartShouldSetResponder={() => true}
            >
                {options.map((option, index) => {
                    return (
                        <View key={index}>
                            <TouchableOpacity>
                                <NewQuestionSeparator
                                    onPress={() => {
                                        setSetIndex(index);
                                        setAddOptionModalVisible(true);
                                    }}
                                    noDividerLine
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onLongPress={() => {
                                    setOptions(options.filter((_, i) => i !== index));
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        textAlign: "center",
                                        color: colors.text,
                                    }}
                                >
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
                <TouchableOpacity>
                    <NewQuestionSeparator
                        onPress={() => {
                            setSetIndex(options.length);
                            setAddOptionModalVisible(true);
                        }}
                        noDividerLine
                    />
                </TouchableOpacity>
            </ScrollView>
            <StandardModal
                title={"New Option"}
                visible={addOptionModalVisible}
                onDismiss={() => {
                    setVisible(false);
                }}
            >
                <Spacer />
                <Text style={styles.label}>Option</Text>
                <Spacer />
                <TextInput
                    style={styles.textInput}
                    placeholder="Option"
                    onChangeText={(text) => setOptionText(text)}
                    value={optionText}
                />
                <Spacer />
                <StandardButton
                    text={"Submit"}
                    onPress={() => {
                        setOptions([...options.slice(0, setIndex), optionText, ...options.slice(setIndex)]);
                        setOptionText("");
                        setAddOptionModalVisible(false);
                    }}
                    color={colors.primary}
                />
                <StandardButton
                    text={"Cancel"}
                    onPress={() => {
                        setOptionText("");
                        setAddOptionModalVisible(false);
                    }}
                    color={colors.notification}
                />
            </StandardModal>
            <Spacer />
            <StandardButton
                text={"Submit"}
                onPress={() => {
                    setVisible(!submit());
                }}
                color={colors.primary}
            />
            <StandardButton
                text={"Cancel"}
                onPress={() => {
                    setVisible(false);
                }}
                color={colors.notification}
            />
        </StandardModal>
    );
}
