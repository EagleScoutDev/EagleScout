import { type Ref, useEffect, useImperativeHandle, useState } from "react";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";
import type { Setter } from "@/lib/util/react/types";
import { PlatformPressable } from "@react-navigation/elements";

export interface HeaderTimer {
    getSeconds: () => number;
    setSeconds: Setter<number>;
    getActive: () => boolean;
    setActive: Setter<boolean>;
    toggle: () => void;
    reset: () => void;
}
export interface HeaderTimerProps {
    ref?: Ref<HeaderTimer>;
}
export function HeaderTimer({ ref }: HeaderTimerProps) {
    const { colors } = useTheme();

    const [seconds, setSeconds] = useState(0);
    const [active, setActive] = useState(false);
    const [intrvl, setIntrvl] = useState<NodeJS.Timeout | null>(null);
    function toggle() {
        setActive(!active);
    }
    function reset() {
        setSeconds(0);
        setActive(false);
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (intrvl !== null) {
            clearInterval(intrvl);
        }

        if (active) {
            setIntrvl((interval = setInterval(() => setSeconds((seconds) => seconds + 1), 1000)));
        }

        return () => {
            interval && clearInterval(interval);
        };
    }, [active, seconds]);

    useImperativeHandle(ref, () => ({
        getSeconds: () => seconds,
        setSeconds,
        getActive: () => active,
        setActive,

        toggle,
        reset,
    }));

    return (
        <PlatformPressable
            onPress={toggle}
            onLongPress={reset}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
            }}
        >
            <UIText bold style={{ marginRight: 5 }}>
                {seconds}
            </UIText>
            <Bs.Stopwatch size="24" fill={active ? colors.primary.hex : "gray"} />
        </PlatformPressable>
    );
}
