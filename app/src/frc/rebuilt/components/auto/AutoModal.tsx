import { View } from "react-native";
import { useState } from "react";
import { ActionGrid } from "./ActionGrid";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { AutoActionType, type AutoDispatch, type AutoState } from "../../auto";
import { ReefSextant } from "../../field";
import { AutoField } from "./AutoField";
import { ActionButton } from "./ActionButton";
import { HoldButton } from "./HoldButton";
import { ActionRow } from "./ActionRow";
import { useTheme } from "@/ui/context/ThemeContext";
import { UISheet } from "@/ui/components/UISheet";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";
import * as Bs from "@/ui/icons";
import { Alliance, type Orientation } from "@/frc/common/common";
import * as Haptics from "expo-haptics";

interface AutoModalProps {
    orientation: Orientation;
    alliance: Alliance;

    state: AutoState;
    dispatch: AutoDispatch;
}

export function AutoModal({ orientation, alliance, state, dispatch }: AutoModalProps) {
    const { colors } = useTheme();

    const [reefSextant, setReefSextant] = useState<ReefSextant | null>(null);
    const levelChooserActive = reefSextant !== null;

    const [gamePiece, setGamePiece] = useState<number | null>(null);
    const intakeChooserActive = gamePiece !== null;

    const modal = useBottomSheetModal();
    return (
        <>
            <UISheet.Header
                title={"Auto"}
                right={{ color: colors.primary, text: "Done", onPress: () => void modal.dismiss() }}
            />
            <View style={{ paddingHorizontal: 16, paddingBottom: 16, flex: 1 }}>
                {levelChooserActive ? (
                    <LevelChooser
                        reefSextant={reefSextant}
                        onPress={([level, success]) => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            dispatch({
                                type: AutoActionType.Reef,
                                target: reefSextant,
                                level,
                                success,
                            });
                            setReefSextant(null);
                        }}
                    />
                ) : intakeChooserActive ? (
                    <ActionGrid
                        title={"Intake Lollipop"}
                        options={[
                            [{ text: "Success", role: "success", value: true }],
                            [{ text: "Missed", role: "fail", value: false }],
                        ]}
                        onPress={(success: boolean) => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            dispatch({
                                type: AutoActionType.Intake,
                                target: gamePiece,
                                success,
                            });
                            setGamePiece(null);
                        }}
                    />
                ) : (
                    <>
                        <View style={{ flexDirection: "row", marginBottom: 4 }}>
                            <View style={{ flex: 1 }} />
                            <UIButton
                                style={UIButtonStyle.text}
                                size={UIButtonSize.md}
                                text={"Undo"}
                                icon={Bs.ArrowCounterclockwise}
                                onPress={() => dispatch({ type: "undo" })}
                            />
                        </View>

                        <View
                            style={{
                                width: "100%",
                                maxWidth: "100%",
                                backgroundColor: colors.bg1.hex,
                                borderWidth: 1,
                                borderColor: colors.border.hex,
                                borderRadius: 10,
                                overflow: "hidden",
                                aspectRatio: 1,
                            }}
                        >
                            <AutoField
                                orientation={orientation}
                                alliance={alliance}
                                state={state.field}
                                onReef={(sextant: ReefSextant) => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setReefSextant(sextant);
                                }}
                                onPiece={(piece: number) => {
                                    if (state.field.pieces[piece] !== undefined) return;

                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setGamePiece(piece);
                                }}
                            />
                        </View>

                        <ActionRow>
                            <ActionButton
                                label={"Missed"}
                                role={"fail"}
                                value={state.stats.miss}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    dispatch({
                                        type: AutoActionType.Score,
                                        success: false,
                                        amount: 1,
                                    });
                                }}
                            />
                            <HoldButton
                                label={"Scored Processor"}
                                role={"success"}
                                value={state.stats.score1}
                                onPress={([level, success]) => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    dispatch({
                                        type: AutoActionType.,
                                        target: reefSextant,
                                        level,
                                        success,
                                    });
                                    setReefSextant(null);
                                }}
                            />
                        </ActionRow>
                    </>
                )}
            </View>
        </>
    );
}

interface LevelChooserProps {
    reefSextant: ReefSextant;
    onPress: (value: [level: 0 | 1 | 2 | 3, success: boolean]) => void;
}

function LevelChooser({ reefSextant, onPress }: LevelChooserProps) {
    return (
        <ActionGrid
            title={`Reef ${ReefSextant.abbreviation(reefSextant)}`}
            options={[
                [
                    { text: "Climb L3", role: "success", value: [2, true] },
                ],
                [
                    { text: "Climb L2", role: "success", value: [1, true] },
                ],
                [
                    { text: "Climb L1", role: "success", value: [0, true] },
                ],
            ]}
            onPress={onPress}
        />
    );
}
