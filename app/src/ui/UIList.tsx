import {
    ActivityIndicator,
    RefreshControl,
    SectionList,
    type StyleProp,
    Text,
    View,
    type ViewStyle,
} from "react-native";
import React, { isValidElement, type Key, type ReactElement, type ReactNode, useState } from "react";
import { type Theme, useTheme } from "@react-navigation/native";
import * as Bs from "./icons";
import { type Icon } from "./icons";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import type { Color } from "../lib/color";
import { PressableOpacity } from "./components/PressableOpacity";

export interface UIListProps {
    contentContainerStyle?: StyleProp<ViewStyle>;

    loading?: boolean;
    onRefresh?: (() => Promise<void>) | undefined | null;
    minRefreshMs?: number;

    children?: readonly (UIList.Section | ReactElement | false | null | undefined)[];
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
            {typeof header === "string" && <Text style={styles.sectionHeaderText}>{header}</Text>}
        </View>
    );
    const renderSectionFooter = ({ section }: { section: UIList.Section }) => (
        <View style={[styles.sectionFooter, section === lastSection && styles.lastSectionFooter]}>
            {typeof section.footer === "string" && <Text style={styles.sectionFooterText}>{section.footer}</Text>}
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

    const sections = (children ?? [])
        .filter((x) => !!x)
        .map((x) =>
            isValidElement(x) ? { data: [x], renderSectionHeader: () => null, renderSectionFooter: () => null } : x
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
            keyExtractor={(x, i) => String(x.key ?? i)}
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
        items?: readonly (UIList.Label | false | null | undefined)[];
    }
    export interface Section {
        key?: Key | undefined;
        header?: string | null | undefined;
        footer?: string | null | undefined;
        data: readonly (UIList.Label | ReactElement)[];
    }
    export function Section({ key, header, footer, items }: SectionProps): Section {
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
                            {icon === true ? null : icon({ size: 18, fill: colors.primary })}
                        </View>
                    )}
                    {label !== undefined && (
                        <Text style={labelStyles.text(colors, labelColor)} numberOfLines={1}>
                            {label}
                        </Text>
                    )}
                </View>
            )}
            <View style={labelStyles.body}>
                {body?.()}
                {caret && <Bs.ChevronRight size="16" style={labelStyles.caret} />}
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
            flexGrow: 1,
            padding: 16,
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
            marginBottom: 24,
        },
        lastSectionFooter: {
            marginBottom: 0,
        },
        sectionFooterText: {
            color: colors.text,
            opacity: 0.6,
            fontSize: 12,
        },

        itemSeparator: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },

        item: {
            minHeight: 48,
            backgroundColor: colors.card,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: colors.border,

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
    text: (colors: Theme["colors"], textColor: Color | undefined) =>
        ({
            flexShrink: 1,
            fontSize: 16,
            fontWeight: "normal",
            color: textColor?.hex ?? colors.text,
        } as const),

    body: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
    },
    caret: {},
} as const;
