import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Bs from "@/ui/icons";
import { UpcomingRoundsView } from "./UpcomingRoundsView";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { useRootNavigation } from "@/navigation";

export function ScoutTabMain() {
    const rootNavigation = useRootNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <TabHeader title={"Home"} />
                <UIList>
                    <UpcomingRoundsView />
                    {UIList.Section({
                        header: "Scouting",
                        items: [
                            UIList.Label({
                                icon: Bs.JournalPlus,
                                label: "Match Scouting",
                                caret: true,
                                onPress: () => {
                                    rootNavigation.navigate("Match");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.Tag,
                                label: "Pit Scouting",
                                caret: true,
                                onPress: () => {
                                    rootNavigation.navigate("Pit");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.Sticky,
                                label: "New Note",
                                caret: true,
                                onPress: () => {
                                    rootNavigation.navigate("Note");
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
