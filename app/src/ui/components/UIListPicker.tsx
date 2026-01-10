import { View } from "react-native";
import * as Bs from "@/ui/icons";
import { PressableOpacity } from "@/components/PressableOpacity";
import { type ReactNode, type Ref, useImperativeHandle, useRef } from "react";
import { useTheme } from "@/ui/context/ThemeContext";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { UIText } from "@/ui/components/UIText";
import { UIList } from "@/ui/components/UIList";
import { KeyboardController } from "react-native-keyboard-controller";

export interface UIListPickerProps<K extends string | number = string | number> {
    ref?: Ref<UIListPicker<K>>;
    title?: string;
    options: K[];
    render: (key: K) => { name: string };
    searchable?: boolean;

    value?: K | null;
    onChange?: ((x: K) => void) | null | undefined;

    Display?: ReactNode | React.FC<{ value: K | null; present: () => void }>;
}
export interface UIListPicker<K extends string | number = string | number> {
    present(): void;
    dismiss(): void;
}
export function UIListPicker<K extends string | number = string | number>({
    ref,
    title,
    options,
    render,
    searchable, //< TODO: Add search support
    value = null,
    onChange,
    Display,
}: UIListPickerProps<K>) {
    "use no memo";
    // FIXME: Enable memoization when react compiler stops
    //        complaining about passing refs to UIList.Line

    const { colors } = useTheme();

    const sheetRef = useRef<UISheetModal>(null);

    const closeTimeout = useRef<NodeJS.Timeout | null>(null);
    function scheduleClose() {
        if (closeTimeout.current !== null) clearTimeout(closeTimeout.current);
        closeTimeout.current = setTimeout(() => sheetRef.current?.dismiss(), 350);
    }

    function present() {
        sheetRef.current?.present();
        KeyboardController.dismiss();
    }

    useImperativeHandle(ref, () => ({
        present() {
            present();
        },
        dismiss() {
            sheetRef.current?.dismiss();
        },
    }));

    return (
        <>
            {typeof Display === "function" ? (
                <Display value={value} present={() => present()} />
            ) : (
                (Display ?? (
                    <PressableOpacity
                        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
                        onPress={() => present()}
                    >
                        <UIText size={16} placeholder style={{ marginRight: 4, flexShrink: 1 }} numberOfLines={1}>
                            {value === null ? "None" : render(value).name}
                        </UIText>
                        <View style={{ width: 20, height: 20 }}>
                            <Bs.ChevronExpand fill={"gray"} size={20} />
                        </View>
                    </PressableOpacity>
                ))
            )}

            <UISheetModal ref={sheetRef}>
                <UISheetModal.Header
                    handle
                    title={title ?? "Select an option"}
                    right={[
                        {
                            text: "Done",
                            icon: "clock",
                            color: colors.primary,
                            onPress: () => {
                                sheetRef.current?.dismiss();
                            },
                        },
                    ]}
                />
                <UIList>
                    {UIList.Section({
                        // TODO: use a flatlist-like interface for this
                        items: options.map((key) => {
                            const { name } = render(key);
                            return UIList.Label({
                                key: key.toString(),
                                label: name,
                                icon: value === key ? Bs.CheckLg : true,
                                onPress: () => {
                                    onChange?.(key);
                                    scheduleClose();
                                },
                            });
                        }),
                    })}
                </UIList>
            </UISheetModal>
        </>
    );
}
