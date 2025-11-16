import type { SettingsMenuScreenProps } from "./SettingsMenu";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "../../ui/navigation/TabHeader";
import { UIList } from "../../ui/UIList";
import { Text } from "react-native";

const VERSION = "7.7.2";

export interface AboutProps extends SettingsMenuScreenProps<"About"> {}
export function About({}: AboutProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <TabHeader title={"About"} />
                <UIList contentContainerStyle={{ paddingBottom: 24 }}>
                    {[
                        UIList.Section({
                            items: [
                                UIList.Label({
                                    label: "Version",
                                    body: () => <Text style={{ fontSize: 16, color: "gray" }}>{VERSION}</Text>,
                                }),
                            ],
                        }),
                    ]}
                </UIList>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
