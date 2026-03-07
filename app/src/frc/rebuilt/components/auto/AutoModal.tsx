import { View } from "react-native";
import { useState } from "react";
import { ActionGrid } from "./ActionGrid";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { AutoActionType, type AutoDispatch, type AutoState } from "../../auto";
import { Obstacles } from "../../field";
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

    const [obstacle, setObstacle] = useState<Obstacles | null>(null);
    const levelChooserActive = obstacle !== null;

    const modal = useBottomSheetModal();
    return (
        <>
            <UISheet.Header
                title={"Auto"}
                right={{ color: colors.primary, text: "Done", onPress: () => void modal.dismiss() }}
            />
            <View style={{ paddingHorizontal: 16, paddingBottom: 16, flex: 1 }}>
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
                        onObstacle={(obstacle: Obstacles) => {
                            if (state.field.pieces[obstacle] !== undefined) return;
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            dispatch({
                                type: AutoActionType.Obstacle,
                                target: obstacle,
                            });
                        }}
                        onIntake={(piece: number) => {
                            if (state.field.pieces[piece] !== undefined) return;
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            dispatch({
                                type: AutoActionType.Intake,
                                target: piece,
                                success: true
                            });
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
                        label={"Scored"}
                        value={state.stats.score1}
                        onInput={(nextScore) => {
                            const delta = Math.max(0, nextScore - state.stats.score1);
                            if (delta <= 0) return;
                            dispatch({
                                type: AutoActionType.Score,
                                success: true,
                                amount: delta,
                            });
                        }}
                    />
                </ActionRow>
            </View>
        </>
    );
}
//
// interface LevelChooserProps {
//     reefSextant: Obstacles;
//     onPress: (value: [level: 0 | 1 | 2, success: boolean]) => void;
// }
//
// function LevelChooser({ reefSextant, onPress }: LevelChooserProps) {
//     return (
//         <ActionGrid
//             title={`Reef ${Obstacles.abbreviation(reefSextant)}`}
//             options={[
//                 [
//                     { text: "Climb L3", role: "success", value: [2, true] },
//                 ],
//                 [
//                     { text: "Climb L2", role: "success", value: [1, true] },
//                 ],
//                 [
//                     { text: "Climb L1", role: "success", value: [0, true] },
//                 ],
//             ]}
//             onPress={onPress}
//         />
//     );
// }
