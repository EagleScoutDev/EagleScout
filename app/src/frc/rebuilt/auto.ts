import { produce } from "immer";

export type LinkName =
    | "pickup_ground"
    | "pickup_humanplayer"
    | "pickup_other1"
    | "pickup_other2"
    | "score1"
    | "score2"
    | "score3"
    | "score4"
    | "miss"
    | "scorespecial1"
    | "missspecial1"
    | "scorespecial2"
    | "missspecial2"
    | "climbL1"
    | "climbL2"
    | "climbL3"
export type AutoPieceState = { success: boolean; order: number } | null;
export type AutoState = Readonly<{
    path: AutoPath;
    order: number;
    stats: Readonly<Record<LinkName, number>>;
    field: {
        readonly pieces: [
            _: undefined,
            human: AutoPieceState,
            square: AutoPieceState,
            mid: AutoPieceState,
            alliance: AutoPieceState,
        ];
    };
}>;
export function AutoState(): AutoState {
    return {
        path: [],
        order: 0,
        stats: {
            pickup_ground: 0,
            pickup_humanplayer: 0,
            pickup_other1: 0,
            pickup_other2: 0,
            score1: 0,
            score2: 0,
            score3: 0,
            score4: 0,
            miss: 0,
            scorespecial1: 0,
            missspecial1: 0,
            scorespecial2: 0,
            missspecial2: 0,
            climbL1: 0,
            climbL2: 0,
            climbL3: 0,
        },
        field: {
            pieces: [undefined, null, null, null, null],
        },
    };
}

export enum AutoActionType {
    Score,
    Intake,
    Obstacle,
    Climb
}

const MIDDLE_INTAKE_TARGET = 3;
const ALLIANCE_INTAKE_TARGET = 4;

export type AutoPath = (AutoAction & { order: number })[]; // TODO: get rid of this extra property
export type AutoAction = AutoAction.Intake | AutoAction.Obstacle | AutoAction.Score | AutoAction.Climb ;
export namespace AutoAction {
    export interface Intake {
        type: AutoActionType.Intake;
        target: number;
        success: boolean;
    }
    export interface Obstacle {
        type: AutoActionType.Obstacle;
        target: number;
    }
    export interface Score {
        type: AutoActionType.Score;
        success: boolean;
        amount: number;
    }
    export interface Climb {
        type: AutoActionType.Climb;
        level: number;
        target: number;
        success: boolean;
    }

    export function reduce(
        state: AutoState,
        action: AutoAction | { type: "undo" },
    ): AutoState {
        switch (action.type) {
            case AutoActionType.Intake:
                return produce(state, (draft) => {
                    draft.path.push({ ...action, order: draft.order });
                    draft.field.pieces[action.target] = {
                        success: action.success,
                        order: draft.order,
                    };
                    draft.order++;
                });

            case AutoActionType.Obstacle:
                return produce(state, (draft) => {
                    const previousAction = draft.path[draft.path.length - 1];
                    draft.path.push({ ...action, order: draft.order });
                    draft.order++;
                    draft.path.push({
                        type: AutoActionType.Intake,
                        target:
                            previousAction?.type === AutoActionType.Intake &&
                            previousAction.target === MIDDLE_INTAKE_TARGET
                                ? ALLIANCE_INTAKE_TARGET
                                : MIDDLE_INTAKE_TARGET,
                        success: true,
                        order: draft.order,
                    });
                    draft.order++;
                });

            case AutoActionType.Climb:
                return produce(state, (draft) => {
                    draft.path.push({ ...action, order: draft.order });
                    if (action.success) draft.stats[`climbL${([1, 2, 3] as const)[action.level]}`] += 1;
                    draft.order++;
                });
            case AutoActionType.Score:
                return produce(state, (draft) => {
                    if (action.success) draft.stats.score1 += action.amount;
                    else draft.stats.miss += action.amount;
                });

            case "undo":
                return produce(state, (draft) => {
                    const action = draft.path.pop()!;
                    if (action === undefined) return;
                    draft.order--;

                    switch (action.type) {
                        case AutoActionType.Obstacle:
                            draft.field.pieces[action.target] = null;
                            break;
                        case AutoActionType.Intake:
                            draft.field.pieces[action.target] = null;
                            break;
                        case AutoActionType.Climb:
                            if (action.success)
                                draft.stats[`climbL${([1, 2, 3] as const)[action.level]}`] -= 1;
                            break;
                        case AutoActionType.Score:
                            // if (action.success) draft.stats.score_processor -= 1;
                            // else draft.stats.miss_processor -= 1;
                            // TODO: Make an implementation that actually can undo discrete numbers instead of just "1"
                            break;
                    }
                });
        }
    }
}

export interface AutoDispatch {
    (action: AutoAction | { type: "undo" }): void;
}
