import { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SendScoutcoinModal } from "./components/SendScoutcoinModal";
import * as Bs from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import type { Theme } from "@/ui/lib/theme";
import { useQueries, useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export interface LeaderboardUser {
    id: string;
    name: string | null;
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
    const { colors } = useTheme();
    const { data: profile = null } = useQuery(queries.profiles.current);

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
    const [sendingScoutcoinUser, setSendingScoutcoinUser] = useState<LeaderboardUser | null>(null);
    const [searchText, setSearchText] = useState("");

    const leaderboardUsers = useQueries({
        queries: [queries.scoutcoinLedger.balanceForAll, queries.profiles.all],
        combine: ([balances, profiles]): LeaderboardUser[] => {
            if (balances.data === undefined || profiles.data === undefined) {
                return [];
            }

            const bals = new Map(balances.data.map((b) => [b.userId, b.balance]));
            return profiles.data
                .map((profile) => ({
                    id: profile.id,
                    name: profile.name,
                    emoji: profile.emoji,
                    scoutcoins: bals.get(profile.id)!,
                }))
                .sort((a, b) => a.scoutcoins - b.scoutcoins);
        },
    });

    const filteredLeaderboardUsers = useMemo(() => {
        const ranked = leaderboardUsers.map((user, index) => ({ user, place: index + 1 }));
        if (!searchText) return ranked;
        return ranked.filter(({ user }) =>
            user.name?.toLowerCase().includes(searchText.toLowerCase()),
        );
    }, [leaderboardUsers, searchText]);

    return (
        <View style={styles.container}>
            <View style={styles.filter}>
                <TextInput
                    placeholder="Search people"
                    onChangeText={setSearchText}
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
                <SendScoutcoinModal
                    targetUser={sendingScoutcoinUser}
                    onClose={() => setSendingScoutcoinUser(null)}
                />
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
