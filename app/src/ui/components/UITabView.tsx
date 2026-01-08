import React, { useState } from "react";
import { useTheme } from "@/ui/context/ThemeContext";
import { SceneMap, TabBar, type TabDescriptor, TabView, type TabViewProps } from "react-native-tab-view";

export interface UITabViewProps<T extends string>
    extends Pick<TabViewProps<any>, "keyboardDismissMode" | "swipeEnabled"> {
    currentKey?: T;
    onTabChange?: (tab: T) => void;
    tabs: { key: T; title: string; component: React.ComponentType }[];
}
export function UITabView<T extends string>({ currentKey, onTabChange, tabs, ...props }: UITabViewProps<T>) {
    const { colors } = useTheme();

    const [internalIndex, setInternalIndex] = useState(0);
    const indices = new Map(tabs.map(({ key }, i) => [key, i]));

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

    return (
        <TabView
            swipeEnabled={false}
            {...props}
            navigationState={{
                index: currentKey !== undefined ? indices.get(currentKey)! : internalIndex,
                routes: tabs,
            }}
            renderScene={SceneMap(Object.fromEntries(tabs.map(({ key, component }) => [key, component])))}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    style={{ backgroundColor: colors.bg1.hex }}
                    indicatorStyle={{ backgroundColor: colors.primary.hex }}
                />
            )}
            onIndexChange={(to) => {
                if (currentKey === undefined) setInternalIndex(to);
                onTabChange?.(tabs[to].key);
            }}
            options={Object.fromEntries(tabs.map(({ key }) => [key, extraOptions]))}
        />
    );
}
