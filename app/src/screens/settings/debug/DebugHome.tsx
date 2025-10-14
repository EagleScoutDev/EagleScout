import type { SettingsMenuScreenProps } from "../SettingsMenu";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "../../../ui/navigation/TabHeader.tsx";
import { UIList } from "../../../ui/UIList.tsx";
import * as Bs from "../../../ui/icons";

export interface DebugHomeProps extends SettingsMenuScreenProps<"Debug/Home"> {}
export function DebugHome({ navigation }: DebugHomeProps) {
    return (
        <SafeAreaView edges={{ bottom: "off", top: "off" }} style={{ width: "100%", height: "100%" }}>
            <TabHeader title={"Debug"} />
            <UIList contentContainerStyle={{ paddingBottom: 24 }}>
                {[
                    UIList.Section({
                        items: [
                            UIList.Item({
                                icon: Bs.Database,
                                label: "AsyncStorage",
                                caret: true,
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
    );
}
