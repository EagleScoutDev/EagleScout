import type { SettingsMenuScreenProps } from "../SettingsMenu";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "../../../ui/navigation/TabHeader";
import { UIList } from "../../../ui/UIList";
import * as Bs from "../../../ui/icons";

export interface DebugHomeProps extends SettingsMenuScreenProps<"Debug/Home"> {}
export function DebugHome({ navigation }: DebugHomeProps) {
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
