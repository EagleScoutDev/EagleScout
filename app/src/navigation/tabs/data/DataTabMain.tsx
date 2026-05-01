import { useUserStore } from "@/lib/stores/user";
import * as Bs from "@/ui/icons";
import type { DataTabScreenProps } from "./index";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";

export interface DataTabMainProps extends DataTabScreenProps<"Main"> {}
export function DataTabMain({ navigation }: DataTabMainProps) {
    const user = useUserStore((state) => state.account);

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Data"} />
            </SafeAreaView>

            {/* TODO: for some reason this ScrollView gets covered by the bottom tab bar instead of shrinking?? */}
            <UIList>
                <UIList.Section title="Data Analysis">
                    <UIList.Row
                        icon={Bs.List}
                        label="Picklist"
                        caret
                        onPress={() => navigation.navigate("Picklists")}
                    />
                    <UIList.Row
                        icon={Bs.ArrowDownUp}
                        label="Team Rank"
                        caret
                        onPress={() => navigation.navigate("TeamRank")}
                    />
                    <UIList.Row
                        icon={Bs.Sliders}
                        label="Weighted Team Rank"
                        caret
                        onPress={() => navigation.navigate("WeightedTeamRank")}
                    />
                    <UIList.Row
                        icon={Bs.Hourglass}
                        label="Match Predictor"
                        caret
                        onPress={() => navigation.navigate("MatchPredictor")}
                    />
                    <UIList.Row
                        icon={Bs.Binoculars}
                        label="Match Overview"
                        caret
                        onPress={() => navigation.navigate("MatchOverviewSelector")}
                    />
                    <UIList.Row
                        icon={Bs.Upload}
                        label="Export to CSV"
                        caret
                        onPress={() => navigation.navigate("ExportCSV")}
                    />
                </UIList.Section>

                <UIList.Section title="Scoutcoin">
                    <UIList.Row
                        icon={Bs.Award}
                        label="Leaderboard"
                        caret
                        onPress={() => navigation.navigate("ScoutcoinLeaderboard")}
                    />
                    <UIList.Row
                        icon={Bs.Newspaper}
                        label="Ledger"
                        caret
                        onPress={() => navigation.navigate("ScoutcoinLedger")}
                    />
                    <UIList.Row
                        icon={Bs.Cart}
                        label="Shop"
                        caret
                        onPress={() => navigation.navigate("ScoutcoinShop")}
                    />
                </UIList.Section>

                {user?.admin && (
                    <UIList.Section title="Administrative">
                        <UIList.Row
                            icon={Bs.TrophyFill}
                            label="Competitions"
                            caret
                            onPress={() => navigation.navigate("ManageCompetitions")}
                        />
                        <UIList.Row
                            icon={Bs.PeopleFill}
                            label="Users"
                            caret
                            onPress={() => navigation.navigate("ManageUsers")}
                        />
                        <UIList.Row
                            icon={Bs.ClipboardData}
                            label="Forms"
                            caret
                            onPress={() => navigation.navigate("Forms")}
                        />
                        <UIList.Row
                            icon={Bs.CashCoin}
                            label="Match Bets"
                            caret
                            onPress={() => navigation.navigate("ManageMatchBets")}
                        />
                    </UIList.Section>
                )}
            </UIList>
        </SafeAreaProvider>
    );
}
