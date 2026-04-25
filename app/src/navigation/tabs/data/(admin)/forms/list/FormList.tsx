import { useRef } from "react";
import * as Bs from "@/ui/icons";
import type { DataTabScreenProps } from "@/navigation/tabs/data";
import { FormOptionsModal } from "./components/FormOptionsModal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIFab } from "@/ui/components/UIFab";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export interface FormListProps extends DataTabScreenProps<"Forms"> {}
export function FormList({ navigation }: FormListProps) {
    const { data: formList = [], refetch } = useQuery(queries.forms.all);
    const optionsSheetRef = useRef<FormOptionsModal>(null);

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Forms"} />
            </SafeAreaView>

            <UIList onRefresh={refetch}>
                <UIList.Section>
                    {formList.map((form) => (
                        <UIList.Row
                            key={form.id.toString()}
                            label={form.name}
                            onPress={() => {
                                optionsSheetRef.current?.present({ form });
                            }}
                        />
                    ))}
                </UIList.Section>
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
