import { useCallback } from "react";
import { Pressable, type PressableProps, type PressableStateCallbackType } from "react-native-gesture-handler";

export interface PressableOpacityProps extends PressableProps {
    disabled?: boolean;
    activeOpacity?: number;
    defaultOpacity?: number;
    disabledOpacity?: number;
}
export function PressableOpacity({
    disabled = false,
    activeOpacity = 0.5,
    defaultOpacity = 1,
    disabledOpacity = 0.2,
    style,
    children,
    ...passthrough
}: PressableOpacityProps) {
    "use memo";

    const styleFn = useCallback(
        (state: PressableStateCallbackType) => {
            const s = typeof style === "function" ? style(state) : style;
            return [s, { opacity: (disabled ? disabledOpacity : state.pressed ? activeOpacity : 1) * defaultOpacity }];
        },
        [disabled, activeOpacity, defaultOpacity, disabledOpacity, style]
    );
    return (
        <Pressable {...passthrough} disabled={disabled} style={styleFn}>
            {children}
        </Pressable>
    );
}
