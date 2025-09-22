import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { AddCompetitionModal } from "../../components/modals/AddCompetitionModal";
import { ListItem } from "../../ui/ListItem";
import { ListSection } from "../../ui/ListSection.tsx";
import { InternetStatus } from "../../lib/InternetStatus";
import { getLighterColor, parseColor } from "../../lib/color";
import { TabHeader } from "../../ui/TabHeader";
import { CompetitionsDB } from "../../database/Competitions";
import { useAccount } from "../../lib/hooks/useAccount";
import { AccountType } from "../../lib/user/account";
import * as Bs from "../../ui/icons";
import type { DataMenuScreenProps } from "./DataMain";
import { List } from "../../ui/icons";

export interface DataHomeProps extends DataMenuScreenProps<"Home"> {}
export function DataHome({ navigation }: DataHomeProps) {
    const { colors } = useTheme();
    const [addCompetitionModalVisible, setAddCompetitionModalVisible] = useState(false);

    const [internetStatus, setInternetStatus] = useState<InternetStatus>(InternetStatus.NOT_ATTEMPTED);
    const { account: user } = useAccount();
    ``;
    const testConnection = () => {
        // attempt connection to picklist table
        setInternetStatus(InternetStatus.ATTEMPTING_TO_CONNECT);
        CompetitionsDB.getCurrentCompetition()
            .then(() => {
                setInternetStatus(InternetStatus.CONNECTED);
            })
            .catch(() => {
                setInternetStatus(InternetStatus.FAILED);
            });
    };

    useEffect(() => {
        testConnection();
    }, []);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.card,
            alignItems: "center",
            borderRadius: 10,
            // construct padding from debugPadding
            padding: "2%",
        },
        nav_link: {
            backgroundColor: colors.card,
            padding: "4%",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        nav_link_text: {
            color: colors.text,
        },
    });

    return (
        <SafeAreaView
            style={{
                marginTop: "0%",
                paddingHorizontal: "2%",
            }}
        >
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
            <ScrollView>
                <ListSection title={"Data Analysis"}>
                    <ListItem
                        text={"Picklist"}
                        onPress={() => {
                            navigation.navigate("Picklist", { screen: "Manager" });
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.List size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Team Rank"}
                        onPress={() => {
                            navigation.navigate("TeamRank");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.ArrowDownUp size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Weighted Team Rank"}
                        onPress={() => {
                            navigation.navigate("WeightedTeamRank");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Sliders size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Match Predictor"}
                        onPress={() => {
                            navigation.navigate("MatchPredictor");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Hourglass size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Export to CSV"}
                        onPress={() => {
                            navigation.navigate("ExportCSV");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Upload size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                </ListSection>
                <View style={{ height: 20 }} />
                <ListSection title={"Scoutcoin"}>
                    <ListItem
                        text={"Match Betting"}
                        onPress={() => {
                            navigation.navigate("MatchBetting")
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.CashCoin size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Leaderboard"}
                        onPress={() => {
                            navigation.navigate("ScoutcoinLeaderboard");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Award size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Ledger"}
                        onPress={() => {
                            navigation.navigate("ScoutcoinLedger");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Newspaper size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Shop"}
                        onPress={() => {
                            navigation.navigate("ScoutcoinShop");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Cart size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                </ListSection>
                <View style={{ height: 20 }} />
                {user?.type === AccountType.Admin && (
                    <>
                        <ListSection title={"Administrative"}>
                            <ListItem
                                text={"Manage Competitions"}
                                onPress={() => {
                                    navigation.navigate("ManageCompetitions");
                                }}
                                caret={true}
                                disabled={internetStatus !== InternetStatus.CONNECTED}
                                icon={<Bs.TrophyFill size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                            />
                            <ListItem
                                text={"Create Competition"}
                                onPress={() => {
                                    setAddCompetitionModalVisible(true);
                                }}
                                caret={false}
                                disabled={internetStatus !== InternetStatus.CONNECTED}
                                icon={<Bs.PlusLg size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                            />
                            <ListItem
                                text={"Manage Users"}
                                onPress={() => {
                                    navigation.navigate("ManageUsers");
                                }}
                                caret={true}
                                disabled={internetStatus !== InternetStatus.CONNECTED}
                                icon={<Bs.PeopleFill size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                            />
                            <ListItem
                                text={"Manage Forms"}
                                onPress={() => {
                                    navigation.navigate("ManageForms");
                                }}
                                caret={true}
                                disabled={internetStatus !== InternetStatus.CONNECTED}
                                icon={<Bs.ClipboardData size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                            />
                            <ListItem
                                text={"Manage Scout Assignments"}
                                onPress={() => {
                                    navigation.navigate("ManageScoutAssignments");
                                }}
                                caret={true}
                                disabled={internetStatus !== InternetStatus.CONNECTED}
                                icon={<Bs.CalendarThree size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                            />
                            <ListItem
                                text={"Manage Match Bets"}
                                onPress={() => {
                                    navigation.navigate("ManageMatchBets");
                                }}
                                caret={true}
                                disabled={internetStatus !== InternetStatus.CONNECTED}
                                icon={<Bs.CashCoin size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                            />
                        </ListSection>
                        <AddCompetitionModal
                            visible={addCompetitionModalVisible}
                            setVisible={setAddCompetitionModalVisible}
                            onRefresh={() => {}}
                        />
                    </>
                )}
                <View style={{ height: 80 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
