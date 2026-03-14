import { Form } from "@/lib/forms";
import { FlatList as RNFlatList, type FlatListProps, View } from "react-native";
import type React from "react";
import { UIText } from "@/ui/components/UIText";
import { FormQuestion } from "@/components/FormQuestion";
import { UIRadio } from "@/ui/components/UIRadio";
import { UITextInput } from "@/ui/components/UITextInput";
import { useTheme } from "@/ui/context/ThemeContext";
import { UICheckboxes } from "@/ui/components/UICheckboxes";

export interface FormDataViewProps extends Pick<
    FlatListProps<Form.Item>,
    "ListHeaderComponent" | "ListFooterComponent"
> {
    FlatList?: React.ComponentType<FlatListProps<Form.Item>>;
    form: Form.Structure;
    data: Form.Data;
}

export function FormDataView({
    FlatList = RNFlatList,
    form,
    data,
    ListHeaderComponent, ListFooterComponent,
}: FormDataViewProps) {
    const { colors } = useTheme();

    return (
        <FlatList
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            contentContainerStyle={{ padding: 16 }}
            contentInsetAdjustmentBehavior={"automatic"}
            data={form}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item, index }) => {
                const value = data[index];

                switch (item.type) {
                    case Form.ItemType.heading:
                        return (
                            <View>
                                <UIText
                                    style={{
                                        color: colors.fg.hex,
                                        fontSize: 18,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        marginTop: 32,
                                        marginBottom: 8,
                                    }}
                                >
                                    {item.title}
                                </UIText>
                            </View>
                        );

                    case Form.ItemType.radio:
                        return (
                            <View style={{ padding: 8 }}>
                                <FormQuestion title={item.question} required={item.required}>
                                    <UIRadio
                                        disabled
                                        options={item.options}
                                        value={item.options[value]}
                                    />
                                </FormQuestion>
                            </View>
                        );
                    case Form.ItemType.checkbox:
                        return (
                            <View style={{ padding: 8 }}>
                                <FormQuestion title={item.question} required={item.required}>
                                    <UICheckboxes
                                        disabled
                                        options={item.options}
                                        value={value ?? []}
                                    />
                                </FormQuestion>
                            </View>
                        );
                    case Form.ItemType.textbox:
                        return (
                            <View style={{ padding: 8 }}>
                                <FormQuestion title={item.question} required={item.required}>
                                    <UITextInput
                                        multiline
                                        disabled
                                        placeholder={"Type here"}
                                        value={data[index]}
                                    />
                                </FormQuestion>
                            </View>
                        );
                    case Form.ItemType.number:
                        return (
                            <View
                                style={{
                                    backgroundColor:
                                        index % 2 === 0 ? colors.bg1.hex : "transparent",
                                    padding: 8,
                                    borderRadius: 8,
                                }}
                            >
                                <FormQuestion title={item.question} required={item.required}>
                                    {value === null ? (
                                        <UIText
                                            style={{
                                                color: colors.danger.hex,
                                                fontWeight: "bold",
                                                flexWrap: "wrap",
                                                fontSize: 15,
                                                flex: 1,
                                            }}
                                        >
                                            N/A
                                        </UIText>
                                    ) : (
                                        <UIText
                                            style={{
                                                color: colors.fg.hex,
                                                fontWeight: "bold",
                                                fontSize: 20,
                                                // marginLeft: "auto",
                                                textAlign: "center",
                                                paddingHorizontal: 32,
                                            }}
                                        >
                                            {value ?? ""}
                                        </UIText>
                                    )}
                                </FormQuestion>
                            </View>
                        );
                }
            }}
        />
    );
}
