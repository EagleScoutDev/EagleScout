import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    type StyleProp,
    StyleSheet,
    Text,
    View,
    type ViewStyle,
} from "react-native";
import React, {
    Children,
    type Key,
    type PropsWithChildren,
    type ReactElement,
    type ReactNode,
    type Ref,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { useTheme } from "@react-navigation/native";
import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import * as Bs from "./icons";
import { type Icon } from "./icons";
import { elementInstanceof } from "../lib/react/util/instanceof.ts";
import Animated, { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";
import { BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import type { Color } from "../lib/color.ts";
import { useMountReactions } from "react-native-gesture-handler/lib/typescript/handlers/gestures/GestureDetector/useMountReactions";

export interface UIListProps {
    ref?: Ref<UIList>;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;

    refreshing?: boolean;
    onRefresh?: (() => Promise<void>) | undefined | null;
    refreshOnMount?: boolean;

    children?: readonly (UIList.Section | false | null | undefined)[];
    bottomSheet?: boolean; //< TODO: find an alternative to this
}
export interface UIList {
    refresh(): Promise<void>;
}
export function UIList({
    ref,
    style,
    contentContainerStyle,
    refreshing: externRefreshing,
    onRefresh,
    refreshOnMount = false,
    children,
    bottomSheet = false,
}: UIListProps) {
    "use memo";
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            minHeight: 200,
        },
        contents: {
            flexGrow: 1,
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        sectionHeader: {
            marginBottom: 5,
        },
        sectionHeaderText: {
            color: colors.text,
            opacity: 0.6,
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "uppercase",
        },
        sectionFooter: {
            marginTop: 3,
        },
        sectionFooterText: {
            color: colors.text,
            opacity: 0.6,
            fontSize: 12,
        },
        sectionGap: {
            height: 24,
        },
    });

    const [refreshing, setRefreshing] = useState(false);
    async function doRefresh() {
        if (!onRefresh) return;

        setRefreshing(true);
        const ux = new Promise((resolve) => setTimeout(resolve, 500)); // Delay at least 500ms to give the impression of work
        await Promise.all([onRefresh(), ux]);
        setRefreshing(false);
    }

    useImperativeHandle(
        ref,
        () => ({
            refresh: doRefresh,
        }),
        [onRefresh, doRefresh, setRefreshing]
    );

    // FIXME: "OnMount" is a lie because changing refreshOnMount will also lead to a refresh
    useEffect(() => void (refreshOnMount && doRefresh()), [refreshOnMount]);

    type DataItem =
        | { key: string; type: "item"; item: UIList.Item; first: boolean; last: boolean }
        | { key: string; type: "header"; content: string | null | undefined }
        | { key: string; type: "footer"; content: string | null | undefined }
        | { key: string; type: "gap" };
    const data: DataItem[] = [];

    const sections = children?.filter((x) => !!x) ?? [];
    for (let si = 0; si < sections.length; si++) {
        const { key = si, header, footer, items } = sections[si];

        if (header ?? false) {
            data.push({ key: key + ".header", type: "header", content: header });
        }
        if (items) {
            data.push(
                ...items
                    .filter((x) => !!x)
                    .map(
                        (item, i, items) =>
                            ({
                                key: key + ".$" + (item.key ?? i.toString()),
                                type: "item",
                                item,
                                first: i === 0,
                                last: i === items.length - 1,
                            } as const)
                    )
            );
        }
        if (footer ?? false) {
            data.push({ key: key + ".footer", type: "footer", content: footer });
        }
        if (si !== sections.length - 1) {
            data.push({ key: key + ".gap", type: "gap" });
        }
    }

    const ListImpl = bottomSheet ? BottomSheetFlatList : FlatList;
    return (
        <ListImpl
            scrollToOverflowEnabled={true}
            style={[styles.container, style]}
            contentContainerStyle={[styles.contents, contentContainerStyle]}
            refreshControl={
                onRefresh || !!externRefreshing ? (
                    <RefreshControl refreshing={refreshing || !!externRefreshing} onRefresh={doRefresh} />
                ) : undefined
            }
            data={data}
            keyExtractor={({ key }, i) => key}
            renderItem={({ item }) => {
                switch (item.type) {
                    case "header":
                        return (
                            <View style={styles.sectionHeader}>
                                {typeof item.content === "string" && (
                                    <Text style={styles.sectionHeaderText}>{item.content}</Text>
                                )}
                            </View>
                        );
                    case "footer":
                        return (
                            <View style={styles.sectionFooter}>
                                {typeof item.content === "string" && (
                                    <Text style={styles.sectionFooterText}>{item.content}</Text>
                                )}
                            </View>
                        );
                    case "gap":
                        return <View style={styles.sectionGap} aria-hidden />;
                    case "item":
                        return <RenderItem item={item.item} first={item.first} last={item.last} />;
                }
            }}
        />
    );
}
export namespace UIList {
    export interface SectionProps {
        key?: string | undefined;
        header?: string | null | undefined;
        footer?: string | null | undefined;
        items?: readonly (UIList.Item | false | null | undefined)[];
    }
    export interface Section extends SectionProps {}
    export function Section(props: SectionProps) {
        return props;
    }

    export interface ItemProps {
        key?: string | undefined;
        icon?: Icon;
        label?: string;
        labelColor?: Color;
        render?: () => ReactNode;
        caret?: boolean;
        disabled?: boolean;

        onPress?: (() => void) | undefined | null;
        onLongPress?: (() => void) | undefined | null;
    }
    export interface Item extends ItemProps {}
    export function Item(props: ItemProps): Item {
        return props;
    }
}

function RenderItem({
    item: { icon, label, labelColor, caret, disabled, onPress, onLongPress, render },
    first,
    last,
}: {
    item: UIList.ItemProps;
    first: boolean;
    last: boolean;
}) {
    "use memo";
    const { colors } = useTheme();
    const opacity = useSharedValue(1);
    const styles = StyleSheet.create({
        container: {
            minHeight: 48,
            backgroundColor: colors.card,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderTopWidth: first ? 1 : 0,
            borderBottomWidth: 1,
            borderTopLeftRadius: first ? 8 : 0,
            borderTopRightRadius: first ? 8 : 0,
            borderBottomLeftRadius: last ? 8 : 0,
            borderBottomRightRadius: last ? 8 : 0,
            borderColor: colors.border,

            width: "100%",
            flexDirection: "row",
            alignItems: "center",
        },
        label: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingLeft: 12,
        },
        labelIcon: {
            marginRight: 16,
        },
        labelText: {
            fontSize: 16,
            fontWeight: "normal",
            color: labelColor?.hex ?? colors.text,
            opacity: disabled ? 0.6 : 1,
            marginRight: 16,
        },

        body: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            flex: 1,
            paddingRight: 12,
        },
        caret: {
            marginLeft: 16,
        },
    });

    const tapGesture =
        onPress &&
        Gesture.Tap()
            .onTouchesDown(() => opacity.set(withTiming(0.5, { duration: 100 })))
            .onTouchesCancelled(() => opacity.set(withTiming(1, { duration: 75 })))
            .onEnd(() => opacity.set(withTiming(1, { duration: 75 })))
            .onStart(() => runOnJS(onPress)());
    const longPressGesture = onLongPress && Gesture.LongPress().onStart(() => runOnJS(onLongPress)());
    const gesture = Gesture.Race(...[tapGesture, longPressGesture].filter((x) => !!x));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.container, { opacity }]}>
                <View style={styles.label}>
                    {icon && <View style={styles.labelIcon}>{icon({ size: 16, fill: colors.primary })}</View>}
                    {label !== undefined && <Text style={styles.labelText}>{label}</Text>}
                </View>
                <View style={styles.body}>
                    {render?.()}
                    {caret && <Bs.ChevronRight size="16" style={styles.caret} />}
                </View>
            </Animated.View>
        </GestureDetector>
    );
}
