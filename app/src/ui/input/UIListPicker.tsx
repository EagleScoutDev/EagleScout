import { View } from "react-native";
import { UISheetModal } from "../UISheetModal";
import { UISheet } from "../UISheet";
import * as Bs from "../../ui/icons";
import type { ReactNode } from "react";
import React, { type Ref, useImperativeHandle, useRef } from "react";
import { Color } from "../../lib/color";

import { PressableOpacity } from "../components/PressableOpacity";
import { UIList } from "../UIList";
import { UIText } from "../UIText";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface UIListPickerProps<K extends string | number = string | number> {
    ref?: Ref<UIListPicker<K>>;
    title?: string;
    options: K[];
    render: (key: K) => { name: string };
    searchable?: boolean;

    value?: K | null;
    onChange?: ((x: K) => void) | null | undefined;

    Display?: ReactNode | React.FC<{ value: K | null }>;
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

    const closeTimeout = useRef<number>(null);
    function scheduleClose() {
        if (closeTimeout.current !== null) clearTimeout(closeTimeout.current);
        closeTimeout.current = setTimeout(() => sheetRef.current?.close(), 350);
    }

    useImperativeHandle(ref, () => ({
        present() {
            sheetRef.current?.present();
        },
        dismiss() {
            sheetRef.current?.dismiss();
        },
    }));

    return (
        <>
            {typeof Display === "function" ? (
                <Display value={value} />
            ) : (
                Display ?? (
                    <PressableOpacity
                        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
                        onPress={() => sheetRef.current?.present()}
                    >
                        <UIText size={16} level={1} style={{ marginRight: 4, flexShrink: 1 }} numberOfLines={1}>
                            {value === null ? "None" : render(value).name}
                        </UIText>
                        <View style={{ width: 20, height: 20 }}>
                            <Bs.ChevronExpand fill={"gray"} size={20} />
                        </View>
                    </PressableOpacity>
                )
            )}

            <UISheetModal
                ref={sheetRef}
                stackBehavior={"push"}
                enablePanDownToClose
                handleComponent={null}
                onDismiss={() => {}}
            >
                <UISheet.Header
                    handle
                    title={title ?? "Select an option"}
                    right={{
                        text: "Done",
                        color: Color.parse(colors.primary.hex),
                        onPress: () => {
                            sheetRef.current?.dismiss();
                        },
                    }}
                />
                <UIList bottomSheet>
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
