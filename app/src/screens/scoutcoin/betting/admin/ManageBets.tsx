import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { type MatchBet, MatchBets } from "../../../../database/MatchBets";
import { supabase } from "../../../../lib/supabase";
import { Color } from "../../../../lib/color";

const BetCard = ({
    matchNumber,
    onConfirm,
}: {
    matchNumber: number;
    onConfirm: (result: "red" | "blue" | "tie") => void;
}) => {
    const [pressed, setPressed] = useState(false);
    const { colors } = useTheme();
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: colors.card,
                padding: 15,
                margin: 10,
                borderRadius: 10,
            }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {pressed && <ActivityIndicator size="small" color={colors.text} style={{ marginRight: 10 }} />}
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    Match {matchNumber}
                </Text>
            </View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Pressable
                    style={{
                        backgroundColor: colors.primary,
                        padding: 10,
                        borderRadius: 10,
                        margin: 10,
                    }}
                    onPress={() => {
                        if (pressed) {
                            return;
                        }
                        setPressed(true);
                        onConfirm("blue");
                    }}
                >
                    <Text
                        style={{
                            color: Color.rgb(0, 0, 255).fg.hex,
                        }}
                    >
                        Blue win
                    </Text>
                </Pressable>
                <Pressable
                    style={{
                        padding: 10,
                        borderRadius: 10,
                        margin: 10,
                    }}
                    onPress={() => {
                        if (pressed) {
                            return;
                        }
                        setPressed(true);
                        onConfirm("tie");
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                        }}
                    >
                        Tie
                    </Text>
                </Pressable>
                <Pressable
                    style={{
                        backgroundColor: colors.notification,
                        padding: 10,
                        borderRadius: 10,
                        margin: 10,
                    }}
                    onPress={() => {
                        if (pressed) {
                            return;
                        }
                        setPressed(true);
                        onConfirm("red");
                    }}
                >
                    <Text
                        style={{
                            color: Color.rgb(255, 0, 0).fg.hex,
                        }}
                    >
                        Red win
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export function ManageBets() {
    const [matches, setMatches] = useState<
        {
            matchNumber: number;
            matchId: number;
        }[]
    >([]);
    const { colors } = useTheme();
    const refresh = () => {
        MatchBets.getMatchBets().then((bets) => {
            const matchesReduced = bets.reduce((acc, bet: MatchBet) => {
                if (!acc.find((m) => m.matchId === bet.match_id)) {
                    acc.push({ matchNumber: bet.match_number!, matchId: bet.match_id });
                }
                return acc;
            }, [] as { matchNumber: number; matchId: number }[]);
            console.log(matchesReduced);
            setMatches(matchesReduced);
        });
    };
    useEffect(() => {
        refresh();
    }, []);
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    paddingTop: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: colors.text,
                }}
            >
                Active Bets
            </Text>
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {matches.map(({ matchNumber, matchId }) => (
                    <BetCard
                        matchNumber={matchNumber}
                        onConfirm={async (result) => {
                            await supabase.functions.invoke("confirm-bet", {
                                body: JSON.stringify({ matchId, result }),
                            });
                            refresh();
                        }}
                        key={matchId}
                    />
                ))}
            </View>
        </View>
    );
}
