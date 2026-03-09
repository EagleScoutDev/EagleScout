import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { InternetStatus } from "@/lib/InternetStatus";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { useUserStore } from "@/lib/stores/user";
import { AccountRole } from "@/lib/user/account";
import * as Bs from "@/ui/icons";
import type { DataTabScreenProps } from "./index";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/ui/context/ThemeContext";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIText } from "@/ui/components/UIText";
import { UIList } from "@/ui/components/UIList";
import { exMemo } from "@/lib/util/react/memo";

export interface DataTabMainProps extends DataTabScreenProps<"Main"> {}
export function DataTabMain({ navigation }: DataTabMainProps) {
    const { colors } = useTheme();

    const user = useUserStore((state) => state.account);

    const [internetStatus, setInternetStatus] = useState<InternetStatus>(
        InternetStatus.NOT_ATTEMPTED,
    );
    const offline = internetStatus !== InternetStatus.CONNECTED;

    function testConnection() {
        // attempt connection to picklist table
        setInternetStatus(InternetStatus.ATTEMPTING_TO_CONNECT);
        CompetitionsDB.getCurrentCompetition()
            .then(() => {
                setInternetStatus(InternetStatus.CONNECTED);
            })
            .catch(() => {
                setInternetStatus(InternetStatus.FAILED);
            });
    }
    useEffect(() => {
        testConnection();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Data"} />

                {internetStatus === InternetStatus.FAILED && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            marginHorizontal: "4%",
                            marginBottom: "4%",
                        }}
                    >
                        <UIText placeholder style={{ flex: 1 }}>
                            Some features may be disabled until you regain an internet connection.
                        </UIText>
                        <Pressable onPress={testConnection}>
                            <UIText bold color={colors.primary} style={{ flex: 1 }}>
                                Try again?
                            </UIText>
                        </Pressable>
                    </View>
                )}
            </SafeAreaView>

            {/* TODO: for some reason this ScrollView gets covered by the bottom tab bar instead of shrinking?? */}
            <UIList>
                <UIList.Section title="Data Analysis">
                    <UIList.Row
                        icon={Bs.List}
                        label="Picklist"
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("Picklists")}
                    />
                    <UIList.Row
                        icon={Bs.ArrowDownUp}
                        label="Team Rank"
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("TeamRank")}
                    />
                    <UIList.Row
                        icon={Bs.Sliders}
                        label="Weighted Team Rank"
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("WeightedTeamRank")}
                    />
                    <UIList.Row
                        icon={Bs.Hourglass}
                        label="Match Predictor"
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("MatchPredictor")}
                    />
                    <UIList.Row
                        icon={Bs.Upload}
                        label="Export to CSV"
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("ExportCSV")}
                    />
                </UIList.Section>

                <UIList.Section title="Scoutcoin">
                    <UIList.Row
                        icon={Bs.Award}
                        label="Leaderboard"
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("ScoutcoinLeaderboard")}
                    />
                    <UIList.Row
                        icon={Bs.Newspaper}
                        label="Ledger"
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("ScoutcoinLedger")}
                    />
                    <UIList.Row
                        icon={Bs.Cart}
                        label="Shop"
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("ScoutcoinShop")}
                    />
                </UIList.Section>

                {user?.role === AccountRole.Admin && (
                    <UIList.Section title="Administrative">
                        <UIList.Row
                            icon={Bs.TrophyFill}
                            label="Competitions"
                            caret
                            disabled={offline}
                            onPress={() => navigation.navigate("ManageCompetitions")}
                        />
                        <UIList.Row
                            icon={Bs.PeopleFill}
                            label="Users"
                            caret
                            disabled={offline}
                            onPress={() => navigation.navigate("ManageUsers")}
                        />
                        <UIList.Row
                            icon={Bs.ClipboardData}
                            label="Forms"
                            caret
                            disabled={offline}
                            onPress={() => navigation.navigate("Forms")}
                        />
                        <UIList.Row
                            icon={Bs.CalendarThree}
                            label="Scout Assignments"
                            caret
                            disabled={offline}
                            onPress={() => navigation.navigate("ScoutAssignments")}
                        />
                        <UIList.Row
                            icon={Bs.CashCoin}
                            label="Match Bets"
                            caret
                            disabled={offline}
                            onPress={() => navigation.navigate("ManageMatchBets")}
                        />
                    </UIList.Section>
                )}
            </UIList>
        </SafeAreaProvider>
    );
}

type TOC = {
    label: string;
    shown: boolean;
    items: {
        text: string;
        icon: Icon;
        caret: boolean;
        route: {
            [K in keyof DataTabParamList]: undefined extends DataTabParamList[K] ? K : never;
        }[keyof DataTabParamList];
    }[];
}[];
const getTOC = exMemo(
    ({ admin }: { admin: boolean }): TOC => [
        {
            shown: true,
            label: "Data Analysis",
            items: [
                { text: "Picklist", icon: Bs.List, caret: true, route: "Picklists" },
                { text: "Team Rank", icon: Bs.ArrowDownUp, caret: true, route: "TeamRank" },
                { text: "Weighted Team Rank", icon: Bs.Sliders, caret: true, route: "WeightedTeamRank" },
                { text: "Match Overview", icon: Bs.Binoculars, caret: true, route: "MatchOverviewSelector"},
                { text: "Match Predictor", icon: Bs.Hourglass, caret: true, route: "MatchPredictor" },
                { text: "Export to CSV", icon: Bs.Upload, caret: true, route: "ExportCSV" },
            ],
        },
        {
            shown: true,
            label: "Scoutcoin",
            items: [
                { text: "Leaderboard", icon: Bs.Award, caret: true, route: "ScoutcoinLeaderboard" },
                { text: "Ledger", icon: Bs.Newspaper, caret: true, route: "ScoutcoinLedger" },
                { text: "Shop", icon: Bs.Cart, caret: true, route: "ScoutcoinShop" },
            ],
        },
        {
            shown: admin,
            label: "Administrative",
            items: [
                { text: "Competitions", icon: Bs.TrophyFill, caret: true, route: "ManageCompetitions" },
                { text: "Users", icon: Bs.PeopleFill, caret: true, route: "ManageUsers" },
                { text: "Forms", icon: Bs.ClipboardData, caret: true, route: "Forms" },
                { text: "Scout Assignments", icon: Bs.CalendarThree, caret: true, route: "ScoutAssignments" },
                { text: "Match Bets", icon: Bs.CashCoin, caret: true, route: "ManageMatchBets" },
            ],
        },
    ],
);
