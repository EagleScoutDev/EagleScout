import { TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { type FormReturnData, FormsDB } from "../../../../database/Forms";
import * as Bs from "../../../../ui/icons";
import type { DataMenuScreenProps } from "../../../data/DataMain";
import { UIList } from "../../../../ui/UIList";
import { TabHeader } from "../../../../ui/navigation/TabHeader";
import { UISheetModal } from "../../../../ui/UISheetModal";
import { FormOptionsSheet } from "./components/FormOptionsSheet";

export interface FormListProps extends DataMenuScreenProps<"Forms"> {}
export function FormList({ navigation }: FormListProps) {
    const { colors } = useTheme();
    const [formList, setFormList] = useState<FormReturnData[]>([]);
    const optionsSheetRef = useRef<UISheetModal<{ form: FormReturnData }>>(null);

    async function fetchForms() {
        const forms = await FormsDB.getAllForms();
        setFormList(forms);
    }

    useEffect(() => {
        return navigation.addListener("focus", () => {
            fetchForms();
        });
    }, [navigation]);

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <TabHeader title={"Forms"} />

            <UIList onRefresh={fetchForms}>
                {[
                    UIList.Section({
                        items: formList.map((form) =>
                            UIList.Label({
                                key: form.id.toString(),
                                label: form.name,
                                onPress: () => {
                                    optionsSheetRef.current?.present({ form });
                                },
                            })
                        ),
                    }),
                ]}
            </UIList>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Forms/Edit", {
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

            <UISheetModal
                ref={optionsSheetRef}
                enablePanDownToClose={true}
                handleComponent={null}
                backdropPressBehavior={"close"}
                gap={"30%"}
                children={FormOptionsSheet}
            />
        </View>
    );
}
