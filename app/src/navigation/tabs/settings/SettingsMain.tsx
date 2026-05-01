import { ActivityIndicator, Alert, Linking, View } from "react-native";
import { type SettingsTabScreenProps } from "./index";
import { useUserStore } from "@/lib/stores/user";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { type Account } from "@/lib/db/account";
import { useTheme } from "@/ui/context/ThemeContext";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIText } from "@/ui/components/UIText";
import { UIList } from "@/ui/components/UIList";
import * as Bs from "@/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import type { Profile } from "@/lib/db/models/Profile";

export interface SettingsHomeProps extends SettingsTabScreenProps<"Main"> {}
export function SettingsMain({ navigation }: SettingsHomeProps) {
    const account = useUserStore((state) => state.account);
    const signOut = useUserStore((state) => state.signOut);
    const { data: profile = null } = useQuery(queries.profiles.current);

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
        signOut().then(() => {
            console.log("Sign out successful");
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Settings"} />
            </SafeAreaView>

            <UIList>
                <UIList.Card>
                    <AccountCard account={account} profile={profile} />
                </UIList.Card>

                <UIList.Section title={"Account"}>
                    <UIList.Row
                        icon={Bs.Asterisk}
                        label={"Change Password"}
                        caret
                        onPress={() => navigation.navigate("Account/ChangePassword")}
                    />
                    <UIList.Row
                        icon={Bs.Ban}
                        label={"Request Account Deletion"}
                        caret
                        onPress={() => navigation.navigate("Account/Delete")}
                    />
                    <UIList.Row
                        icon={Bs.QuestionCircle}
                        label={"Contact Support"}
                        onPress={() => {
                            Linking.openURL("https://forms.gle/vbLEhyouNgUShhDp9");
                        }}
                    />
                    <UIList.Row
                        icon={Bs.BoxArrowRight}
                        label={"Sign Out"}
                        onPress={attemptSignOut}
                    />
                </UIList.Section>
                <UIList.Section title={"Submissions"}>
                    <UIList.Row
                        icon={Bs.JournalBookmarkFill}
                        label={"View Your Reports"}
                        caret
                        onPress={() => navigation.navigate("Scout/SelectCompetitionForReports")}
                    />
                    <UIList.Row
                        icon={Bs.Sticky}
                        label={"View Your Notes"}
                        caret
                        onPress={() => navigation.navigate("Scout/SelectCompetitionForNotes")}
                    />
                </UIList.Section>
                <UIList.Section title={"Other"}>
                    <UIList.Row
                        icon={Bs.Bug}
                        label={"Debug"}
                        caret
                        onPress={() => navigation.navigate("Debug/Main")}
                    />
                    <UIList.Row
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

    const { data: scoutcoins = null } = useQuery({
        ...queries.scoutcoinLedger.balanceForId({ id: profile?.id ?? "" }),
        enabled: !!profile,
    });

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
                        <UIText>
                            {account.scouter ? "Scouter" : account.admin ? "Admin" : "Unknown Role"}
                        </UIText>
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
