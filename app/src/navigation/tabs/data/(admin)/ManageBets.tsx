import { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminMutations } from "@/lib/mutations/admin";
import { type MatchBetReturnData } from "@/lib/db/models/Betting";
import { queries } from "@/lib/queries";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { Color } from "@/ui/lib/color";

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
                {pressed && (
                    <ActivityIndicator
                        size="small"
                        color={colors.fg.hex}
                        style={{ marginRight: 10 }}
                    />
                )}
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
    const { colors } = useTheme();
    const confirmBet = useMutation(adminMutations.confirmBet);
    const { data: matches = [], refetch } = useQuery({
        ...queries.matchBets.all,
        select: (bets: MatchBetReturnData[]) =>
            bets.reduce(
                (acc, bet) => {
                    if (!acc.find((m) => m.matchId === bet.matchId)) {
                        acc.push({ matchNumber: bet.matchNumber!, matchId: bet.matchId });
                    }
                    return acc;
                },
                [] as { matchNumber: number; matchId: number }[],
            ),
    });
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
                            try {
                                await confirmBet.mutateAsync({ matchId, result });
                                await refetch();
                            } catch (error) {
                                console.error(error);
                            }
                        }}
                        key={matchId}
                    />
                ))}
            </View>
        </View>
    );
}
