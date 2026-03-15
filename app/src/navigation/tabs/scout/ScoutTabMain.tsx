import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Bs from "@/ui/icons";
import { UpcomingRoundsView } from "./UpcomingRoundsView";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { useRootNavigation } from "@/navigation/hooks";

export function ScoutTabMain() {
    const rootNavigation = useRootNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <TabHeader title={"Home"} />
                <UIList>
                    <UpcomingRoundsView />
                    <UIList.Section title="Scouting">
                        <UIList.Row
                            icon={Bs.JournalPlus}
                            label="Match Scouting"
                            caret
                            onPress={() => {
                                rootNavigation.navigate("Match");
                            }}
                        />
                        <UIList.Row
                            icon={Bs.Tag}
                            label="Pit Scouting"
                            caret
                            onPress={() => {
                                rootNavigation.navigate("Pit");
                            }}
                        />
                        <UIList.Row
                            icon={Bs.Sticky}
                            label="New Note"
                            caret
                            onPress={() => {
                                rootNavigation.navigate("Note");
                            }}
                        />
                    </UIList.Section>
                    <UIList.Section>
                        <UIList.Row
                            icon={Bs.CashCoin}
                            label="Match Betting"
                            caret
                            onPress={() => {
                                rootNavigation.push("MatchBetting");
                            }}
                        />
                    </UIList.Section>
                </UIList>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
