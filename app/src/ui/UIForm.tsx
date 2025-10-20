import { UIList, type UIListProps } from "./UIList.tsx";
import { Platform, Switch as RNSwitch, Text } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { NumberInput as RNNumberInput } from "./components/NumberInput.tsx";
import { UIListPicker } from "./input/UIListPicker.tsx";
import type { Color } from "../lib/color.ts";
import { AutoTextInput } from "./components/AutoTextInput.tsx";

export interface UIFormProps extends UIListProps {}

/**
 * iOS-style inset form builder
 */
export function UIForm({ ...props }: UIFormProps) {
    return <UIList {...props} />;
}
export namespace UIForm {
    export interface SectionProps extends UIList.SectionProps {}
    export function Section(props: SectionProps) {
        return UIList.Section(props);
    }

    export interface ItemProps extends UIList.LineProps {}
    export function Item(props: ItemProps) {
        return UIList.Line(props);
    }

    export interface TextInputProps {
        key?: string;
        label: string;
        secure?: boolean;

        value?: string | null | undefined;
        onChange?: ((value: string) => void) | null | undefined;
    }
    export function TextInput({ key, label, secure = false, value, onChange }: TextInputProps) {
        "use memo";
        return Item({
            key,
            body: () => (
                <AutoTextInput
                    style={{ height: "100%", fontSize: 16, flex: 1 }}
                    placeholder={label}
                    placeholderTextColor={"gray"}
                    value={value ?? undefined}
                    onChangeText={onChange ?? undefined}
                    secureTextEntry={secure}
                />
            ),
        });
    }

    export interface NumberInputProps {
        key?: string;
        label: string;

        value: number;
        onChange?: ((value: number) => void) | undefined;
    }
    export function NumberInput({ key, label, value, onChange }: NumberInputProps) {
        "use memo";
        return Item({
            key,
            label,
            body: () => (
                <RNNumberInput
                    style={{ height: "100%", fontSize: 16, flex: 1, textAlign: "right" }}
                    value={value}
                    onInput={onChange}
                />
            ),
        });
    }

    export interface DateTimeProps {
        key?: string;
        label: string;
        date?: boolean;
        time?: boolean;

        value?: Date | undefined;
        onChange?: ((value: Date) => void) | undefined;
    }
    export function DateTime({ key, label, date = true, time = true, value, onChange }: DateTimeProps) {
        "use memo";

        // FIXME: fold into value prop once React Compiler implements
        //        "Support destructuring of context variables"
        let v = value ?? new Date();

        if (Platform.OS === "ios") {
            return Item({
                key,
                label,
                body: () => (
                    <RNDateTimePicker
                        mode={date && time ? "datetime" : date ? "date" : time ? "time" : "datetime"}
                        value={v}
                        onChange={(_, value) => onChange && onChange(v)}
                    />
                ),
            });
        }
    }

    export interface SelectProps<T extends string = string> {
        key?: string;
        label: string;
        options: { key: T; name: string }[];
        value: T | null;
        onChange?: (value: T) => void;
    }
    export function Select<T extends string = string>({ key, label, options, value, onChange }: SelectProps<T>) {
        "use memo";
        // TODO: implement this
        throw new Error("Not implemented")
    }

    export interface ListPickerProps<K extends string | number = string | number> {
        key?: string;
        label: string;

        title?: string;
        options: K[];
        render: (key: K) => { name: string };

        value: K | null;
        onChange?: (value: K) => void;
    }
    export function ListPicker<K extends string | number = string | number>({
        key,
        label,
        title = label,
        options,
        render,
        value,
        onChange,
    }: ListPickerProps<K>) {
        "use no memo";
        // FIXME: Try reenabling memoization

        return Item({
            key,
            label,
            body: () => (
                <UIListPicker<K> value={value} onChange={onChange} title={title} options={options} render={render} />
            ),
        });
    }

    export interface SwitchProps {
        key?: string;
        label: string;

        value: boolean;
        onChange?: ((value: boolean) => void) | undefined;
    }
    export function Switch({ key, label, value, onChange }: SwitchProps) {
        "use memo";
        return Item({
            key,
            label,
            body: () => <RNSwitch value={value} onValueChange={onChange} />,
        });
    }

    export interface ButtonProps {
        key?: string;
        label: string;
        color: Color;

        onPress?: () => void | undefined;
        onLongPress?: () => void | undefined;
    }
    export function Button({ key, label, color, onPress, onLongPress }: ButtonProps) {
        "use memo";
        return Item({
            key,
            onPress,
            onLongPress,
            body: () => <Text style={{ flex: 1, fontSize: 16, color: color.rgba }}>{label}</Text>,
        });
    }
}
