import { Alert, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { InternetStatus } from "../../lib/InternetStatus";
import { UserProfileBox } from "../../components/UserProfileBox.tsx";
import { ListSection } from "../../ui/ListSection.tsx";
import { ListItem } from "../../ui/ListItem";
import { SettingsPopup } from "./SettingsPopup";
import { useEffect, useMemo, useState } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import { getLighterColor, parseColor } from "../../lib/color";
import { type SettingsMenuScreenProps } from "./SettingsMenu";
import * as Bs from "../../ui/icons";
import { CompetitionsDB } from "../../database/Competitions";
import { useProfile } from "../../lib/hooks/useProfile";
import { ScoutcoinLedger } from "../../database/ScoutcoinLedger";
import { useAccount } from "../../lib/hooks/useAccount";

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

    const styles = StyleSheet.create({
        title: {
            fontSize: 34,
            fontWeight: "600",
            color: colors.text,
        },
    });

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
        <SafeAreaView
            style={{
                paddingHorizontal: "2%",
                flex: 1,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 20,
                }}
            >
                <Text style={styles.title}>Profile</Text>
                {/*<TabHeader title={'Profile'} />*/}

                <Pressable onPress={() => setSettingsPopupActive(true)}>
                    <Bs.GearWideConnected size="32" fill={getLighterColor(parseColor(colors.primary))} />
                </Pressable>
            </View>
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

            <ScrollView>
                <UserProfileBox user={user} scoutcoins={scoutcoins} />

                <ListSection title={"Account"}>
                    <ListItem
                        text="Edit Profile"
                        onPress={() => {
                            navigation.navigate("Account/EditProfile", {
                                initialFirstName: profile ? profile.firstName : "",
                                initialLastName: profile ? profile.lastName : "",
                            });
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.PenFill size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text="Change Password"
                        onPress={() => {
                            navigation.navigate("Account/ChangePassword");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Asterisk size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text="Request Account Deletion"
                        onPress={() => {
                            navigation.navigate("Account/Delete");
                        }}
                        caret={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Ban size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Contact Support"}
                        onPress={() => {
                            // open a link to google.com
                            Linking.openURL("https://forms.gle/vbLEhyouNgUShhDp9").then(() => {
                                console.log("Opened support link");
                            });
                        }}
                        caret={false}
                        disabled={false}
                        icon={<Bs.QuestionCircle size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Sign Out"}
                        onPress={() => attemptSignOut()}
                        caret={false}
                        disabled={false}
                        icon={<Bs.BoxArrowRight size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                </ListSection>
                <ListSection title={"Submissions"}>
                    <ListItem
                        text="View Your Reports"
                        onPress={() => {
                            navigation.navigate("Scout/Reports");
                        }}
                        caret={true}
                        disabled={false}
                        icon={<Bs.JournalBookmarkFill size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text="View Your Notes"
                        onPress={() => {
                            navigation.navigate("Scout/Notes");
                        }}
                        caret={true}
                        disabled={false}
                        icon={<Bs.Sticky size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                </ListSection>
                <SettingsPopup
                    visible={settingsPopupActive}
                    setVisible={setSettingsPopupActive}
                    navigation={useNavigation()}
                />
                <Text
                    selectable={true}
                    style={{
                        color: colors.text,
                        textAlign: "center",
                    }}
                >
                    v{VERSION}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
