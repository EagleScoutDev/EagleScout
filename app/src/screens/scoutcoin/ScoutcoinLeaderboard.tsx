import { useEffect, useMemo, useState } from "react";
import { UIText } from "../../ui/UIText";
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { ProfilesDB } from "../../database/Profiles";
import { SendScoutcoinModal } from "./SendScoutcoinModal";
import { useProfile } from "../../lib/hooks/useProfile";
import * as Bs from "../../ui/icons";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";
import type { Theme } from "../../theme";

interface LeaderboardUser {
    id: string;
    name: string;
    emoji: string;
    scoutcoins: number;
}

const LeaderboardUserItem = ({
    place,
    user,
    setSendingScoutcoinUser,
}: {
    place: number;
    user: LeaderboardUser;
    setSendingScoutcoinUser: (user: LeaderboardUser) => void;
}) => {
    "use memo";
    const { colors } = useTheme();
    const { profile } = useProfile();
    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            padding: 10,
            paddingHorizontal: 30,
            width: "100%",
            alignItems: "center",
            gap: 20,
        },
        place: {
            width: 20,
            textAlign: "center",
            alignItems: "center",
        },
        placeText: {
            color: colors.fg.hex,
        },
        emoji: {
            fontSize: 34,
        },
        innerContainer: {
            flexDirection: "column",
        },
        name: {
            color: colors.fg.hex,
            fontWeight: "bold",
        },
        coins: {
            color: colors.fg.hex,
        },
        coinContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
        },
    });
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={async () => {
                if (user.id === profile?.id) {
                    Alert.alert("You cannot send Scoutcoin to yourself!");
                    return;
                }
                setSendingScoutcoinUser(user);
            }}
        >
            <View style={styles.place}>
                <UIText style={styles.placeText}>{place}</UIText>
            </View>
            <UIText style={styles.emoji}>{user.emoji}</UIText>
            <View style={styles.innerContainer}>
                <UIText style={styles.name}>{user.name}</UIText>
                <View style={styles.coinContainer}>
                    <UIText style={styles.coins}>{user.scoutcoins}</UIText>
                    <Bs.Coin size="12" fill={colors.fg.hex} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export function ScoutcoinLeaderboard() {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
    const [filteredLeaderboardUsers, setFilteredLeaderboardUsers] = useState<
        {
            user: LeaderboardUser;
            place: number;
        }[]
    >([]);
    const [sendingScoutcoinUser, setSendingScoutcoinUser] = useState<LeaderboardUser | null>(null);

    useEffect(() => {
        ProfilesDB.getAllProfiles().then((profiles) => {
            const leaderboardProfiles = profiles
                .map((profile) => ({
                    id: profile.id,
                    name: profile.name,
                    emoji: profile.emoji,
                    scoutcoins: profile.scoutcoins,
                }))
                .sort((a, b) => b.scoutcoins - a.scoutcoins);
            setLeaderboardUsers(leaderboardProfiles);
            setFilteredLeaderboardUsers(
                leaderboardProfiles.map((user, index) => ({
                    user,
                    place: index + 1,
                }))
            );
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.filter}>
                <TextInput
                    placeholder="Search people"
                    onChangeText={(text) => {
                        setFilteredLeaderboardUsers(
                            leaderboardUsers
                                .map((user, index) => ({
                                    user,
                                    place: index + 1,
                                }))
                                .filter(({ user }) => user.name.toLowerCase().includes(text.toLowerCase()))
                        );
                    }}
                    style={styles.filterText}
                    selectionColor={theme.colors.fg.hex}
                    cursorColor={theme.colors.fg.hex}
                    placeholderTextColor={theme.colors.fg.hex}
                />
            </View>
            <FlatList
                data={filteredLeaderboardUsers}
                renderItem={({ item }) => (
                    <LeaderboardUserItem
                        place={item.place}
                        user={item.user}
                        setSendingScoutcoinUser={setSendingScoutcoinUser}
                    />
                )}
                keyExtractor={(item) => item.user.id}
            />
            {sendingScoutcoinUser && (
                <SendScoutcoinModal targetUser={sendingScoutcoinUser} onClose={() => setSendingScoutcoinUser(null)} />
            )}
        </View>
    );
}

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        filter: {
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
        },
        filterText: {
            color: colors.fg.hex,
            padding: 10,
            backgroundColor: colors.bg1.hex,
            borderRadius: 5,
        },
    });
