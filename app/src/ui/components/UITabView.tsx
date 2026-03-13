import {
    Children,
    useEffect,
    useState,
    type ReactElement,
    type ReactNode,
} from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useTheme } from "@/ui/context/ThemeContext";
import { Arrays } from "@/lib/util/Arrays";
import { UIText } from "@/ui/components/UIText";
import Tab = UITabView.Tab;

export interface UITabViewProps<T extends string> {
    keyboardDismissMode?: "none" | "on-drag" | "auto";
    swipeEnabled?: boolean;
    currentKey?: T;
    onTabChange?: (tab: T) => void;
    children: Arrays.ReadonlyRecursive<ReactElement<UITabView.TabProps, typeof Tab>>;
}

export function UITabView<T extends string>({
    currentKey,
    onTabChange,
    children,
}: UITabViewProps<T>) {
    "use no memo";
    const { colors } = useTheme();
    const log = (...args: unknown[]) => console.log("[UITabView]", ...args);

    const childrenArray = Children.toArray(children) as ReactElement<
        UITabView.TabProps,
        typeof Tab
    >[];
    const routes = childrenArray.map(({ props }) => ({
        key: props.tabKey as T,
        title: props.title,
    }));
    const defaultKey = routes[0]?.key;

    const content = new Map<T, ReactNode>(
        childrenArray.map(({ props }) => [props.tabKey as T, props.children]),
    );

    const isControlled = typeof currentKey === "string";
    const [internalKey, setInternalKey] = useState<T | undefined>(() => defaultKey);

    useEffect(() => {
        if (isControlled) return;
        if (internalKey === undefined && defaultKey !== undefined) {
            setInternalKey(defaultKey);
        }
    }, [isControlled, internalKey, defaultKey]);

    useEffect(() => {
        if (routes.length === 0) return;
        if (isControlled) return;

        const hasInternal =
            typeof internalKey === "string" && routes.some((r) => r.key === internalKey);
        if (!hasInternal) {
            setInternalKey(defaultKey);
        }
    }, [routes, internalKey, defaultKey, isControlled]);

    const selectedKey = isControlled ? currentKey : internalKey ?? defaultKey;
    const _index = routes.findIndex((r) => r.key === selectedKey);
    const index = _index !== -1 ? _index : 0;
    const activeKey = routes[index]?.key;
    const activeContent = activeKey ? content.get(activeKey) : null;
    log("render", {
        currentKey,
        internalKey,
        selectedKey,
        activeKey,
        index,
        routes: routes.map((r) => r.key),
    });


    return (
        <View style={{ flex: 1, backgroundColor: colors.bg0.hex }}>
            <ScrollView
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: colors.bg1.hex, maxHeight: 48 }}
                contentContainerStyle={{ minWidth: "100%" }}
            >
                {routes.map((route) => {
                    const active = route.key === activeKey;

                    return (
                        <Pressable
                            key={route.key}
                            onPress={() => {
                                log("header press", { pressed: route.key, currentKey, activeKey });
                                if (!isControlled) {
                                    setInternalKey(route.key);
                                }
                                onTabChange?.(route.key);
                            }}
                            style={{
                                flexGrow: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                borderBottomWidth: 2,
                                borderBottomColor: active ? colors.primary.hex : "transparent",
                            }}
                        >
                            <UIText style={{ fontSize: 12, fontWeight: 600, color: colors.fg.hex }}>
                                {route.title}
                            </UIText>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <View key={activeKey ?? "none"} style={{ flex: 1, backgroundColor: colors.bg0.hex }}>
                {activeContent ?? null}
            </View>
        </View>
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
