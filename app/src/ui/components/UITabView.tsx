import { Children, type ReactElement, type ReactNode } from "react";
import { useTheme } from "@/ui/context/ThemeContext";
import { TabBar, type TabDescriptor, TabView, type TabViewProps } from "react-native-tab-view";
import { Arrays } from "@/lib/util/Arrays";
import Tab = UITabView.Tab;

export interface UITabViewProps<T extends string> extends Pick<
    TabViewProps<any>,
    "keyboardDismissMode" | "swipeEnabled"
> {
    currentKey?: T;
    onTabChange?: (tab: T) => void;
    children: Arrays.ReadonlyRecursive<ReactElement<UITabView.TabProps, typeof Tab>>;
}

export function UITabView<T extends string>({
    currentKey,
    onTabChange,
    children,
    ...props
}: UITabViewProps<T>) {
    const { colors } = useTheme();

    const childrenArray = Children.toArray(children) as ReactElement<
        UITabView.TabProps,
        typeof Tab
    >[];
    const routes = childrenArray.map(({ props }) => ({
        key: props.tabKey as T,
        title: props.title,
    }));

    const content = new Map<T, ReactNode>(
        childrenArray.map(({ props }) => [props.tabKey as T, props.children]),
    );

    const extraOptions: TabDescriptor<any> = {
        sceneStyle: {
            backgroundColor: colors.bg0.hex,
        },
        labelStyle: {
            color: colors.fg.hex,
            fontSize: 12,
            fontWeight: 600,
        },
    };

    const _index = routes.findIndex((r) => r.key === currentKey);
    const index = _index !== -1 ? _index : 0;

    return (
        <TabView
            lazy
            lazyPreloadDistance={0}
            swipeEnabled={false}
            {...props}
            navigationState={{
                index,
                routes,
            }}
            renderScene={({ route }) => content.get(route.key)}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    style={{ backgroundColor: colors.bg1.hex }}
                    indicatorStyle={{ backgroundColor: colors.primary.hex }}
                />
            )}
            onIndexChange={(to) => onTabChange?.(routes[to].key)}
            options={Object.fromEntries(routes.map(({ key }) => [key, extraOptions]))}
        />
    );
}

export namespace UITabView {
    export interface TabProps {
        tabKey: string;
        title: string;
        children: ReactNode;
    }

    export function Tab({ children }: TabProps): ReactElement<TabProps, typeof Tab> {
        return <>{children}</>;
    }
}
