import type { SettingsTabScreenProps } from "../index";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Bs from "@/ui/icons";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";

export interface DebugMainProps extends SettingsTabScreenProps<"Debug/Main"> {}
export function DebugMain({ navigation }: DebugMainProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Debug"} />
            </SafeAreaView>

            <UIList>
                {UIList.Section({
                    items: [
                        UIList.Label({
                            icon: Bs.Database,
                            label: "AsyncStorage",
                            caret: true,
                            disabled: false,
                            onPress: () => {
                                navigation.navigate("Debug/AsyncStorage");
                            },
                        }),
                    ],
                })}
            </UIList>
        </SafeAreaProvider>
    );
}
