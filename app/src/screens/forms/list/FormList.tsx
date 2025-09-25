import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FormOptionsModal } from "./FormOptionsModal.tsx";
import type { FormsMenuScreenProps } from "../ManageForms.tsx";
import { FormsDB } from "../../../database/Forms.ts";
import * as Bs from "../../../ui/icons";

export interface FormListProps extends FormsMenuScreenProps<"List"> {}
export function FormList({ navigation }: FormListProps) {
    const { colors } = useTheme();
    const [formList, setFormList] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [selectedFormIndex, setSelectedFormIndex] = useState(0);
    const [formOptionsModalVisible, setFormOptionsModalVisible] = useState(false);

    const removeCurrentForm = () => {
        setFormList([...formList.slice(0, selectedFormIndex), ...formList.slice(selectedFormIndex + 1)]);
    };

    const fetchForms = () => {
        (async () => {
            const forms = await FormsDB.getAllForms();
            setFormList(forms);
        })();
    };

    useEffect(() => {
        return navigation.addListener("focus", () => {
            fetchForms();
        });
    }, [navigation]);

    return (
        <>
            <View style={{ flex: 1 }}>
                {/*TODO: Make this bigger*/}
                <View
                    style={{
                        alignSelf: "center",
                        backgroundColor: colors.background,
                        height: "100%",
                        borderRadius: 10,
                        padding: "10%",
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 25,
                            fontWeight: "bold",
                            marginBottom: 20,
                            color: colors.text,
                            textDecorationStyle: "solid",
                            textDecorationLine: "underline",
                            textDecorationColor: colors.border,
                        }}
                    >
                        Choose a Form
                    </Text>
                    <ScrollView>
                        {formList.map((form, index) => (
                            <TouchableOpacity
                                key={form.id}
                                onPress={() => {
                                    setSelectedForm(form);
                                    setSelectedFormIndex(index);
                                    setFormOptionsModalVisible(true);
                                }}
                                style={{
                                    padding: 20,
                                    borderRadius: 10,
                                    backgroundColor: index % 2 === 0 ? colors.border : colors.background,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        fontSize: 16,
                                    }}
                                >
                                    {form.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Edit", {
                                form: null,
                            });
                        }}
                        style={{
                            margin: 20,
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                        }}
                    >
                        <Bs.PlusCircleFill size="60" fill={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
            <FormOptionsModal
                visible={formOptionsModalVisible}
                setVisible={setFormOptionsModalVisible}
                form={selectedForm}
                onSuccess={removeCurrentForm}
                navigation={navigation}
            />
        </>
    );
}
