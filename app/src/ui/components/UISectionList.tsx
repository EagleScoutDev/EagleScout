import {
    ActivityIndicator,
    RefreshControl,
    SectionList,
    type StyleProp,
    View,
    type ViewStyle,
} from "react-native";
import React, { type Key, type ReactNode, useState } from "react";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import type { Theme } from "@/ui/lib/theme";
import { UIText } from "@/ui/components/UIText";
import { useTheme } from "@/ui/context/ThemeContext";

export interface UISectionListSection<TItem = any> {
    title?: string | null | undefined;
    footer?: string | null | undefined;
    data: readonly TItem[];
}

export interface UISectionListProps<TItem = any, TSection extends UISectionListSection<TItem> = any> {
    contentContainerStyle?: StyleProp<ViewStyle>;
    sections: TSection[];
    renderItem: (item: TItem, index: number, section: TSection) => ReactNode;
    renderHeader?: (section: TSection) => string | null | undefined;
    renderFooter?: (section: TSection) => string | null | undefined;
    keyExtractor: (item: TItem, index: number) => Key;
    loading?: boolean;
    onRefresh?: (() => Promise<any>) | undefined | null;
    minRefreshMs?: number;
    bottomSheet?: boolean;
}

export function UISectionList<T = any>({
    contentContainerStyle,
    sections,
    renderItem,
    renderHeader,
    renderFooter,
    keyExtractor,
    loading = false,
    onRefresh,
    minRefreshMs = 500,
    bottomSheet = false,
}: UISectionListProps<T>) {
    const { colors } = useTheme();
    const styles = getListStyles(colors);
    const lastSection = sections[sections.length - 1];

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

    const SectionListImpl = bottomSheet ? BottomSheetSectionList : SectionList;
    return (
        <SectionListImpl
            style={styles.list}
            scrollToOverflowEnabled={true}
            contentInsetAdjustmentBehavior={"automatic"}
            extraData={[styles, renderItem]}
            contentContainerStyle={[styles.listContents, contentContainerStyle]}
            refreshControl={
                onRefresh && !loading ? (
                    <RefreshControl refreshing={refreshing} onRefresh={doRefresh} />
                ) : undefined
            }
            sections={sections}
            keyExtractor={(x, i) => String(keyExtractor(x, i))}
            ListHeaderComponent={loading && !refreshing ? ActivityIndicator : null}
            ListHeaderComponentStyle={{ marginBottom: 10 }}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            renderSectionHeader={({ section }) => {
                const title = section["title"] ?? renderHeader?.(section);

                if (typeof title !== "string") return null;
                return (
                    <View style={styles.sectionHeader}>
                        <UIText style={styles.sectionHeaderText}>{title}</UIText>
                    </View>
                );
            }}
            renderSectionFooter={({ section }) => {
                if (!section.footer) return null;
                return (
                    <View
                        style={[
                            styles.sectionFooter,
                            section === lastSection && styles.lastSectionFooter,
                        ]}
                    >
                        <UIText style={styles.sectionFooterText}>{section.footer}</UIText>
                    </View>
                );
            }}
            renderItem={({ item, index: i, section: rnSection }) => {
                const section = rnSection as UISectionListSection<T>;
                const first = i === 0;
                const last = i === section.data.length - 1;

                return (
                    <View style={[styles.item, first && styles.firstItem, last && styles.lastItem]}>
                        {renderItem({ item: item as T, index: i, section })}
                    </View>
                );
            }}
        />
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
    }) as const;
