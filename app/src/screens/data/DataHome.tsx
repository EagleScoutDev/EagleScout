import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { InternetStatus } from "../../lib/InternetStatus";
import { TabHeader } from "../../ui/navigation/TabHeader.tsx";
import { CompetitionsDB } from "../../database/Competitions";
import { useAccount } from "../../lib/react/hooks/useAccount";
import { AccountType } from "../../lib/user/account";
import type { Icon } from "../../ui/icons";
import * as Bs from "../../ui/icons";
import type { DataMenuParamList, DataMenuScreenProps } from "./DataMain";
import { exMemo } from "../../lib/react/util/memo.ts";
import { UIList } from "../../ui/UIList.tsx";
import { SafeAreaView } from "react-native-safe-area-context";

export interface DataHomeProps extends DataMenuScreenProps<"Home"> {}
export function DataHome({ navigation }: DataHomeProps) {
    const { colors } = useTheme();

    const { account: user } = useAccount();
    const toc = getTOC({ admin: user?.type === AccountType.Admin });

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
        <SafeAreaView edges={{ bottom: "off", top: "additive" }} style={{ width: "100%", height: "100%" }}>
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
                    <Text style={{ flex: 1, color: "grey" }}>
                        Some features may be disabled until you regain an internet connection.
                    </Text>
                    <Pressable onPress={testConnection}>
                        <Text style={{ flex: 1, color: colors.primary, fontWeight: "bold" }}>Try again?</Text>
                    </Pressable>
                </View>
            )}

            {/* TODO: for some reason this ScrollView gets covered by the bottom tab bar instead of shrinking?? */}
            <UIList contentContainerStyle={{ paddingBottom: 24 }}>
                {toc.map(
                    ({ label, shown, items }) =>
                        shown &&
                        UIList.Section({
                            key: label,
                            header: label,
                            items: items.map(({ label, icon, caret, route }) => (
                                UIList.Item({
                                    key: label,
                                    label: label,
                                    caret: caret,
                                    icon: icon,
                                    disabled: offline,
                                    onPress: () => navigation.navigate(route)
                                })
                            )),
                        })
                )}
            </UIList>
        </SafeAreaView>
    );
}

type TOC = {
    label: string;
    shown: boolean;
    items: {
        label: string;
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
                { label: "Picklist", icon: Bs.List, caret: true, route: "Picklist" },
                { label: "Team Rank", icon: Bs.ArrowDownUp, caret: true, route: "TeamRank" },
                { label: "Weighted Team Rank", icon: Bs.Sliders, caret: true, route: "WeightedTeamRank" },
                { label: "Match Predictor", icon: Bs.Hourglass, caret: true, route: "MatchPredictor" },
                { label: "Export to CSV", icon: Bs.Upload, caret: true, route: "ExportCSV" },
            ],
        },
        {
            shown: true,
            label: "Scoutcoin",
            items: [
                { label: "Match Betting", icon: Bs.CashCoin, caret: true, route: "MatchBetting" },
                { label: "Leaderboard", icon: Bs.Award, caret: true, route: "ScoutcoinLeaderboard" },
                { label: "Ledger", icon: Bs.Newspaper, caret: true, route: "ScoutcoinLedger" },
                { label: "Shop", icon: Bs.Cart, caret: true, route: "ScoutcoinShop" },
            ],
        },
        {
            shown: admin,
            label: "Administrative",
            items: [
                { label: "Competitions", icon: Bs.TrophyFill, caret: true, route: "ManageCompetitions" },
                { label: "Users", icon: Bs.PeopleFill, caret: true, route: "ManageUsers" },
                { label: "Forms", icon: Bs.ClipboardData, caret: true, route: "Forms" },
                { label: "Scout Assignments", icon: Bs.CalendarThree, caret: true, route: "ManageScoutAssignments" },
                { label: "Match Bets", icon: Bs.CashCoin, caret: true, route: "ManageMatchBets" },
            ],
        },
    ]
);
