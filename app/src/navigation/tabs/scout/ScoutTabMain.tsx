import type { ScoutMenuScreenProps } from "./index";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Bs from "@/ui/icons";
import { UpcomingRoundsView } from "@/navigation/tabs/scout/components/UpcomingRoundsView";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { useNavigation } from "@react-navigation/native";

export interface ScoutTabMainProps extends ScoutMenuScreenProps<"Main"> {}
export function ScoutTabMain({ navigation }: ScoutTabMainProps) {
    const rootNavigation = useNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <TabHeader title={"Home"} />
                <UIList>
                    <UpcomingRoundsView navigation={navigation} />
                    {UIList.Section({
                        header: "Scouting",
                        items: [
                            UIList.Label({
                                icon: Bs.JournalPlus,
                                label: "Match Scouting",
                                caret: true,
                                onPress: () => {
                                    navigation.navigate("Match");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.Tag,
                                label: "Pit Scouting",
                                caret: true,
                                onPress: () => {
                                    navigation.navigate("Pit");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.Sticky,
                                label: "New Note",
                                caret: true,
                                onPress: () => {
                                    navigation.navigate("Note");
                                },
                            }),
                        ],
                    })}
                    {UIList.Section({
                        items: [
                            UIList.Label({
                                icon: Bs.CashCoin,
                                label: "Match Betting",
                                caret: true,
                                onPress: () => {
                                    rootNavigation.push("MatchBetting");
                                },
                            }),
                        ],
                    })}
                </UIList>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
