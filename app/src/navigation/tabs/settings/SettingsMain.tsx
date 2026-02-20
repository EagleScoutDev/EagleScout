import { ActivityIndicator, Alert, Linking, Pressable, View } from "react-native";
import { InternetStatus } from "@/lib/InternetStatus";
import { useEffect, useState } from "react";
import { type SettingsTabScreenProps } from "./index";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { useProfile } from "@/lib/hooks/useProfile";
import { ScoutcoinLedger } from "@/lib/database/ScoutcoinLedger";
import { useUserStore } from "@/lib/stores/user";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { type Account, AccountRole } from "@/lib/user/account";
import { useTheme } from "@/ui/context/ThemeContext";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIText } from "@/ui/components/UIText";
import { UIList } from "@/ui/components/UIList";
import * as Bs from "@/ui/icons";
import type { Profile } from "@/lib/user/profile";

export interface SettingsHomeProps extends SettingsTabScreenProps<"Main"> {}
export function SettingsMain({ navigation }: SettingsHomeProps) {
    const account = useUserStore((state) => state.account);
    const logout = useUserStore((state) => state.logout);
    const { profile } = useProfile();

    const [internetStatus, setInternetStatus] = useState(InternetStatus.NOT_ATTEMPTED);
    const offline = internetStatus !== InternetStatus.CONNECTED;

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
            ],
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
                        <UIText placeholder style={{ flex: 1 }}>
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
                <UIList.Section>
                    <AccountCard account={account} profile={profile} />
                </UIList.Section>

                <UIList.Section title={"Account"}>
                    <UIList.Label
                        icon={Bs.Asterisk}
                        label={"Change Password"}
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("Account/ChangePassword")}
                    />
                    <UIList.Label
                        icon={Bs.Ban}
                        label={"Request Account Deletion"}
                        caret
                        disabled={offline}
                        onPress={() => navigation.navigate("Account/Delete")}
                    />
                    <UIList.Label
                        icon={Bs.QuestionCircle}
                        label={"Contact Support"}
                        onPress={() => {
                            Linking.openURL("https://forms.gle/vbLEhyouNgUShhDp9");
                        }}
                    />
                    <UIList.Label
                        icon={Bs.BoxArrowRight}
                        label={"Sign Out"}
                        onPress={attemptSignOut}
                    />
                </UIList.Section>
                <UIList.Section title={"Submissions"}>
                    <UIList.Label
                        icon={Bs.JournalBookmarkFill}
                        label={"View Your Reports"}
                        caret
                        onPress={() => navigation.navigate("Scout/SelectCompetitionForReports")}
                    />
                    <UIList.Label
                        icon={Bs.Sticky}
                        label={"View Your Notes"}
                        caret
                        onPress={() => navigation.navigate("Scout/SelectCompetitionForNotes")}
                    />
                </UIList.Section>
                <UIList.Section title={"Other"}>
                    <UIList.Label
                        icon={Bs.Bug}
                        label={"Debug"}
                        caret
                        onPress={() => navigation.navigate("Debug/Main")}
                    />
                    <UIList.Label
                        icon={Bs.QuestionCircle}
                        label={"About"}
                        caret
                        onPress={() => navigation.navigate("About")}
                    />
                </UIList.Section>
            </UIList>
        </SafeAreaProvider>
    );
}

interface AccountCardProps {
    account: Account | null;
    profile: Profile | null;
}
function AccountCard({ account, profile }: AccountCardProps) {
    const { colors } = useTheme();

    const [scoutcoins, setScoutcoins] = useState<number | null>(null);
    useEffect(() => {
        if (profile) ScoutcoinLedger.getBalance(profile.id).then(setScoutcoins);
        else setScoutcoins(null);
    }, [profile]);

    return (
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
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <Bs.Coin size={24} fill={colors.fg.hex} />
                        <UIText size={18}>{scoutcoins}</UIText>
                    </View>
                </>
            ) : (
                <ActivityIndicator />
            )}
        </View>
    );
}
