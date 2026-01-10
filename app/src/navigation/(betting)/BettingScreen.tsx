import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, ImageBackground, Pressable, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase.ts";
import { UserAttributesDB } from "@/lib/database/UserAttributes.ts";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MatchBets } from "@/lib/database/MatchBets.ts";
import { BettingInfoBottomSheet } from "./components/BettingInfoBottomSheet.tsx";
import { ProfilesDB } from "@/lib/database/Profiles.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Profile } from "@/lib/user/profile.ts";
import * as Bs from "@/ui/icons";
import Slider from "@react-native-community/slider";
import { useTheme } from "@/ui/context/ThemeContext.ts";
import { UIText } from "@/ui/components/UIText.tsx";
import type { RootStackScreenProps } from "@/navigation";

interface Player {
    id: string;
    name: string;
    emoji: string;
    betAmount: number;
    betAlliance: string;
}

export interface BettingScreenParams {
    matchNumber: number;
}
export interface BettingScreenProps extends RootStackScreenProps<"MatchBetting/BettingScreen"> {}
export function BettingScreen({ route }: BettingScreenProps) {
    "use no memo"; // TODO: review this
    const { matchNumber } = route.params;
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedAlliance, setSelectedAlliance] = useState<string>();
    const [betAmount, setBetAmount] = useState(0);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [matchOver, setMatchOver] = useState(false);

    const [betActive, setBetActive] = useState(false);
    const [currentBet, setCurrentBet] = useState(0);

    const [subscribed, setSubscribed] = useState(false);
    const [supabaseChannel, setSupabaseChannel] = useState<RealtimeChannel | null>(null);

    const [showBottomSheet, setShowBottomSheet] = useState(false);

    useEffect(() => {
        (async () => {
            const isMatchOver = await MatchBets.isMatchOver(matchNumber);
            setMatchOver(isMatchOver);
            if (isMatchOver) {
                return;
            }
            const user = await UserAttributesDB.getCurrentUserAttribute();
            if (!user) {
                return;
            }
            const profile = await ProfilesDB.getProfile(user.id);
            setUserProfile(profile);
            const existingData = await MatchBets.getMatchBetsForMatch(matchNumber);
            const userExistingData = existingData.find((data) => data.user_id === user.id);
            if (userExistingData) {
                setBetAmount(userExistingData.amount);
                setSelectedAlliance(userExistingData.alliance);
            }
            const channel = supabase.channel(`match-betting-${matchNumber}`, {
                config: {
                    presence: {
                        key: user.id,
                    },
                },
            });
            setSupabaseChannel(channel);
            channel
                .on("presence", { event: "sync" }, () => {
                    const newState = channel.presenceState();
                    console.log("sync", newState);
                    const newPlayers = Object.entries(newState).map(([key, [value]]: [string, any]) => ({
                        id: key,
                        name: value.user_name,
                        emoji: value.user_emoji,
                        betAmount: value.bet_amount,
                        betAlliance: value.bet_alliance,
                    }));
                    for (const player of existingData) {
                        const existingPlayer = existingData.find((p) => p.user_id === player.user_id);
                        if (!newPlayers.find((p) => p.id === player.user_id)) {
                            newPlayers.push({
                                id: player.user_id,
                                name: player.user_name,
                                emoji: player.user_emoji,
                                betAmount: existingPlayer?.amount || 0,
                                betAlliance: existingPlayer?.alliance || "",
                            });
                        } else {
                            newPlayers.map((p) => {
                                if (p.id === player.user_id) {
                                    return {
                                        ...p,
                                        betAmount: existingPlayer?.amount || 0,
                                        betAlliance: existingPlayer?.alliance || "",
                                    };
                                }
                                return p;
                            });
                        }
                    }
                    setPlayers(newPlayers);
                })
                .on("broadcast", { event: "bet" }, ({ payload }) => {
                    console.log("broadcast", payload);
                    setPlayers((prev) =>
                        prev.map((player) => {
                            if (player.id === payload.user_id) {
                                return {
                                    ...player,
                                    betAmount: payload.bet_amount,
                                    betAlliance: payload.bet_alliance,
                                };
                            }
                            return player;
                        })
                    );
                })
                .subscribe(async (status) => {
                    console.log("status", status);
                    if (status !== "SUBSCRIBED") {
                        return;
                    }
                    console.log("sending track");
                    const presenceTrackStatus = await channel.track({
                        user_id: user.id,
                        user_name: profile?.name,
                        user_emoji: profile?.emoji,
                        bet_amount: userExistingData?.amount || 0,
                        bet_alliance: userExistingData?.alliance || "",
                    });
                    console.log("presenceTrackStatus", presenceTrackStatus);
                    setSubscribed(true);
                });
        })();
        return () => {
            if (supabaseChannel) {
                supabaseChannel.untrack().catch((e) => console.error("error untracking", e));
                supabaseChannel.unsubscribe().catch((e) => console.error("error unsubscribing", e));
            }
        };
        // supabaseChannel is not a dependency because it is not used in the effect. if set, will result in inf loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchNumber]);

    useEffect(() => {
        console.log("effect", subscribed, !!supabaseChannel, selectedAlliance);
        if (!selectedAlliance || !supabaseChannel) {
            return;
        }
        console.log("sending bet update", betAmount, selectedAlliance);
        supabaseChannel
            .send({
                type: "broadcast",
                event: "bet",
                payload: {
                    user_id: userProfile?.id,
                    user_name: userProfile?.name,
                    user_emoji: userProfile?.emoji,
                    bet_amount: betAmount,
                    bet_alliance: selectedAlliance,
                },
            })
            .catch((e) => console.error("error sending bet", e));
        // userProfile is not a dependency because it should never change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribed, supabaseChannel, selectedAlliance, betAmount]);

    useEffect(() => {
        AsyncStorage.getItem("bettingTutorialCompleted").then((value) => {
            if (value === "true") {
                setShowBottomSheet(false);
            } else {
                setShowBottomSheet(true);
                AsyncStorage.setItem("bettingTutorialCompleted", "true");
            }
        });
    }, []);

    if (matchOver) {
        return (
            <SafeAreaView>
                <Pressable
                    style={{
                        position: "absolute",
                        top: insets.top,
                        left: 20,
                    }}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Bs.Back size="24" fill={colors.fg.hex} />
                </Pressable>
                <View
                    style={{
                        height: "95%",
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        marginTop: "5%",
                        padding: 20,
                    }}
                >
                    <UIText
                        style={{
                            color: colors.fg.hex,
                            fontSize: 24,
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        Hey, you! Don't try to bet on a match that's over 😉
                    </UIText>
                </View>
            </SafeAreaView>
        );
    }

    if (!userProfile) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Pressable
                    style={{
                        position: "absolute",
                        top: insets.top,
                        left: 20,
                    }}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Bs.Back size="24" fill={colors.fg.hex} />
                </Pressable>
                <View
                    style={{
                        height: "95%",
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        marginTop: "5%",
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {players.length >= 2 &&
                            players
                                .filter((p: Player) => p.id !== userProfile.id)
                                .map((player: Player) => (
                                    <View style={{ flexDirection: "column", alignItems: "center" }} key={player.id}>
                                        <UIText
                                            style={{
                                                color: colors.fg.hex,
                                                fontSize: 60,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {player.emoji}
                                        </UIText>
                                        <UIText
                                            style={{
                                                color: colors.fg.hex,
                                                fontSize: 14,
                                            }}
                                        >
                                            {player.name}
                                        </UIText>
                                        <UIText
                                            style={{
                                                color: player.betAlliance ? player.betAlliance : colors.fg.hex,
                                                fontSize: 18,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {player.betAmount}
                                        </UIText>
                                    </View>
                                ))}
                        {!players ||
                            (players.length < 2 && (
                                <UIText style={{ color: colors.fg.hex, fontSize: 18 }}>Waiting for players...</UIText>
                            ))}
                    </View>

                    <UIText style={{ color: colors.fg.hex, fontSize: 30, fontWeight: "bold" }}>
                        Match {matchNumber}
                    </UIText>
                    <UIText style={{ color: colors.fg.hex, fontSize: 18 }}>Select Alliance</UIText>
                    <View style={{ flexDirection: "row", gap: 20, width: "80%" }}>
                        {!selectedAlliance ? (
                            <>
                                <Pressable
                                    style={{
                                        backgroundColor: colors.bg1.hex,
                                        opacity: selectedAlliance === "blue" ? 1 : 0.5,
                                        padding: 20,
                                        borderRadius: 10,
                                        flex: 1,
                                    }}
                                    onPress={() => {
                                        setSelectedAlliance("blue");
                                    }}
                                >
                                    <Image
                                        source={require("../../assets/images/dozerblue.png")}
                                        style={{
                                            width: "100%",
                                            height: null,
                                            aspectRatio: 1,
                                        }}
                                    />
                                </Pressable>
                                <Pressable
                                    style={{
                                        backgroundColor: colors.bg1.hex,
                                        opacity: selectedAlliance === "red" ? 1 : 0.5,
                                        padding: 20,
                                        borderRadius: 10,
                                        flex: 1,
                                    }}
                                    onPress={() => {
                                        setSelectedAlliance("red");
                                    }}
                                >
                                    <Image
                                        source={require("../../assets/images/dozerred.png")}
                                        style={{
                                            width: "100%",
                                            height: null,
                                            aspectRatio: 1,
                                        }}
                                    />
                                </Pressable>
                            </>
                        ) : (
                            <UIText style={{ color: colors.fg.hex, fontSize: 18 }}>
                                Your selected alliance: {selectedAlliance}
                            </UIText>
                        )}
                    </View>
                    <View style={{ flex: 1 }} />
                    {betActive && (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "90%",
                                gap: 20,
                            }}
                        >
                            <UIText
                                style={{
                                    color: colors.fg.hex,
                                    fontSize: 18,
                                    alignSelf: "center",
                                }}
                            >
                                {currentBet}
                            </UIText>
                            <Slider
                                containerStyle={{
                                    flex: 1,
                                    alignSelf: "center",
                                }}
                                value={currentBet}
                                onValueChange={(value: number) => setCurrentBet(value)}
                                minimumValue={1}
                                maximumValue={1000}
                                step={1}
                            />
                            <Pressable
                                style={{
                                    backgroundColor: colors.bg1.hex,
                                    borderRadius: 99,
                                    padding: 20,
                                }}
                                onPress={async () => {
                                    setBetActive(false);
                                    setCurrentBet(0);
                                    setBetAmount((prev: number) => prev + Number(currentBet));
                                    console.log("BET AMOUNT", betAmount, currentBet);
                                    if (betAmount === 0) {
                                        await MatchBets.createMatchBet(
                                            userProfile.id,
                                            matchNumber,
                                            selectedAlliance!,
                                            Number(currentBet)
                                        );
                                    } else {
                                        await MatchBets.updateMatchBet(
                                            userProfile.id,
                                            matchNumber,
                                            Number(currentBet) + betAmount
                                        );
                                    }
                                }}
                            >
                                <Bs.ArrowUp size="24" fill={colors.fg.hex} />
                            </Pressable>
                        </View>
                    )}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "80%",
                            gap: 20,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <ImageBackground
                                source={require("../../assets/images/betGradient.png")}
                                style={{
                                    width: "100%",
                                    borderRadius: 10,
                                    overflow: "hidden",
                                    alignSelf: "flex-start",
                                }}
                                resizeMode="cover"
                            >
                                <Pressable
                                    style={{
                                        backgroundColor: colors.bg1.hex,
                                        padding: 20,
                                        borderRadius: 10,
                                        alignSelf: "flex-start",
                                        width: "100%",
                                        opacity:
                                            selectedAlliance && userProfile.scoutcoins > 0 && players.length >= 2
                                                ? 0.5
                                                : 1,
                                    }}
                                    onPress={() => {
                                        if (userProfile.scoutcoins < 0 || !selectedAlliance || players.length < 2) {
                                            return;
                                        }
                                        setBetActive(true);
                                    }}
                                >
                                    <UIText
                                        style={{
                                            color: colors.fg.hex,
                                            fontSize: 18,
                                            textAlign: "center",
                                        }}
                                    >
                                        Bet
                                    </UIText>
                                </Pressable>
                            </ImageBackground>
                            {/* TODO: query scoutcoins properly (please don't use userProfile because that will be cached and account balance should never be cached) */}
                            <UIText>Your balance: {userProfile.scoutcoins}</UIText>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: colors.bg1.hex,
                                padding: 20,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <UIText
                                style={{
                                    color: colors.fg.hex,
                                    fontSize: 60,
                                    fontWeight: "bold",
                                }}
                            >
                                {userProfile.emoji}
                            </UIText>
                            <UIText
                                style={{
                                    color: colors.fg.hex,
                                    fontSize: 18,
                                    fontWeight: "bold",
                                }}
                            >
                                {betAmount}
                            </UIText>
                        </View>
                    </View>
                </View>
                {showBottomSheet && <BettingInfoBottomSheet />}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
