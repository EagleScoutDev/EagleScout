import { ScrollView, type StyleProp, View, type ViewStyle, ActivityIndicator, RefreshControl } from "react-native";
import React, { Children, type PropsWithChildren, type ReactNode, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as Bs from "@/ui/icons";
import { type Icon } from "@/ui/icons";
import { Color } from "@/ui/lib/color";
import type { Theme } from "@/ui/lib/theme";
import { UIText } from "@/ui/components/UIText";
import { useTheme } from "@/ui/context/ThemeContext";
import { PressableOpacity } from "@/components/PressableOpacity";

export interface UIListProps extends PropsWithChildren {
    contentContainerStyle?: StyleProp<ViewStyle>;
    loading?: boolean;
    onRefresh?: (() => Promise<any>) | undefined | null;
    minRefreshMs?: number;

    bottomSheet?: boolean; //< TODO: find an alternative to this
}
export function UIList({
    contentContainerStyle,
    loading = false,
    onRefresh,
    minRefreshMs = 500,
    children,
    bottomSheet = false,
}: UIListProps) {
    const { colors } = useTheme();
    const styles = getListStyles(colors);

    const [refreshing, setRefreshing] = useState(false);
    async function doRefresh() {
        if (!onRefresh) return;

        setRefreshing(true);
        if (minRefreshMs <= 0) await onRefresh();
        else
            await Promise.all([
                onRefresh(),
                new Promise((resolve) => setTimeout(resolve, minRefreshMs)),
            ]);
        setRefreshing(false);
    }

    const ScrollViewImpl = bottomSheet ? BottomSheetScrollView : ScrollView;
    return (
        <>
            {loading && !refreshing && <ActivityIndicator style={{ marginTop: 10 }} />}
            <ScrollViewImpl
                style={styles.list}
                contentContainerStyle={[styles.listContents, contentContainerStyle]}
                contentInsetAdjustmentBehavior={"automatic"}
                scrollToOverflowEnabled={true}
                refreshControl={
                    onRefresh && !loading ? (
                        <RefreshControl refreshing={refreshing} onRefresh={doRefresh} />
                    ) : undefined
                }
            >
                {children}
            </ScrollViewImpl>
        </>
    );
}

export namespace UIList {
    export interface SectionProps extends PropsWithChildren {
        title?: string;
        footer?: string;
    }

    export function Section({ title, footer, children }: SectionProps) {
        const { colors } = useTheme();
        const styles = getSectionStyles(colors);

        const childArray = Children.toArray(children);
        const itemCount = childArray.length;

        return (
            <View style={styles.section}>
                {title && (
                    <View style={styles.sectionHeader}>
                        <UIText style={styles.sectionHeaderText}>{title}</UIText>
                    </View>
                )}
                <View>
                    {childArray.map((child, index) => {
                        const first = index === 0;
                        const last = index === itemCount - 1;

                        return (
                            <React.Fragment key={React.isValidElement(child) ? child.key : index}>
                                <View
                                    style={[
                                        styles.item,
                                        first && styles.firstItem,
                                        last && styles.lastItem,
                                    ]}
                                >
                                    {child}
                                </View>
                                {!last && <View style={styles.itemSeparator} />}
                            </React.Fragment>
                        );
                    })}
                </View>
                {footer && (
                    <View style={styles.sectionFooter}>
                        <UIText style={styles.sectionFooterText}>{footer}</UIText>
                    </View>
                )}
            </View>
        );
    }

    export interface LabelProps {
        icon?: Icon;
        label?: string;
        labelColor?: Color;
        body?: () => ReactNode;
        caret?: boolean;
        disabled?: boolean;

        onPress?: (() => void) | undefined | null;
        onLongPress?: (() => void) | undefined | null;
    }

    export function Label({
        icon,
        label,
        labelColor,
        body,
        caret,
        disabled,
        onPress,
        onLongPress,
    }: LabelProps) {
        const { colors } = useTheme();

        const content = (
            <>
                {(icon !== undefined || label !== undefined) && (
                    <View style={[labelStyles.label, { flex: 1 }]}>
                        {icon && (
                            <View style={labelStyles.icon}>
                                {icon({ size: 18, fill: colors.primary.hex })}
                            </View>
                        )}
                        {label !== undefined && (
                            <UIText
                                size={16}
                                color={labelColor}
                                style={labelStyles.text}
                                numberOfLines={1}
                            >
                                {label}
                            </UIText>
                        )}
                    </View>
                )}
                <View style={labelStyles.body}>
                    {body?.()}
                    {caret && <Bs.ChevronRight size="16" fill={colors.fg.hex} />}
                </View>
            </>
        );

        if (onPress || onLongPress) {
            return (
                <PressableOpacity
                    disabled={disabled}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                    }}
                >
                    {content}
                </PressableOpacity>
            );
        }

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                }}
            >
                {content}
            </View>
        );
    }
}

const getListStyles = (_colors: Theme["colors"]) =>
    ({
        list: {
            flex: 1,
        },
        listContents: {
            padding: 16,
            gap: 16,
        },
    }) as const;

const getSectionStyles = (colors: Theme["colors"]) =>
    ({
        section: {
            marginBottom: 8,
        },
        sectionHeader: {
            marginBottom: 5,
        },
        sectionHeaderText: {
            color: colors.fg.hex,
            opacity: 0.6,
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "uppercase",
        },
        sectionFooter: {
            marginTop: 3,
        },
        sectionFooterText: {
            color: colors.fg.hex,
            opacity: 0.6,
            fontSize: 12,
        },
        itemSeparator: {
            height: 1,
            backgroundColor: colors.border.hex,
        },
        item: {
            minHeight: 48,
            backgroundColor: colors.bg1.hex,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: colors.border.hex,

            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
        },
        firstItem: {
            borderTopWidth: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
        },
        lastItem: {
            borderBottomWidth: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
    }) as const;

const labelStyles = {
    label: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    icon: {
        marginRight: 4,
        width: 24,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        flex: 1,
    },
    body: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
} as const;
