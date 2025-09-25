import { ScrollView, StyleSheet, Text } from "react-native";
import type { FormsMenuScreenProps } from "../ManageForms.tsx";

export interface FormViewBaseParmas {
    questions: unknown[];
}
export interface FormViewEditParams extends FormViewBaseParmas {
    mode: "edit";
    setQuestions: (questions: unknown[]) => void;
}
export interface FormViewRespondParams extends FormViewBaseParmas {
    mode: "respond";
    answers: unknown[];
    setQuestions: (questions: unknown[]) => void;
}
export type FormViewerParams = FormViewEditParams;
export interface FormViewerProps extends FormsMenuScreenProps<"View"> {}
export function FormViewer({ route }: FormViewerProps) {
    const { questions } = route.params;

    const styles = StyleSheet.create({
        mainText: {
            fontSize: 20,
            paddingTop: 10,
            paddingLeft: 20,
            paddingBottom: 5,
        },
    });

    return (
        <>
            <Text style={styles.mainText}>Questions:</Text>
            <ScrollView>
                {questions.map((question) => {
                    return (
                        <>
                            {question.type === "heading" && <HeadingBuilder question={question} />}
                            {question.type === "radio" && <RadioBuilder question={question} />}
                            {question.type === "number" && <SliderBuilder question={question} />}
                            {question.type === "textbox" && <TextboxBuilder question={question} />}
                            {question.type === "checkboxes" && <CheckboxesBuilder question={question} />}
                        </>
                    );
                })}
            </ScrollView>
        </>
    );
}
