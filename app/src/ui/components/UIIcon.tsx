import * as Bs from "../icons/icons.generated";

export type UIIconName = keyof typeof ICON_MAP;

export const ICON_MAP = {
    xmark: Bs.XLg,
    checkmark: Bs.CheckLg,
    "square.and.pencil": Bs.PencilSquare,
    clock: Bs.ClockHistory,
};
