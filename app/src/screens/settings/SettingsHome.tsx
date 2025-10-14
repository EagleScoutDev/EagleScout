import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { InternetStatus } from "../../lib/InternetStatus";
import { UserProfileBox } from "../../components/UserProfileBox.tsx";
import { SettingsPopup } from "./SettingsPopup";
import { useEffect, useMemo, useState } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import { type SettingsMenuScreenProps } from "./SettingsMenu";
import * as Bs from "../../ui/icons";
import { CompetitionsDB } from "../../database/Competitions";
import { useProfile } from "../../lib/react/hooks/useProfile";
import { ScoutcoinLedger } from "../../database/ScoutcoinLedger";
import { useAccount } from "../../lib/react/hooks/useAccount";
import { UIList } from "../../ui/UIList.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabHeader } from "../../ui/navigation/TabHeader.tsx";

const VERSION = "7.7.1";

export interface SettingsHomeProps extends SettingsMenuScreenProps<"Home"> {}
export function SettingsHome({ navigation }: SettingsHomeProps) {
    const { colors } = useTheme();
    const [settingsPopupActive, setSettingsPopupActive] = useState(false);
    const { account, logout } = useAccount();
    const { profile } = useProfile();

    const user = useMemo(() => {
        console.log(account, profile);
        return account && profile ? { account, profile } : null;
    }, [account, profile]);

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
        <SafeAreaView edges={{ bottom: "off", top: "additive" }} style={{ width: "100%", height: "100%" }}>
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

            <UserProfileBox user={user} scoutcoins={scoutcoins} />
            <UIList contentContainerStyle={{ paddingBottom: 24 }}>
                {[
                    UIList.Section({
                        header: "Account",
                        items: [
                            UIList.Item({
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
                            UIList.Item({
                                icon: Bs.Asterisk,
                                label: "Change Password",
                                caret: true,
                                disabled: internetStatus !== InternetStatus.CONNECTED,
                                onPress: () => {
                                    navigation.navigate("Account/ChangePassword");
                                },
                            }),
                            UIList.Item({
                                icon: Bs.Ban,
                                label: "Request Account Deletion",
                                caret: true,
                                disabled: internetStatus !== InternetStatus.CONNECTED,
                                onPress: () => {
                                    navigation.navigate("Account/Delete");
                                },
                            }),
                            UIList.Item({
                                icon: Bs.QuestionCircle,
                                label: "Contact Support",
                                caret: false,
                                disabled: false,
                                onPress: () => {
                                    Linking.openURL("https://forms.gle/vbLEhyouNgUShhDp9");
                                },
                            }),
                            UIList.Item({
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
                            UIList.Item({
                                icon: Bs.JournalBookmarkFill,
                                label: "View Your Reports",
                                caret: true,
                                disabled: false,
                                onPress: () => {
                                    navigation.navigate("Scout/Reports");
                                },
                            }),
                            UIList.Item({
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
                            UIList.Item({
                                icon: Bs.Bug,
                                label: "Debug",
                                caret: true,
                                disabled: false,
                                onPress: () => {
                                    navigation.navigate("Debug/Home");
                                },
                            }),
                        ],
                    }),
                ]}
            </UIList>
            <Text
                selectable={true}
                style={{
                    color: colors.text,
                    textAlign: "center",
                }}
            >
                v{VERSION}
            </Text>

            <SettingsPopup
                visible={settingsPopupActive}
                setVisible={setSettingsPopupActive}
                navigation={useNavigation()}
            />
        </SafeAreaView>
    );
}
