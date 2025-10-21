import { ActivityIndicator, Alert, Linking, Pressable, Text, View } from "react-native";
import { InternetStatus } from "../../lib/InternetStatus";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { type SettingsMenuScreenProps } from "./SettingsMenu";
import * as Bs from "../../ui/icons";
import { CompetitionsDB } from "../../database/Competitions";
import { useProfile } from "../../lib/hooks/useProfile.ts";
import { ScoutcoinLedger } from "../../database/ScoutcoinLedger";
import { useUserStore } from "../../lib/stores/user.ts";
import { UIList } from "../../ui/UIList.tsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "../../ui/navigation/TabHeader.tsx";
import { AccountRole } from "../../lib/user/account.ts";

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
            <SafeAreaView style={{ flex: 1 }}>
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
                        <Text style={{ flex: 1, color: "grey" }}>
                            Some features may be disabled until you regain an internet connection.
                        </Text>
                        <Pressable onPress={testConnection}>
                            <Text
                                style={{
                                    flex: 1,
                                    color: colors.primary,
                                    fontWeight: "bold",
                                }}
                            >
                                Try again?
                            </Text>
                        </Pressable>
                    </View>
                )}

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
                                                        <Text style={{ fontSize: 48 }}>{profile.emoji}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, marginRight: "auto" }}>
                                                        <Text
                                                            style={{ flexShrink: 1, fontSize: 20, marginBottom: 4 }}
                                                            numberOfLines={1}
                                                        >
                                                            {profile.name}
                                                        </Text>
                                                        <Text>{AccountRole.getName(account.role)}</Text>
                                                    </View>
                                                    <View
                                                        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                                                    >
                                                        <Bs.Coin size={24} fill={colors.text} />
                                                        <Text style={{ fontSize: 18 }}>{scoutcoins}</Text>
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
                                UIList.Line({
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
                                UIList.Line({
                                    icon: Bs.Asterisk,
                                    label: "Change Password",
                                    caret: true,
                                    disabled: internetStatus !== InternetStatus.CONNECTED,
                                    onPress: () => {
                                        navigation.navigate("Account/ChangePassword");
                                    },
                                }),
                                UIList.Line({
                                    icon: Bs.Ban,
                                    label: "Request Account Deletion",
                                    caret: true,
                                    disabled: internetStatus !== InternetStatus.CONNECTED,
                                    onPress: () => {
                                        navigation.navigate("Account/Delete");
                                    },
                                }),
                                UIList.Line({
                                    icon: Bs.QuestionCircle,
                                    label: "Contact Support",
                                    caret: false,
                                    disabled: false,
                                    onPress: () => {
                                        Linking.openURL("https://forms.gle/vbLEhyouNgUShhDp9");
                                    },
                                }),
                                UIList.Line({
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
                                UIList.Line({
                                    icon: Bs.JournalBookmarkFill,
                                    label: "View Your Reports",
                                    caret: true,
                                    disabled: false,
                                    onPress: () => {
                                        navigation.navigate("Scout/Reports");
                                    },
                                }),
                                UIList.Line({
                                    icon: Bs.Sticky,
                                    label: "View Your Notes",
                                    caret: true,
                                    disabled: false,
                                    onPress: () => {
                                        navigation.navigate("Scout/Notes");
                                    },
                                }),
                            ],
                        }),
                        UIList.Section({
                            header: "Other",
                            items: [
                                UIList.Line({
                                    icon: Bs.Bug,
                                    label: "Debug",
                                    caret: true,
                                    disabled: false,
                                    onPress: () => {
                                        navigation.navigate("Debug/Home");
                                    },
                                }),
                                UIList.Line({
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
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
