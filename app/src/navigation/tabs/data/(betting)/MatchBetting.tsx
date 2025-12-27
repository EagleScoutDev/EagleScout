import { useEffect, useState } from "react";
import { View } from "react-native";
import { UserAttributesDB } from "@/lib/database/UserAttributes";
import type { DataTabScreenProps } from "@/navigation/tabs/data";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { UICard } from "@/ui/components/UICard";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";

export interface MatchBettingProps extends DataTabScreenProps<"MatchBetting"> {}
export function MatchBetting({ navigation }: MatchBettingProps) {
    const { colors } = useTheme();
    const [matchNumber, setMatchNumber] = useState<number | null>(null);
    const [orgId, setOrgId] = useState<number | null>(null);

    useEffect(() => {
        UserAttributesDB.getCurrentUserAttribute().then((userAttribute) => {
            if (userAttribute) {
                setOrgId(userAttribute.organization_id);
            }
        });
    }, []);

    if (orgId === null) return null;

    if (orgId !== 1) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 16,
                    alignItems: "center",
                }}
            >
                <UIText
                    style={{
                        color: colors.fg.hex,
                        fontSize: 30,
                        fontWeight: "bold",
                        marginTop: 48,
                        marginBottom: 16,
                    }}
                >
                    {/* TODO: Make it come */}
                    Coming soon...
                </UIText>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                padding: 16,
                alignItems: "center",
            }}
        >
            <UIText
                style={{
                    color: colors.fg.hex,
                    fontSize: 30,
                    fontWeight: "bold",
                    marginBottom: 16,
                }}
            >
                Bet on a match!
            </UIText>

            <UICard title={"Match Information"}>
                <UICard.NumberInput
                    label={"Match Number"}
                    placeholder={"000"}
                    max={999}
                    maxLength={3}
                    value={matchNumber}
                    onInput={setMatchNumber}
                />
                <UICard.NumberInput
                    label={"Team Number"}
                    placeholder={"000"}
                    max={999}
                    maxLength={3}
                    value={matchNumber}
                    onInput={setMatchNumber}
                />
            </UICard>
            <UIButton
                size={UIButtonSize.xl}
                style={UIButtonStyle.fill}
                text={"Next"}
                onPress={() => {
                    if (matchNumber === null) return;
                    navigation.navigate("MatchBetting/BettingScreen", { matchNumber });
                }}
            />
        </View>
    );
}
