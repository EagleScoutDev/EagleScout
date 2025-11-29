import { useEffect, useState } from "react";
import { UIText } from "../../../../ui/UIText";

import { ActivityIndicator, Pressable, View } from "react-native";
import { type MatchBet, MatchBets } from "../../../../database/MatchBets";
import { supabase } from "../../../../lib/supabase";
import { Color } from "../../../../lib/color";
import { useTheme } from "../../../../lib/contexts/ThemeContext.ts";

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
                backgroundColor: colors.bg1.hex,
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
                {pressed && <ActivityIndicator size="small" color={colors.fg.hex} style={{ marginRight: 10 }} />}
                <UIText
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.fg.hex,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    Match {matchNumber}
                </UIText>
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
                        backgroundColor: colors.primary.hex,
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
                    <UIText
                        style={{
                            color: Color.rgb(0, 0, 255).fg.hex,
                        }}
                    >
                        Blue win
                    </UIText>
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
                    <UIText
                        style={{
                            color: colors.fg.hex,
                        }}
                    >
                        Tie
                    </UIText>
                </Pressable>
                <Pressable
                    style={{
                        backgroundColor: colors.danger.hex,
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
                    <UIText
                        style={{
                            color: Color.rgb(255, 0, 0).fg.hex,
                        }}
                    >
                        Red win
                    </UIText>
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
            <UIText
                style={{
                    paddingTop: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: colors.fg.hex,
                }}
            >
                Active Bets
            </UIText>
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
