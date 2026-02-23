import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
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

    const ScrollViewImpl = bottomSheet ? BottomSheetScrollView : ScrollView;

    return (
        <UIListContext.Provider value={{ styles }}>
            <ScrollViewImpl
                scrollToOverflowEnabled={true}
                contentInsetAdjustmentBehavior={"automatic"}
                refreshControl={
                    refreshable && !loading ? (
                        <RefreshControl refreshing={refreshing} onRefresh={doRefresh} />
                    ) : undefined
                }
                style={styles.list}
                contentContainerStyle={styles.listContents}
            >
                {loading ? (
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    Children.map(children, (child, index) => (
                        <React.Fragment key={index}>
                            {child}
                            {index < Children.toArray(children).length - 1 && (
                                <View style={styles.sectionSeparator} />
                            )}
                        </React.Fragment>
                    ))
                )}
            </ScrollViewImpl>
        </UIListContext.Provider>
    );
}

export namespace UIList {
    export interface CardProps extends SectionProps, ItemProps {}
    export function Card({ children, ...props }: CardProps) {
        return (
            <Section {...props}>
                <Item>{children}</Item>
            </Section>
        );
    }

    export interface ItemProps extends PropsWithChildren {}
    export function Item({ children }: ItemProps) {
        const { styles } = useContext(UIListContext);

        return <View style={styles.itemInner}>{children}</View>;
    }

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
        icon?: Icon | undefined;
        label?: string | undefined;
        labelColor?: Color | undefined;
        body?: () => ReactNode | undefined;
        caret?: boolean | undefined;
        disabled?: boolean | undefined;

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
                {icon && <View style={styles.rowIconContainer}>{icon(styles.rowIcon)}</View>}
                {label !== undefined && (
                    <UIText {...styles.rowText} color={labelColor}>
                        {label}
                    </UIText>
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
                    style={styles.row}
                >
                    {content}
                </PressableOpacity>
            );
        } else return <View style={styles.row}>{content}</View>;
    }
}
