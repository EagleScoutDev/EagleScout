import { StyleSheet, TextInput, View } from "react-native";
import { Radio } from "./components/Radio.tsx";
import { Stepper } from "./components/Stepper";
import { Checkboxes } from "./components/Checkboxes";
import { Slider } from "./components/Slider.tsx";
import { Question } from "./Question.tsx";
import { useTheme } from "@react-navigation/native";
import { Form } from "../../database/Forms";
import type { Setter } from "../../lib/react";

export interface FormComponentProps<T extends Form.ItemStructure> {
    item: T;
    arrayData: Form.ArrayData<T>;
    setArrayData: Setter<Form.ArrayData<T>>;
}
export function FormComponent<T extends Form.ItemStructure>({ item, arrayData, setArrayData }: FormComponentProps<T>) {
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

    if (!arrayData) return null;

    switch (item.type) {
        case Form.ItemType.radio:
            return (
                <Radio
                    key={item.idx}
                    disabled={false}
                    title={item.question}
                    required={item.required}
                    options={item.options}
                    value={item.options[arrayData[item.idx] as number]}
                    onReset={() => {
                        let a = [...arrayData];
                        a[item.idx] = null;
                        setArrayData(a);
                    }}
                    onValueChange={(value) => {
                        let a = [...arrayData];
                        a[item.idx] = item.options.indexOf(value);
                        setArrayData(a);
                    }}
                />
            );
        case Form.ItemType.textbox:
            return (
                <View key={item.idx}>
                    <Question
                        title={item.question}
                        required={item.required}
                        onReset={() => {
                            let a = [...arrayData];
                            a[item.idx] = "";
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
                <Stepper
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
                <Checkboxes
                    key={item.idx}
                    title={item.question}
                    options={item.options}
                    value={arrayData[item.idx] as string[]}
                    disabled={false}
                    onValueChange={(value) => {
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
