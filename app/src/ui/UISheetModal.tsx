import {
    BottomSheetBackdrop,
    BottomSheetModal,
    type BottomSheetModalProps,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { SafeAreaProvider, SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import type { BackdropPressBehavior } from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";
import type { ReactNode, Ref } from "react";

export interface UISheetModalProps<T = any> extends BottomSheetModalProps<T> {
    ref?: Ref<BottomSheetModal<T>>;
    gap?: `${number}%` | number;
    backdropPressBehavior?: BackdropPressBehavior;
}
export interface UISheetModal<T = any> extends BottomSheetModal<T> {}
export function UISheetModal<T = any>({
    gap = 16,
    backdropPressBehavior = "none",
    children,
    ...props
}: UISheetModalProps<T>) {
    "use memo";
    const safeAreaFrame = useSafeAreaFrame();
    const sheetInsets = useSafeAreaInsets();
    const maxHeight = safeAreaFrame.height - sheetInsets.top;

    function wrap(children: ReactNode) {
        return (
            <BottomSheetView style={{ flex: 1 }}>
                <SafeAreaView edges={{ bottom: "additive" }} style={{ flex: 1 }}>
                    {children}
                </SafeAreaView>
            </BottomSheetView>
        );
    }

    return (
        <BottomSheetModal
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            snapPoints={[
                typeof gap === "string" ? maxHeight * (1 - parseFloat(gap.slice(0, -1)) / 100) : maxHeight - gap,
            ]}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    pressBehavior={backdropPressBehavior}
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                />
            )}
            {...props}
            style={[
                {
                    boxShadow: [
                        {
                            offsetX: 0,
                            offsetY: 0,
                            color: "rgba(0,0,0,0.125)",
                            blurRadius: 8,
                            spreadDistance: 1,
                        },
                    ],
                    borderRadius: 24,
                    flex: 1,
                },
                props.style,
            ]}
            backgroundStyle={[{ borderRadius: 24 }, props.backgroundStyle]}
        >
            {typeof children === "function"
                ? (props) => {
                      const res = children(props);
                      return res instanceof Promise ? res.then(wrap) : wrap(res);
                  }
                : wrap(children)}
        </BottomSheetModal>
    );
}
