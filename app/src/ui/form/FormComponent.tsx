import { StyleSheet, TextInput, View } from "react-native";
import { FormRadio } from "./components/FormRadio.tsx";
import { FormStepper } from "./components/FormStepper.tsx";
import { FormCheckboxes } from "./components/FormCheckboxes.tsx";
import { Question } from "./Question.tsx";
import { useTheme } from "@react-navigation/native";
import { Form } from "../../lib/forms";
import type { Setter } from "../../lib/react";

export interface FormComponentProps<T extends Form.Item> {
    item: T;
    value: any;
    onInput: Setter<any>;
}
export function FormComponent<T extends Form.Item>({ item, value, onInput }: FormComponentProps<T>) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        textInput: {
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 15,
            padding: 10,
            color: colors.text,
        },
    });

    switch (item.type) {
        case Form.ItemType.radio:
            return (
                <FormRadio
                    disabled={false}
                    title={item.question}
                    required={item.required}
                    options={item.options}
                    value={value}
                    onReset={() => onInput(null)}
                    onInput={(value) => {
                        a[item.idx] = item.options.indexOf(value);
                        setArrayData(a);
                    }}
                />
            );
        case Form.ItemType.textbox:
            return (
                <View key={idx}>
                    <Question
                        title={item.question}
                        required={item.required}
                        onReset={() => {
                            let a = [...arrayData];
                            a[idx] = "";
                            setArrayData(a);
                        }}
                    />
                    <TextInput
                        placeholder={"Type here"}
                        placeholderTextColor={colors.primary}
                        style={styles.textInput}
                        value={(arrayData[item.idx] ?? "") as string}
                        onChangeText={(text) => {
                            let a = [...arrayData];
                            a[item.idx] = text;
                            setArrayData(a);
                        }}
                        multiline={true}
                    />
                </View>
            );
        case Form.ItemType.number:
            return item.slider ? (
                <Slider
                    key={item.idx}
                    min={item.low}
                    max={item.high}
                    step={item.step}
                    question={item.question}
                    minLabel={item.lowLabel}
                    maxLabel={item.highLabel}
                    disabled={false}
                    onValueChange={(newValue) => {
                        let a = [...arrayData];
                        a[item.idx] = newValue;
                        setArrayData(a);
                    }}
                    value={arrayData[item.idx] as number}
                />
            ) : (
                <FormStepper
                    key={item.idx}
                    title={item.question + (item.required ? "*" : "")}
                    value={arrayData[item.idx] as number}
                    onValueChange={(newValue) => {
                        let a = [...arrayData];
                        a[item.idx] = newValue;
                        setArrayData(a);
                    }}
                />
            );
        case Form.ItemType.checkbox:
            return (
                <FormCheckboxes
                    key={item.idx}
                    title={item.question}
                    options={item.options}
                    value={arrayData[item.idx] as string[]}
                    disabled={false}
                    onInput={(value) => {
                        setArrayData((prev) => {
                            const newData = [...prev];
                            newData[item.idx] = value;
                            return newData;
                        });
                    }}
                />
            );
    }
}
