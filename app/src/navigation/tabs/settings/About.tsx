import type { SettingsTabScreenProps } from "./index";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIText } from "@/ui/components/UIText";
import { useEffect, useState } from "react";
import { useStallionModal } from "react-native-stallion";
import Application from "expo-application/src/ExpoApplication";

export interface AboutProps extends SettingsTabScreenProps<"About"> {}
export function About({ navigation }: AboutProps) {
    const stallionModal = useStallionModal();
    const [stallionCountdown, setStallionCountdown] = useState(4);

    useEffect(() => {
        return navigation.addListener("focus", () => {
            setStallionCountdown(4);
        });
    }, [navigation]);

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"About"} />
            </SafeAreaView>

            <UIList>
                <UIList.Section>
                    <UIList.Label
                        label="Version"
                        body={() => (
                            <UIText size={16} placeholder>
                                {Application.nativeApplicationVersion}
                            </UIText>
                        )}
                        onPress={() => {
                            if (stallionCountdown <= 0) {
                                setStallionCountdown(4);
                                stallionModal.showModal();
                            } else setStallionCountdown(stallionCountdown - 1);
                        }}
                    />
                </UIList.Section>
            </UIList>
        </SafeAreaProvider>
    );
}
