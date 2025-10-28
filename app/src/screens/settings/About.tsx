import type { SettingsMenuScreenProps } from "./SettingsMenu.tsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "../../ui/navigation/TabHeader.tsx";
import { UIList } from "../../ui/UIList.tsx";
import { Text } from "react-native";

const VERSION = "7.7.2";

export interface AboutProps extends SettingsMenuScreenProps<"About"> {}
export function About({ navigation }: AboutProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <TabHeader title={"About"} />
                <UIList contentContainerStyle={{ paddingBottom: 24 }}>
                    {[
                        UIList.Section({
                            items: [
                                UIList.Line({
                                    label: "Version",
                                    body: () => <Text style={{ fontSize: 16, color: "gray" }}>{VERSION}</Text>,
                                    disabled: false,
                                    onPress: () => {
                                        navigation.navigate("Debug/AsyncStorage");
                                    },
                                }),
                            ],
                        }),
                    ]}
                </UIList>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
