import { TabHeader } from "../../ui/navigation/TabHeader";
import type { ScoutMenuScreenProps } from "./ScoutingFlow";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UIList } from "../../ui/UIList";
import * as Bs from "../../ui/icons";
import { UpcomingRoundsView } from "./UpcomingRoundsView.tsx";

export interface ScoutFlowHomeProps extends ScoutMenuScreenProps<"Dashboard"> {}
export function ScoutFlowHome({ navigation }: ScoutFlowHomeProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <TabHeader title={"Home"} />
                <UIList>
                    {[
                        <UpcomingRoundsView navigation={navigation} />,
                        UIList.Section({
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
                        }),
                        UIList.Section({
                            items: [
                                UIList.Label({
                                    icon: Bs.CashCoin,
                                    label: "Match Betting",
                                    caret: true,
                                    onPress: () => {
                                        navigation.getParent()?.reset({
                                            index: 1,
                                            routes: [
                                                { name: "Home", params: { screen: "Dashboard" } },
                                                {
                                                    name: "Data",
                                                    state: {
                                                        index: 1,
                                                        routes: [{ name: "Home" }, { name: "MatchBetting" }],
                                                    },
                                                },
                                            ],
                                        });
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
