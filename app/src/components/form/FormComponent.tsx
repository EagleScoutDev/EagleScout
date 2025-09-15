import { StyleSheet, TextInput, View } from 'react-native';
import { RadioButtons } from './RadioButtons';
import React, { type SetStateAction } from 'react';
import { Stepper } from './Stepper';
import { Checkboxes } from './Checkboxes';
import { SliderType } from './SliderType';
import { Question } from './Question';
import { useTheme } from '@react-navigation/native';
import { Form } from '../../database/Forms';

export interface FormComponentProps<T extends Form.ItemStructure> {
    item: T
    arrayData: Form.ArrayData<T>
    setArrayData: React.Dispatch<SetStateAction<Form.ArrayData<T>>>
}

/**
 * A component that renders the appropriate data input type based on a string passed in.
 * @param item -
 * @param arrayData - an array containing the raw data per question
 * @param setArrayData - a function to update the above array
 * @returns {JSX.Element|null} the JSX component
 * @constructor
 */
export function FormComponent<T extends Form.ItemStructure>({ item, arrayData, setArrayData }: FormComponentProps<T>) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        textInput: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 15,
            padding: 10,
            color: colors.text,
        },
    });

    if(!arrayData) return null;

    switch(item.type) {
        case Form.ItemType.radio: return (
            <View key={item.idx}>
                <RadioButtons
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
                    onValueChange={value => {
                        let a = [...arrayData];
                        a[item.idx] = item.options.indexOf(value);
                        setArrayData(a);
                    }}
                />
            </View>
        );
        case Form.ItemType.textbox: return (
            <View key={item.idx}>
                <Question
                    title={item.question}
                    required={item.required}
                    onReset={() => {
                        let a = [...arrayData];
                        a[item.idx] = '';
                        setArrayData(a);
                    }}
                />
                <TextInput
                    placeholder={'Type here'}
                    placeholderTextColor={colors.primary}
                    style={styles.textInput}
                    value={(arrayData[item.idx] ?? "") as string}
                    onChangeText={text => {
                        let a = [...arrayData];
                        a[item.idx] = text;
                        setArrayData(a);
                    }}
                    multiline={true}
                />
            </View>
        );
        case Form.ItemType.number:
            return item.slider
                ? <SliderType
                    key={item.idx}

                    min={item.low}
                    max={item.high}
                    step={item.step}
                    question={item.question}
                    minLabel={item.lowLabel}
                    maxLabel={item.highLabel}
                    disabled={false}

                    onValueChange={newValue => {
                        let a = [...arrayData];
                        a[item.idx] = newValue;
                        console.log(a);
                        setArrayData(a);
                    }}
                    value={arrayData[item.idx] as number}
                />
                : <Stepper
                    key={item.idx}

                    title={item.question + (item.required ? '*' : '')}
                    value={arrayData[item.idx] as number}
                    onValueChange={newValue => {
                        let a = [...arrayData];
                        a[item.idx] = newValue;
                        setArrayData(a);
                    }}
                />
        case Form.ItemType.checkbox: return (
            <Checkboxes
                key={item.idx}
                title={item.question}
                options={item.options}
                value={arrayData[item.idx] as string[]}
                disabled={false}
                onValueChange={value => {
                    setArrayData(prev => {
                        const newData = [...prev];
                        newData[item.idx] = value;
                        return newData;
                    });
                }}
            />
        );
    }
}
