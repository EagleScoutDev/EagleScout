import {
    BottomSheetBackdrop,
    BottomSheetModal,
    type BottomSheetModalProps,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { SafeAreaProvider, SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import type { BackdropPressBehavior } from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";
import type React from "react";
import { View } from "react-native";

export interface UISheetModalProps<T = any> extends BottomSheetModalProps<T> {
    ref?: React.Ref<BottomSheetModal<T>>;
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
                },
                props.style,
            ]}
            backgroundStyle={[{ borderRadius: 24 }, props.backgroundStyle]}
        >
            {typeof children === "function" ? (
                (props) => {
                    const res = children(props);
                    return res instanceof Promise ? (
                        res.then((res) => <BottomSheetView style={{ flex: 1 }}>{res}</BottomSheetView>)
                    ) : (
                        <BottomSheetView style={{ flex: 1 }}>{res}</BottomSheetView>
                    );
                }
            ) : (
                <BottomSheetView>
                    <SafeAreaView edges={{ bottom: "additive" }}>{children}</SafeAreaView>
                </BottomSheetView>
            )}
        </BottomSheetModal>
    );
}
