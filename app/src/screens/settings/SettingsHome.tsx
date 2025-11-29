import { ActivityIndicator, Alert, Linking, Pressable, View } from "react-native";
import { InternetStatus } from "../../lib/InternetStatus";
import { useEffect, useState } from "react";

import { type SettingsMenuScreenProps } from "./SettingsMenu";
import * as Bs from "../../ui/icons";
import { CompetitionsDB } from "../../database/Competitions";
import { useProfile } from "../../lib/hooks/useProfile";
import { ScoutcoinLedger } from "../../database/ScoutcoinLedger";
import { useUserStore } from "../../lib/stores/user";
import { UIList } from "../../ui/UIList";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "../../ui/navigation/TabHeader";
import { AccountRole } from "../../lib/user/account";
import { UIText } from "../../ui/UIText";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface SettingsHomeProps extends SettingsMenuScreenProps<"Home"> {}
export function SettingsHome({ navigation }: SettingsHomeProps) {
    const { colors } = useTheme();
    const { account, logout } = useUserStore();
    const { profile } = useProfile();

    const [scoutcoins, setScoutcoins] = useState<number | null>(null);
    useEffect(() => {
        if (profile) ScoutcoinLedger.getBalance(profile.id).then(setScoutcoins);
        else setScoutcoins(null);
    }, [profile]);

    const [internetStatus, setInternetStatus] = useState(InternetStatus.NOT_ATTEMPTED);

    const attemptSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out? You will require an internet connection to use the app again.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                { text: "OK", onPress: () => signOutFunction() },
            ]
        );
    };

    const signOutFunction = () => {
        logout().then(() => {
            console.log("Sign out successful");
        });
    };

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

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Settings"} />
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
                            <UIText bold style={{ flex: 1 }}>
                                Try again?
                            </UIText>
                        </Pressable>
                    </View>
                )}
            </SafeAreaView>

            <UIList>
                {[
                    UIList.Section({
                        items: [
                            {
                                render: () => (
                                    <View
                                        style={{
                                            height: 72,
                                            flex: 1,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {profile && account ? (
                                            <>
                                                <View
                                                    style={{
                                                        width: 64,
                                                        height: 64,
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <UIText size={48}>{profile.emoji}</UIText>
                                                </View>
                                                <View style={{ flex: 1, marginRight: "auto" }}>
                                                    <UIText
                                                        size={20}
                                                        numberOfLines={1}
                                                        style={{ flexShrink: 1, marginBottom: 4 }}
                                                    >
                                                        {profile.name}
                                                    </UIText>
                                                    <UIText>{AccountRole.getName(account.role)}</UIText>
                                                </View>
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                                    <Bs.Coin size={24} fill={colors.fg.hex} />
                                                    <UIText size={18}>{scoutcoins}</UIText>
                                                </View>
                                            </>
                                        ) : (
                                            <ActivityIndicator />
                                        )}
                                    </View>
                                ),
                            },
                        ],
                    }),

                    UIList.Section({
                        header: "Account",
                        items: [
                            UIList.Label({
                                icon: Bs.PenFill,
                                label: "Edit Profile",
                                caret: true,
                                disabled: internetStatus !== InternetStatus.CONNECTED,
                                onPress: () => {
                                    navigation.navigate("Account/EditProfile", {
                                        initialFirstName: profile ? profile.firstName : "",
                                        initialLastName: profile ? profile.lastName : "",
                                    });
                                },
                            }),
                            UIList.Label({
                                icon: Bs.Asterisk,
                                label: "Change Password",
                                caret: true,
                                disabled: internetStatus !== InternetStatus.CONNECTED,
                                onPress: () => {
                                    navigation.navigate("Account/ChangePassword");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.Ban,
                                label: "Request Account Deletion",
                                caret: true,
                                disabled: internetStatus !== InternetStatus.CONNECTED,
                                onPress: () => {
                                    navigation.navigate("Account/Delete");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.QuestionCircle,
                                label: "Contact Support",
                                caret: false,
                                disabled: false,
                                onPress: () => {
                                    Linking.openURL("https://forms.gle/vbLEhyouNgUShhDp9");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.BoxArrowRight,
                                label: "Sign Out",
                                caret: false,
                                disabled: false,
                                onPress: () => attemptSignOut(),
                            }),
                        ],
                    }),
                    UIList.Section({
                        header: "Submissions",
                        items: [
                            UIList.Label({
                                icon: Bs.JournalBookmarkFill,
                                label: "View Your Reports",
                                caret: true,
                                disabled: false,
                                onPress: () => {
                                    navigation.navigate("Scout/SelectCompetitionForReports");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.Sticky,
                                label: "View Your Notes",
                                caret: true,
                                disabled: false,
                                onPress: () => {
                                    navigation.navigate("Scout/SelectCompetitionForNotes");
                                },
                            }),
                        ],
                    }),
                    UIList.Section({
                        header: "Other",
                        items: [
                            UIList.Label({
                                icon: Bs.Bug,
                                label: "Debug",
                                caret: true,
                                disabled: false,
                                onPress: () => {
                                    navigation.navigate("Debug/Home");
                                },
                            }),
                            UIList.Label({
                                icon: Bs.QuestionCircle,
                                label: "About",
                                caret: true,
                                disabled: false,
                                onPress: () => {
                                    navigation.navigate("About");
                                },
                            }),
                        ],
                    }),
                ]}
            </UIList>
        </SafeAreaProvider>
    );
}
