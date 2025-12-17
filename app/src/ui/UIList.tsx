import { ActivityIndicator, RefreshControl, SectionList, type StyleProp, View, type ViewStyle } from "react-native";
import { UIText } from "../ui/UIText";
import React, { isValidElement, type Key, type ReactElement, type ReactNode, useState } from "react";
import * as Bs from "./icons";
import { type Icon } from "./icons";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import type { Color } from "../lib/color";
import { PressableOpacity } from "./components/PressableOpacity";
import type { Theme } from "../theme";
import { useTheme } from "../lib/contexts/ThemeContext.ts";
import { Arrays } from "../lib/util/Arrays.ts";

export interface UIListProps {
    contentContainerStyle?: StyleProp<ViewStyle>;

    loading?: boolean;
    onRefresh?: (() => Promise<void>) | undefined | null;
    minRefreshMs?: number;

    children?: Arrays.ReadonlyRecursive<UIList.Section | ReactElement | false | null | undefined>;
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
    const renderSectionHeader = ({ section: { header } }: { section: UIList.Section }) => (
        <View style={styles.sectionHeader}>
            {typeof header === "string" && <UIText style={styles.sectionHeaderText}>{header}</UIText>}
        </View>
    );
    const renderSectionFooter = ({ section }: { section: UIList.Section }) => (
        <View style={[styles.sectionFooter, section === lastSection && styles.lastSectionFooter]}>
            {typeof section.footer === "string" && <UIText style={styles.sectionFooterText}>{section.footer}</UIText>}
        </View>
    );

    const [refreshing, setRefreshing] = useState(false);
    async function doRefresh() {
        if (!onRefresh) return;

        setRefreshing(true);
        if (minRefreshMs <= 0) await onRefresh();
        else await Promise.all([onRefresh(), new Promise((resolve) => setTimeout(resolve, minRefreshMs))]);
        setRefreshing(false);
    }

    const sections = !children
        ? []
        : (Array.isArray(children) ? children.flat() : [children])
              .filter((x) => !!x)
              .map((x, i) =>
                  isValidElement(x)
                      ? { data: [x], renderSectionHeader: () => null, renderSectionFooter: () => null }
                      : { ...x, key: x.key === null || x.key === undefined ? "#" + String(i) : "$" + String(x.key) }
              );
    const lastSection = sections[sections.length - 1];

    const SectionListImpl = bottomSheet ? BottomSheetSectionList : SectionList;
    return (
        <SectionListImpl
            style={styles.list}
            scrollToOverflowEnabled={true}
            contentInsetAdjustmentBehavior={"automatic"}
            extraData={[styles]}
            contentContainerStyle={[styles.listContents, contentContainerStyle]}
            refreshControl={
                onRefresh && !loading ? <RefreshControl refreshing={refreshing} onRefresh={doRefresh} /> : undefined
            }
            sections={sections}
            keyExtractor={(x, i) => (x.key === null || x.key === undefined ? "#" + String(i) : "$" + String(x.key))}
            ListHeaderComponent={loading && !refreshing ? ActivityIndicator : null}
            ListHeaderComponentStyle={{ marginBottom: 10 }}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={false}
            renderSectionFooter={renderSectionFooter}
            renderItem={({ section, item, index: i }) => {
                if (isValidElement(item)) return item;

                const { disabled, onPress, onLongPress, render } = item;
                const first = i === 0;
                const last = i === section.data.length - 1;

                const content = (
                    <View
                        style={[styles.item, first && styles.firstItem, last && styles.lastItem]}
                        children={render()}
                    />
                );

                return onPress || onLongPress ? (
                    <PressableOpacity
                        disabled={disabled}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        children={content}
                    />
                ) : (
                    <View children={content} />
                );
            }}
        />
    );
}

export namespace UIList {
    export interface SectionProps {
        key?: Key | undefined;
        header?: string | null | undefined;
        footer?: string | null | undefined;
        items?: readonly (UIList.ItemInfo | false | null | undefined)[];
    }
    export interface Section {
        key?: Key | undefined;
        header?: string | null | undefined;
        footer?: string | null | undefined;
        data: readonly (UIList.ItemInfo | ReactElement)[];
    }
    export function Section({ key, header, footer, items }: SectionProps): Section {
        // TODO: add a FlatList-like api
        // TODO: this is bad because index-based keys will end up being shifted when falsy elements are temporarily removed
        return { key, header, footer, data: (items ?? []).filter((x) => !!x) };
    }

    export interface ItemInfo {
        key?: Key | undefined;

        render: () => ReactNode;

        disabled?: boolean;
        onPress?: (() => void) | undefined | null;
        onLongPress?: (() => void) | undefined | null;
    }

    export interface LabelProps {
        key?: Key | undefined;

        icon?: Icon | true;
        label?: string;
        labelColor?: Color;
        body?: () => ReactNode;
        caret?: boolean;
        disabled?: boolean;

        onPress?: (() => void) | undefined | null;
        onLongPress?: (() => void) | undefined | null;
    }
    /**
     * List item with an icon, label, body, and caret.
     */
    export interface Label extends ItemInfo {}
    export function Label({ key, ...props }: LabelProps): ItemInfo {
        return {
            key,
            ...props,
            render: () => <RenderLabel {...props} />,
        };
    }
}

function RenderLabel({ icon, label, labelColor, body, caret }: UIList.LabelProps) {
    "use memo";
    const { colors } = useTheme();

    return (
        <>
            {(icon !== undefined || label !== undefined) && (
                <View style={labelStyles.label}>
                    {icon && (
                        <View style={labelStyles.icon}>
                            {icon === true ? null : icon({ size: 18, fill: colors.primary.hex })}
                        </View>
                    )}
                    {label !== undefined && (
                        <UIText size={16} color={labelColor} style={labelStyles.text} numberOfLines={1}>
                            {label}
                        </UIText>
                    )}
                </View>
            )}
            <View style={labelStyles.body}>
                {body?.()}
                {caret && <Bs.ChevronRight size="16" color={colors.fg.level(1).hex} />}
            </View>
        </>
    );
}

const getListStyles = (colors: Theme["colors"]) =>
    ({
        list: {
            flex: 1,
        },
        listContents: {
            padding: 16,
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
            marginBottom: 24,
        },
        lastSectionFooter: {
            marginBottom: 0,
        },
        sectionFooterText: {
            color: colors.fg.hex,
            opacity: 0.6,
            fontSize: 12,
        },

        itemSeparator: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border.hex,
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

            paddingHorizontal: 12,
            paddingVertical: 8,
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
    } as const);

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
        flexShrink: 1,
    },
    body: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
    },
} as const;
