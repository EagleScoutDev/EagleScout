import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { UserAttributesDB } from "../../../database/UserAttributes";
import type { DataMenuScreenProps } from "../../data/DataMain.tsx";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton.tsx";
import { UICardForm } from "../../../ui/UICardForm.tsx";

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
                <Text
                    style={{
                        color: colors.text,
                        fontSize: 30,
                        fontWeight: "bold",
                        marginTop: 48,
                        marginBottom: 16,
                    }}
                >
                    {/* TODO: Make it come */}
                    Coming soon...
                </Text>
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
            <Text
                style={{
                    color: colors.text,
                    fontSize: 30,
                    fontWeight: "bold",
                    marginBottom: 16,
                }}
            >
                Bet on a match!
            </Text>

            <UICardForm title={"Match Information"}>
                <UICardForm.NumberInput
                    label={"Match Number"}
                    placeholder={"000"}
                    max={999}
                    maxLength={3}
                    value={matchNumber}
                    onInput={setMatchNumber}
                />
                <UICardForm.NumberInput
                    label={"Team Number"}
                    placeholder={"000"}
                    max={999}
                    maxLength={3}
                    value={matchNumber}
                    onInput={setMatchNumber}
                />
            </UICardForm>
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
