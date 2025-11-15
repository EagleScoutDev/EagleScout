import {
    BottomSheetBackdrop,
    BottomSheetModal,
    type BottomSheetModalProps,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BackdropPressBehavior } from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";
import type { ReactNode, Ref } from "react";
import { useModalSafeArea } from "./ModalSafeAreaProvider.tsx";

export interface UISheetModalProps<T = any> extends BottomSheetModalProps<T> {
    ref?: Ref<BottomSheetModal<T>>;
    backdropPressBehavior?: BackdropPressBehavior;
}
export interface UISheetModal<T = any> extends BottomSheetModal<T> {}
export function UISheetModal<T = any>({ backdropPressBehavior = "none", children, ...props }: UISheetModalProps<T>) {
    "use memo";
    const { frame, insets } = useModalSafeArea();
    const maxHeight = frame.height - insets.top;
    const gap = 16;

    function wrap(children: ReactNode) {
        return (
            <BottomSheetView style={{ height: "100%" }}>
                {/*<SafeAreaProvider>*/}
                <SafeAreaView edges={{ bottom: "additive", left: "additive", right: "additive" }} style={{ flex: 1 }}>
                    {children}
                </SafeAreaView>
                {/*</SafeAreaProvider>*/}
            </BottomSheetView>
        );
    }

    return (
        <BottomSheetModal
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            snapPoints={[maxHeight - gap]}
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
