import { useRef, useState } from "react";
import { type FormReturnData, FormsDB } from "@/lib/database/Forms";
import * as Bs from "@/ui/icons";
import type { DataTabScreenProps } from "@/navigation/tabs/data";
import { FormOptionsModal } from "./components/FormOptionsModal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIFab } from "@/ui/components/UIFab";
import { useFocusEffect } from "@react-navigation/native";

export interface FormListProps extends DataTabScreenProps<"Forms"> {}
export function FormList({ navigation }: FormListProps) {
    "use no memo"; // TODO: fix this

    const [formList, setFormList] = useState<FormReturnData[]>([]);
    const optionsSheetRef = useRef<FormOptionsModal>(null);

    async function fetchForms() {
        const forms = await FormsDB.getAllForms();
        setFormList(forms);
    }

    useFocusEffect(() => {
        fetchForms();
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Forms"} />
            </SafeAreaView>

            <UIList onRefresh={fetchForms}>
                {UIList.Section({
                    items: formList.map((form) =>
                        UIList.Label({
                            key: form.id.toString(),
                            label: form.name,
                            onPress: () => {
                                optionsSheetRef.current?.present({ form });
                            },
                        }),
                    ),
                })}
            </UIList>

            <UIFab
                icon={Bs.Plus}
                onPress={() =>
                    navigation.navigate("Forms/Edit", {
                        form: null,
                    })
                }
            />

            <FormOptionsModal ref={optionsSheetRef} />
        </SafeAreaProvider>
    );
}
