import { useEffect, useState } from "react";
import { UIText } from "../../../ui/UIText";
import { View } from "react-native";

import { UserAttributesDB } from "../../../database/UserAttributes";
import type { DataMenuScreenProps } from "../../data/DataMain";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton";
import { UICard } from "../../../ui/UICard.tsx";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

export interface MatchBettingProps extends DataMenuScreenProps<"MatchBetting"> {}
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
