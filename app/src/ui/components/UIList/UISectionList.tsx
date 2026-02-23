import { ActivityIndicator, RefreshControl, SectionList, View } from "react-native";
import React, { type Key, useState } from "react";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { UIText } from "@/ui/components/UIText";
import { useTheme } from "@/ui/context/ThemeContext";
import { getListStyles } from "@/ui/components/UIList/styles";
import { UIList } from "@/ui/components/UIList/UIList";

export interface UISectionListSection<TItem = any> {
    title?: string | null | undefined;
    footer?: string | null | undefined;
    data: readonly TItem[];
}

export interface UISectionListProps<
    TItem = unknown,
    TSection extends UISectionListSection<TItem> = UISectionListSection<TItem>,
> {
    sections: TSection[];
    keyExtractor: (item: TItem, index: number) => Key;
    renderItem: (item: TItem, index: number, section: TSection) => UIList.RowProps;
    renderHeader?: (section: TSection) => string | null | undefined;
    renderFooter?: (section: TSection) => string | null | undefined;

    loading?: boolean;
    onRefresh?: (() => Promise<any>) | undefined | null;
    minRefreshMs?: number;
    bottomSheet?: boolean;
}

export function UISectionList<T = unknown>({
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

    const refreshable = !!onRefresh;
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
            scrollToOverflowEnabled={true}
            contentInsetAdjustmentBehavior={"automatic"}
            refreshControl={refreshable ? (
                <RefreshControl refreshing={refreshing} onRefresh={doRefresh} />
            ) : undefined}

            extraData={[styles, renderItem]}
            sections={loading ? [] : sections}
            keyExtractor={(x, i) => String(keyExtractor(x, i))}

            style={styles.list}
            contentContainerStyle={styles.listContents}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
            ListEmptyComponent={
                loading ? (
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : undefined
            }
            renderSectionHeader={({ section }) => {
                const title = renderHeader?.(section) ?? section.title;

                if (typeof title !== "string") return null;
                return (
                    <View style={styles.sectionHeader}>
                        <UIText style={styles.sectionHeaderText}>{title}</UIText>
                    </View>
                );
            }}
            renderSectionFooter={({ section }) => {
                const footer = renderFooter?.(section) ?? section.footer;

                if (typeof footer !== "string") return null;
                return (
                    <View style={styles.sectionFooter}>
                        <UIText style={styles.sectionFooterText}>{footer}</UIText>
                    </View>
                );
            }}
            renderItem={({ item, index: i, section: rnSection }) => {
                const section = rnSection as UISectionListSection<T>;
                const first = i === 0;
                const last = i === section.data.length - 1;

                return (
                    <View style={[styles.item, first && styles.firstItem, last && styles.lastItem]}>
                        <UIList.Row {...renderItem(item, i, section)} />
                    </View>
                );
            }}
        />
    );
}
