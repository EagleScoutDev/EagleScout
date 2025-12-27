import { useEffect, useRef, useState } from "react";
import { type FormReturnData, FormsDB } from "@/lib/database/Forms";
import * as Bs from "@/ui/icons";
import type { DataTabScreenProps } from "@/navigation/tabs/data";
import { FormOptionsSheet } from "./components/FormOptionsSheet";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIFab } from "@/ui/components/UIFab";

export interface FormListProps extends DataTabScreenProps<"Forms"> {}
export function FormList({ navigation }: FormListProps) {
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

            <UISheetModal
                ref={optionsSheetRef}
                enablePanDownToClose={true}
                handleComponent={null}
                backdropPressBehavior={"close"}
                children={FormOptionsSheet}
            />
        </SafeAreaProvider>
    );
}
