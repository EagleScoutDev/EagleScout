import { createContext, type PropsWithChildren, useContext } from "react";
import {
    initialWindowMetrics,
    type Metrics,
    useSafeAreaFrame,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

export function ModalSafeAreaProvider({ children }: PropsWithChildren) {
    const frame = useSafeAreaFrame();
    const insets = useSafeAreaInsets();

    return <ModalSafeAreaContext.Provider value={{ frame, insets }} children={children} />;
}

const ModalSafeAreaContext = createContext<Metrics>(
    initialWindowMetrics ?? {
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, right: 0, bottom: 0, left: 0 },
    },
);

export function useModalSafeArea(): Metrics {
    return useContext(ModalSafeAreaContext);
}
