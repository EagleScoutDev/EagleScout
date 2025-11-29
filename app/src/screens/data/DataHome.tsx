import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { InternetStatus } from "../../lib/InternetStatus";
import { TabHeader } from "../../ui/navigation/TabHeader";
import { CompetitionsDB } from "../../database/Competitions";
import { useUserStore } from "../../lib/stores/user";
import { AccountRole } from "../../lib/user/account";
import type { Icon } from "../../ui/icons";
import * as Bs from "../../ui/icons";
import type { DataMenuParamList, DataMenuScreenProps } from "./DataMain";
import { exMemo } from "../../lib/util/react/memo";
import { UIList } from "../../ui/UIList";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UIText } from "../../ui/UIText";
import { Color } from "../../lib/color";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface DataHomeProps extends DataMenuScreenProps<"Home"> {}
export function DataHome({ navigation }: DataHomeProps) {
    const { colors } = useTheme();

    const { account: user } = useUserStore();
    const toc = getTOC({ admin: user?.role === AccountRole.Admin });

    const [internetStatus, setInternetStatus] = useState<InternetStatus>(InternetStatus.NOT_ATTEMPTED);
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
                        <UIText level={1} style={{ flex: 1 }}>
                            Some features may be disabled until you regain an internet connection.
                        </UIText>
                        <Pressable onPress={testConnection}>
                            <UIText bold color={Color.parse(colors.primary.hex)} style={{ flex: 1 }}>
                                Try again?
                            </UIText>
                        </Pressable>
                    </View>
                )}
            </SafeAreaView>

            {/* TODO: for some reason this ScrollView gets covered by the bottom tab bar instead of shrinking?? */}
            <UIList>
                {toc.map(
                    ({ label, shown, items }) =>
                        shown &&
                        UIList.Section({
                            key: label,
                            header: label,
                            items: items.map(({ text, icon, caret, route }, i) =>
                                UIList.Label({
                                    key: i,
                                    label: text,
                                    caret,
                                    icon,
                                    disabled: offline,
                                    onPress: () => navigation.navigate(route),
                                })
                            ),
                        })
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
            [K in keyof DataMenuParamList]: undefined extends DataMenuParamList[K] ? K : never;
        }[keyof DataMenuParamList];
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
                { text: "Match Predictor", icon: Bs.Hourglass, caret: true, route: "MatchPredictor" },
                { text: "Export to CSV", icon: Bs.Upload, caret: true, route: "ExportCSV" },
            ],
        },
        {
            shown: true,
            label: "Scoutcoin",
            items: [
                { text: "Match Betting", icon: Bs.CashCoin, caret: true, route: "MatchBetting" },
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
    ]
);
