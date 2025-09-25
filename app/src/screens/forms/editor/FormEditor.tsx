import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FormCreationTopBar } from "./FormCreationTopBar.tsx";
import type { FormsMenuScreenProps } from "../ManageForms.tsx";
import { FormsDB } from "../../../database/Forms.ts";
import { Form } from "../../../lib/forms";
import * as Bs from "../../../ui/icons";
import { FormPalette } from "./FormPalette.tsx";
import { exMemo } from "../../../lib/react";
import ItemType = Form.ItemType;

export interface FormEditorParams {
    form: Form | null;
}
export interface FormEditorProps extends FormsMenuScreenProps<"Edit"> {}
export function FormEditor({ route, navigation }: FormEditorProps) {
    const { form } = route.params;
    const { colors } = useTheme();
    const s = styles(colors);
    const [questions, setQuestions] = useState<Form.Structure>([]);
    const [pitScoutingForm, setPitScoutingForm] = useState(false);

    useEffect(() => {
        if (form) setQuestions(form.formStructure);
    }, []);

    const onFormSubmit = (name) => {
        (async () => {
            let success = true;
            try {
                await FormsDB.addForm({
                    name: name,
                    formStructure: questions,
                    pitScouting: pitScoutingForm,
                });
            } catch (e) {
                success = false;
                console.error(e);
                Alert.alert("Error", "Failed to add form");
            }
            if (success) {
                Alert.alert("Success", "Form added successfully!");
                setQuestions([]);
                navigation.navigate("List");
            }
        })();
    };

    const onFormCancel = () => {
        setQuestions([]);
        navigation.navigate("List");
    };

    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <FormCreationTopBar onSubmit={onFormSubmit} onCancel={onFormCancel} questions={questions} />

            <View
                style={{
                    backgroundColor: colors.background,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: "5%",
                }}
            >
                <Text style={{ color: colors.text, fontSize: 16, marginRight: "auto" }}>
                    Is this a pit scouting form?
                </Text>
                <Switch value={pitScoutingForm} onValueChange={setPitScoutingForm} />
            </View>

            <ScrollView contentContainerStyle={s.canvas}>
                {questions.map((question, i) => (
                    <View key={i} style={s.component}>
                        <Text>{question.title}</Text>
                    </View>
                ))}
            </ScrollView>

            <FormPalette
                options={[
                    { key: "heading", icon: Bs.CardHeading, name: "Heading", desc: "Specify a title and description" },
                    // { key: , icon: Bs.CardImage, name: "Image" },
                    { key: "radio", icon: Bs.UiRadios, name: "Multiple Choice", desc: "Choose one option of many" },
                    { key: "checks", icon: Bs.Toggles, name: "Checkboxes", desc: "Series of checkboxes" },
                    { key: "number", icon: Bs.OneTwoThree, name: "Number", desc: "Numpad input" },
                    { key: "slider", icon: Bs.Sliders, name: "Slider", desc: "Slider input" },
                    { key: "textbox", icon: Bs.InputCursorText, name: "Short Answer", desc: "Single line textbox" },
                    { key: "textarea", icon: Bs.BodyText, name: "Long Answer", desc: "Arbitrarily long textarea" },
                    // { key: , icon: Bs.Images, name: "Image Upload" },
                ]}
                onPress={(key) => {
                    switch (key) {
                        case "heading":
                            setQuestions([...questions, { type: ItemType.heading, title: "", description: "" }]);
                    }
                }}
            />
        </View>
    );
}

const styles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        canvas: {
            flexDirection: "column",
            padding: 10,
            gap: 10,
        },
        component: {
            width: "100%",
            height: 90,
            borderRadius: 10,
            backgroundColor: colors.background,
        },
    })
);
