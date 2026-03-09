import React, { type ReactNode, type Ref, useImperativeHandle, useState } from "react";
import {
    Modal,
    type StyleProp,
    TouchableWithoutFeedback,
    View,
    type ViewStyle,
} from "react-native";
import { useFloating } from "@floating-ui/react-native";
import type { MiddlewareState, Placement } from "@floating-ui/core";
import { useTheme } from "@/ui/context/ThemeContext";

export interface UIMenuProps<T = unknown> {
    ref?: Ref<UIMenu<T>>;
    onClose: () => void;

    placement: UIMenu.Placement;

    data?: T;
    content: ReactNode | React.FC<{ data?: T }>;
    children: React.ReactNode;

    style?: StyleProp<ViewStyle>;
}
export interface UIMenu<T = unknown> {
    present(data: T): void;
    dismiss(): void;
}
export function UIMenu<T = unknown>({
    ref,
    onClose,
    placement,
    content: Content,
    children,
    style,
}: UIMenuProps<T>) {
    const [align, direction, justify] = placement.split("-") as [
        UIMenu.Align,
        UIMenu.Direction,
        UIMenu.Justify,
    ];

    const { colors } = useTheme();
    const { refs, floatingStyles, x, y } = useFloating({
        placement: justify === "center" ? align : `${align}-${justify}`,
        middleware: [
            direction === "inner" && {
                name: "inner",
                fn: (state: MiddlewareState) => {
                    const {
                        placement,
                        rects: { floating },
                        x,
                        y,
                    } = state;

                    switch (placement.split("-")[0] as Placement) {
                        case "top":
                            return { y: y + floating.height };
                        case "bottom":
                            return { y: y - floating.height };
                        case "left":
                            return { x: x + floating.width };
                        case "right":
                            return { x: x - floating.width };
                        default:
                            return {};
                    }
                },
            },
        ],
    });
    const positioned = x !== null && y !== null;

    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<T | null>(null);

    useImperativeHandle(ref, () => ({
        present(data: T) {
            setData(data);
            setVisible(true);
        },
        dismiss() {
            setVisible(false);
            setData(null);
        },
    }));

    return (
        <>
            <View ref={refs.setReference} collapsable={false} children={children} />

            <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={{ width: "100%", height: "100%" }}>
                        <TouchableWithoutFeedback>
                            <View
                                ref={refs.setFloating}
                                style={[
                                    {
                                        opacity: positioned ? 1 : 0,
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
                                        padding: 8,
                                        backgroundColor: colors.bg0.hex,
                                    },
                                    floatingStyles,
                                    style,
                                ]}
                            >
                                {typeof Content === "function"
                                    ? data && <Content data={data} />
                                    : Content}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

export namespace UIMenu {
    export type Placement = `${Align}-${Direction}-${Justify}`;
    export type Align = "top" | "bottom" | "left" | "right";
    export type Direction = "inner" | "outer";
    export type Justify = "start" | "center" | "end";

    export interface ListProps extends Omit<UIMenuProps, "content" | "placement"> {
        placement?: UIMenu.Placement;
    }
    export function List({ ref, ...props }: ListProps) {
        return <UIMenu placement={"right-inner-center"} {...props} content={undefined} />;
    }
}
