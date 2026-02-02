import { produce } from "immer";

export type LinkName =
    | "pickup_ground"
    | "pickup_algae_reef"
    | "pickup_coral_source"
    | "score_coral_l1"
    | "score_coral_l2"
    | "score_coral_l3"
    | "score_coral_l4"
    | "miss_coral"
    | "score_processor"
    | "miss_processor"
    | "score_net"
    | "miss_net";
export type AutoPieceState = { success: boolean; order: number } | null;
export type AutoState = Readonly<{
    path: AutoPath;
    order: number;
    stats: Readonly<Record<LinkName, number>>;
    field: {
        readonly pieces: [
            _: undefined,
            la: AutoPieceState,
            ca: AutoPieceState,
            ra: AutoPieceState,
            lc: AutoPieceState,
            cc: AutoPieceState,
            rc: AutoPieceState,
        ];
    };
}>;
export function AutoState(): AutoState {
    return {
        path: [],
        order: 0,
        stats: {
            pickup_ground: 0,
            pickup_algae_reef: 0,
            pickup_coral_source: 0,
            score_coral_l1: 0,
            score_coral_l2: 0,
            score_coral_l3: 0,
            score_coral_l4: 0,
            miss_coral: 0,
            score_processor: 0,
            miss_processor: 0,
            score_net: 0,
            miss_net: 0,
        },
        field: {
            pieces: [undefined, null, null, null, null, null, null],
        },
    };
}

export enum AutoActionType {
    Intake,
    Reef,
    Processor,
    Net,
}

export type AutoPath = (AutoAction & { order: number })[]; // TODO: get rid of this extra property
export type AutoAction =
    | AutoAction.Intake
    | AutoAction.Reef
    | AutoAction.Processor
    | AutoAction.Net;
export namespace AutoAction {
    export interface Intake {
        type: AutoActionType.Intake;
        target: number;
        success: boolean;
    }
    export interface Reef {
        type: AutoActionType.Reef;
        target: number;
        level: 0 | 1 | 2 | 3;
        success: boolean;
    }
    export interface Processor {
        type: AutoActionType.Processor;
        success: boolean;
    }
    export interface Net {
        type: AutoActionType.Net;
        success: boolean;
    }

    export function reduce(
        state: AutoState,
        action: AutoAction | { type: "undo" } | { type: "stupid"; state: AutoState },
    ): AutoState {
        switch (action.type) {
            case "stupid":
                return action.state;

            case AutoActionType.Intake:
                return produce(state, (draft) => {
                    draft.path.push({ ...action, order: draft.order });
                    draft.field.pieces[action.target] = {
                        success: action.success,
                        order: draft.order,
                    };
                    draft.order++;
                });

            case AutoActionType.Reef:
                return produce(state, (draft) => {
                    draft.path.push({ ...action, order: draft.order });
                    if (action.success)
                        draft.stats[`score_coral_l${([1, 2, 3, 4] as const)[action.level]}`] += 1;
                    else draft.stats.miss_coral += 1;
                    draft.order++;
                });

            case AutoActionType.Processor:
                return produce(state, (draft) => {
                    draft.path.push({ ...action, order: draft.order });
                    if (action.success) draft.stats.score_processor += 1;
                    else draft.stats.miss_processor += 1;
                    draft.order++;
                });

            case AutoActionType.Net:
                return produce(state, (draft) => {
                    draft.path.push({ ...action, order: draft.order });
                    if (action.success) draft.stats.score_net += 1;
                    else draft.stats.miss_net += 1;
                    draft.order++;
                });

            case "undo":
                return produce(state, (draft) => {
                    const action = draft.path.pop()!;
                    if (action === undefined) return;
                    draft.order--;

                    switch (action.type) {
                        case AutoActionType.Intake:
                            draft.field.pieces[action.target] = null;
                            break;
                        case AutoActionType.Reef:
                            if (action.success)
                                draft.stats[
                                    `score_coral_l${([1, 2, 3, 4] as const)[action.level]}`
                                ] -= 1;
                            else draft.stats.miss_coral -= 1;
                            break;
                        case AutoActionType.Processor:
                            if (action.success) draft.stats.score_processor -= 1;
                            else draft.stats.miss_processor -= 1;
                            break;
                        case AutoActionType.Net:
                            if (action.success) draft.stats.score_net -= 1;
                            else draft.stats.miss_net -= 1;
                            break;
                    }
                });
        }
    }
}

export interface AutoDispatch {
    (action: AutoAction | { type: "undo" }): void;
}
