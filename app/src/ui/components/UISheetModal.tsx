import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import {
    type FC,
    type ReactNode,
    type Ref,
    type RefObject,
    useImperativeHandle,
    useRef,
} from "react";
import { useModalSafeArea } from "@/ui/context/ModalSafeArea";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/ui/context/ThemeContext";
import { UISheet } from "@/ui/components/UISheet";

export interface UISheetModal<T = any> {
    present(data?: T | undefined): void;
    dismiss(): void;
}

export interface UISheetModalProps<T = any> {
    ref?: Ref<UISheetModal<T>>;
    children?: ReactNode | ((data: T) => ReactNode);
}
export function UISheetModal<T = any>({ ref, children }: UISheetModalProps<T>) {
    const { colors } = useTheme();

    const { frame, insets } = useModalSafeArea();
    const maxHeight = frame.height - insets.top;
    const gap = 0;

    return (
        <BottomSheetModal
            ref={ref}
            enablePanDownToClose
            enableDynamicSizing={false}
            handleComponent={null}
            snapPoints={[maxHeight - gap]}
            stackBehavior={"push"}
            keyboardBehavior={"extend"}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    pressBehavior={"close"}
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                />
            )}
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
            ]}
            backgroundStyle={{ backgroundColor: colors.bg0.hex, borderRadius: 24 }}
        >
            {typeof children === "function" ? (
                ({ data }) => <SafeAreaProvider>{data && children(data)}</SafeAreaProvider>
            ) : (
                <SafeAreaProvider>{children}</SafeAreaProvider>
            )}
        </BottomSheetModal>
    );
}

export namespace UISheetModal {
    export const Header = UISheet.Header;

    export function HOC<T>(Inner: FC<{ ref: RefObject<UISheetModal<T> | null>; data: T }>) {
        return function UISheetModalHOC({ ref }: { ref?: Ref<UISheetModal<T>> | undefined }) {
            const innerRef = useRef<UISheetModal<T>>(null);
            useImperativeHandle(ref, () => innerRef.current ?? { present() {}, dismiss() {} });

            return (
                <UISheetModal ref={innerRef}>
                    {(data) => <Inner ref={innerRef} data={data} />}
                </UISheetModal>
            );
        };
    }
}
