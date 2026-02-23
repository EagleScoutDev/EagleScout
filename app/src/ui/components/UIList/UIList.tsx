import { RefreshControl, ScrollView, View } from "react-native";
import React, {
    Children,
    createContext,
    type PropsWithChildren,
    type ReactNode,
    useContext,
    useState,
} from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as Bs from "@/ui/icons";
import { type Icon } from "@/ui/icons";
import { Color } from "@/ui/lib/color";
import { UIText } from "@/ui/components/UIText";
import { useTheme } from "@/ui/context/ThemeContext";
import { PressableOpacity } from "@/components/PressableOpacity";
import { getListStyles, type UIListStyles } from "@/ui/components/UIList/styles";
import { Theme } from "@/ui/lib/theme";

const UIListContext = createContext<{
    styles: UIListStyles;
}>({ styles: getListStyles(Theme.light.colors) });

export interface UIListProps extends PropsWithChildren {
    loading?: boolean;
    onRefresh?: (() => Promise<any>) | undefined | null;
    minRefreshMs?: number;
    bottomSheet?: boolean; //< TODO: find an alternative to this
}
export function UIList({
    loading = false,
    onRefresh,
    minRefreshMs = 500,
    children,
    bottomSheet = false,
}: UIListProps) {
    const { colors } = useTheme();
    const styles = getListStyles(colors);

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

    const ScrollViewImpl = bottomSheet ? BottomSheetScrollView : ScrollView;
    return (
        <UIListContext.Provider value={{ styles }}>
            <ScrollViewImpl
                style={styles.list}
                contentContainerStyle={styles.listContents}
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
        </UIListContext.Provider>
    );
}

export namespace UIList {
    export interface SectionProps extends PropsWithChildren {
        title?: string;
        footer?: string;
    }
    export function Section({ title, footer, children }: SectionProps) {
        const { styles } = useContext(UIListContext);

        const childArray = Children.toArray(children);
        const itemCount = childArray.length;

        return (
            <>
                {title && (
                    <View style={styles.sectionHeader}>
                        <UIText style={styles.sectionHeaderText}>{title}</UIText>
                    </View>
                )}
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
                {footer && (
                    <View style={styles.sectionFooter}>
                        <UIText style={styles.sectionFooterText}>{footer}</UIText>
                    </View>
                )}
            </>
        );
    }

    export interface RowProps {
        icon?: Icon;
        label?: string;
        labelColor?: Color;
        body?: () => ReactNode;
        caret?: boolean;
        disabled?: boolean;

        onPress?: (() => void) | undefined | null;
        onLongPress?: (() => void) | undefined | null;
    }
    export function Row({
        icon,
        label,
        labelColor,
        body,
        caret,
        disabled,
        onPress,
        onLongPress,
    }: RowProps) {
        const { styles } = useContext(UIListContext);

        const content = (
            <>
                {(icon !== undefined || label !== undefined) && (
                    <View style={styles.row}>
                        {icon && (
                            <View style={styles.rowIconContainer}>{icon(styles.rowIcon)}</View>
                        )}
                        {label !== undefined && (
                            <UIText {...styles.rowText} color={labelColor}>
                                {label}
                            </UIText>
                        )}
                    </View>
                )}
                <View style={styles.rowBody}>
                    {body?.()}
                    {caret && <Bs.ChevronRight {...styles.rowCaret} />}
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
