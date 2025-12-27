import { View } from "react-native";
import { useState } from "react";
import { ActionGrid } from "./ActionGrid";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { AutoActionType, type AutoDispatch, type AutoState } from "../../auto";
import { ReefSextant } from "../../field";
import { AutoField } from "./AutoField";
import { ActionButton } from "./ActionButton";
import { ActionRow } from "./ActionRow";
import { useTheme } from "@/ui/context/ThemeContext";
import { UISheet } from "@/ui/components/UISheet";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";
import * as Bs from "@/ui/icons";
import { Alliance, type Orientation } from "@/frc/common/common";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

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
                            ReactNativeHapticFeedback.trigger("impactLight");
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
                            ReactNativeHapticFeedback.trigger("impactLight");
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
                                    ReactNativeHapticFeedback.trigger("impactLight");
                                    setReefSextant(sextant);
                                }}
                                onPiece={(piece: number) => {
                                    if (state.field.pieces[piece] !== undefined) return;

                                    ReactNativeHapticFeedback.trigger("impactLight");
                                    setGamePiece(piece);
                                }}
                            />
                        </View>

                        <ActionRow>
                            <ActionButton
                                label={"Missed Barge"}
                                role={"fail"}
                                value={state.stats.miss_net}
                                onPress={() => {
                                    ReactNativeHapticFeedback.trigger("impactLight");
                                    dispatch({
                                        type: AutoActionType.Net,
                                        success: false,
                                    });
                                }}
                            />
                            <ActionButton
                                label={"Scored Barge"}
                                role={"success"}
                                value={state.stats.score_net}
                                onPress={() => {
                                    ReactNativeHapticFeedback.trigger("impactLight");
                                    dispatch({
                                        type: AutoActionType.Net,
                                        success: true,
                                    });
                                }}
                            />
                        </ActionRow>

                        <ActionRow>
                            <ActionButton
                                label={"Missed Processor"}
                                role={"fail"}
                                value={state.stats.miss_processor}
                                onPress={() => {
                                    ReactNativeHapticFeedback.trigger("impactLight");
                                    dispatch({
                                        type: AutoActionType.Processor,
                                        success: false,
                                    });
                                }}
                            />
                            <ActionButton
                                label={"Scored Processor"}
                                role={"success"}
                                value={state.stats.score_processor}
                                onPress={() => {
                                    ReactNativeHapticFeedback.trigger("impactLight");
                                    dispatch({
                                        type: AutoActionType.Processor,
                                        success: true,
                                    });
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
                    { text: "Miss L4", role: "fail", value: [3, false] },
                    { text: "Score L4", role: "success", value: [3, true] },
                ],
                [
                    { text: "Miss L3", role: "fail", value: [2, false] },
                    { text: "Score L3", role: "success", value: [2, true] },
                ],
                [
                    { text: "Miss L2", role: "fail", value: [1, false] },
                    { text: "Score L2", role: "success", value: [1, true] },
                ],
                [
                    { text: "Miss L1", role: "fail", value: [0, false] },
                    { text: "Score L1", role: "success", value: [0, true] },
                ],
            ]}
            onPress={onPress}
        />
    );
}
