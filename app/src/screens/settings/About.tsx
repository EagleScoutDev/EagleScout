import type { SettingsMenuScreenProps } from "./SettingsMenu";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "../../ui/navigation/TabHeader";
import { UIList } from "../../ui/UIList";

import { UIText } from "../../ui/UIText";

const VERSION = "7.7.2";

export interface AboutProps extends SettingsMenuScreenProps<"About"> {}
export function About({}: AboutProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"About"} />
            </SafeAreaView>

            <UIList>
                {UIList.Section({
                    items: [
                        UIList.Label({
                            label: "Version",
                            body: () => (
                                <UIText size={16} level={1}>
                                    {VERSION}
                                </UIText>
                            ),
                        }),
                    ],
                })}
            </UIList>
        </SafeAreaProvider>
    );
}
