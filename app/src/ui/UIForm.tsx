import { UIList, type UIListProps } from "./UIList.tsx";
import { Platform, Text, View, Switch as RNSwitch } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { NumberInput as RNNumberInput } from "./components/NumberInput.tsx";
import { UISelect } from "./input/UISelect.tsx";
import type { Color } from "../lib/color.ts";
import { AutoTextInput } from "./components/AutoTextInput.tsx";

export interface UIFormProps extends UIListProps {}
export function UIForm({ ...props }: UIFormProps) {
    return <UIList {...props} />;
}
export namespace UIForm {
    export interface SectionProps extends UIList.SectionProps {}
    export function Section(props: SectionProps) {
        return UIList.Section(props);
    }

    export interface ItemProps extends UIList.ItemProps {}
    export function Item(props: ItemProps) {
        return UIList.Item(props);
    }

    export interface TextInputProps {
        key?: string;
        label: string;

        value?: string | null | undefined;
        onChange?: ((value: string) => void) | null | undefined;
    }
    export function TextInput({ key, label, value, onChange }: TextInputProps) {
        return Item({
            key,
            render: () => (
                <AutoTextInput
                    style={{ height: "100%", fontSize: 16, flex: 1 }}
                    placeholder={label}
                    placeholderTextColor={"gray"}
                    value={value ?? undefined}
                    onChangeText={onChange ?? undefined}
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
        return Item({
            key,
            label,
            render: () => (
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
    export function DateTime({ key, label, date = true, time = true, value = new Date(), onChange }: DateTimeProps) {
        if (Platform.OS === "ios") {
            return Item({
                key,
                label,
                render: () => (
                    <RNDateTimePicker
                        mode={date && time ? "datetime" : date ? "date" : time ? "time" : "datetime"}
                        value={value}
                        onChange={(_, value) => onChange && onChange(value ?? new Date())}
                    />
                ),
            });
        }
    }

    export type SelectProps<T extends string = string> = Select.Props<T>;
    export declare namespace Select {
        export type Props<T extends string = string> = SingleProps<T> | MultiProps<T>;
        export interface SingleProps<T extends string = string> {
            key?: string;
            label: string;
            multi: false;
            options: () => { key: T; name: string }[];
            value: T | null;
            onChange?: (value: T) => void;
        }
        export interface MultiProps<T extends string = string> {
            key?: string;
            label: string;
            multi: true;
            options: () => { key: T; name: string }[];
            value: Set<T>;
            onChange?: (value: Set<T>) => void;
        }
    }
    export function Select<T extends string = string>({ key, label, multi, options, value, onChange }: SelectProps<T>) {
        if (multi) {
            throw new Error("Multiselect not implemented yet");
        }
        const opts = options();
        return Item({
            key,
            label,
            render: () => (
                <UISelect<T>
                    defaultOption={opts.find(({ key }) => key === value)!}
                    setSelected={onChange ?? (() => {})}
                    options={opts}
                    maxHeight={100}
                />
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
        return Item({
            key,
            label,
            render: () => <RNSwitch value={value} onValueChange={onChange} />,
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
        return Item({
            key,
            onPress,
            onLongPress,
            render: () => <Text style={{ flex: 1, fontSize: 16, color: color.rgba }}>{label}</Text>,
        });
    }
}
