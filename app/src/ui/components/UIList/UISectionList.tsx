import { ActivityIndicator, RefreshControl, SectionList, View } from "react-native";
import React, { type Key, type ReactNode, useState } from "react";
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
    renderItem: (item: TItem, index: number, section: TSection) => ReactNode;
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
    const lastSection = sections[sections.length - 1];

    const refreshable = onRefresh && !loading;
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
    const refreshControl = refreshable ? (
        <RefreshControl refreshing={refreshing} onRefresh={doRefresh} />
    ) : undefined;

    const SectionListImpl = bottomSheet ? BottomSheetSectionList : SectionList;
    return (
        <SectionListImpl
            scrollToOverflowEnabled={true}
            contentInsetAdjustmentBehavior={"automatic"}
            extraData={[styles, renderItem]}
            refreshControl={refreshControl}
            sections={sections}
            keyExtractor={(x, i) => String(keyExtractor(x, i))}
            style={styles.list}
            contentContainerStyle={styles.listContents}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            renderSectionHeader={({ section }) => {
                const title = section.title ?? renderHeader?.(section);

                if (typeof title !== "string") return null;
                return (
                    <View style={styles.sectionHeader}>
                        <UIText style={styles.sectionHeaderText}>{title}</UIText>
                    </View>
                );
            }}
            renderSectionFooter={({ section }) => {
                const footer = section.footer ?? renderFooter?.(section);

                if (typeof footer !== "string") return null;
                return (
                    <View style={styles.sectionFooter}>
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
                        {renderItem(item, i, section)}
                    </View>
                );
            }}
        />
    );
}
