import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export function ScoutTimer(): ScoutTimer {
    const [ seconds, setSeconds ] = useState(0)
    const [ active, setActive ] = useState(false)
    const toggleTimer = () => {setActive(!active)}
    const resetTimer = () => {setSeconds(0); setActive(false)}

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if(active) {
            interval = setInterval(() => setSeconds(seconds => seconds + 1), 1000)
        }
        else if(interval !== null && seconds !== 0) {
            clearInterval(interval)
        }
        return () => { interval && clearInterval(interval) };
    }, [active, seconds]);

    return {
        seconds,
        setSeconds,
        active,
        setActive,
        toggleTimer,
        resetTimer
    }
}

export interface ScoutTimer {
    seconds: number
    setSeconds: Dispatch<SetStateAction<number>>
    active: boolean
    setActive: Dispatch<SetStateAction<boolean>>
    toggleTimer: () => void
    resetTimer: () => void
};

export const ScoutTimerContext = createContext<ScoutTimer>({
  seconds: 0,
  setSeconds: () => {},
  active: false,
  setActive: () => {},
  toggleTimer: () => {},
  resetTimer: () => {}
});
