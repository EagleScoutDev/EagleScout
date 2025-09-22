import { Alert, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { InternetStatus } from "../../lib/InternetStatus";
import { UserProfileBox } from "../../components/UserProfileBox";
import { ListItemContainer } from "../../components/ListItemContainer";
import { ListItem } from "../../components/ListItem";
import { SettingsPopup } from "./SettingsPopup";
import { useEffect, useMemo, useState } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import { getLighterColor, parseColor } from "../../lib/color";
import { type SettingsMenuScreenProps } from "./SettingsMenu";
import * as Bs from "../../components/icons/icons.generated";
import { CompetitionsDB } from "../../database/Competitions.ts";
import { useProfile } from "../../lib/hooks/useProfile.ts";
import { ScoutcoinLedger } from "../../database/ScoutcoinLedger.ts";
import { useAccount } from "../../lib/hooks/useAccount.ts";

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
                    <Svg width={32} height={32} viewBox="0 0 16 16">
                        <Path
                            fill={getLighterColor(parseColor(colors.primary))}
                            d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"
                        />
                    </Svg>
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

                <ListItemContainer title={"Account"}>
                    <ListItem
                        text="Edit Profile"
                        onPress={() => {
                            navigation.navigate("Account/EditProfile", {
                                initialFirstName: profile ? profile.firstName : "",
                                initialLastName: profile ? profile.lastName : "",
                            });
                        }}
                        caretVisible={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.PenFill size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text="Change Password"
                        onPress={() => {
                            navigation.navigate("Account/ChangePassword");
                        }}
                        caretVisible={true}
                        disabled={internetStatus !== InternetStatus.CONNECTED}
                        icon={<Bs.Asterisk size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text="Request Account Deletion"
                        onPress={() => {
                            navigation.navigate("Account/Delete");
                        }}
                        caretVisible={true}
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
                        caretVisible={false}
                        disabled={false}
                        icon={<Bs.QuestionCircle size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text={"Sign Out"}
                        onPress={() => attemptSignOut()}
                        caretVisible={false}
                        disabled={false}
                        icon={<Bs.BoxArrowRight size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                </ListItemContainer>
                <ListItemContainer title={""}>
                    <ListItem
                        text="View Your Reports"
                        onPress={() => {
                            navigation.navigate("Scout/Reports");
                        }}
                        caretVisible={true}
                        disabled={false}
                        icon={<Bs.JournalBookmarkFill size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                    <ListItem
                        text="View Your Notes"
                        onPress={() => {
                            navigation.navigate("Scout/Notes");
                        }}
                        caretVisible={true}
                        disabled={false}
                        icon={<Bs.Sticky size="16" fill={getLighterColor(parseColor(colors.primary))} />}
                    />
                </ListItemContainer>
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
