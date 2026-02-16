import type { Icon } from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { PressableOpacity } from "@/components/PressableOpacity";
import { useEffect, useRef } from "react";
import { UIScrollView } from "@/ui/components/UIScrollView";
import { type LayoutRectangle, View, type ViewProps } from "react-native";

export interface UIChipProps {
    lg: true;
    icon?: Icon;
    label?: string;
    active?: boolean;
    onPress?: () => void;
}
export function UIChip({ lg, icon, label, active = false, onPress }: UIChipProps) {
    const { colors } = useTheme();

    if (lg) {
        const fg = active ? colors.primary.fg : colors.fg;

        return (
            <PressableOpacity
                onPress={onPress}
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        height: 36,
                        borderRadius: 18,
                        gap: 8,
                    },
                    active
                        ? { backgroundColor: colors.primary.hex }
                        : { borderColor: colors.border.hex, borderWidth: 1 },
                ]}
            >
                {icon?.({ size: 16, fill: fg.hex })}
                {label && (
                    <UIText size={16} color={fg}>
                        {label}
                    </UIText>
                )}
            </PressableOpacity>
        );
    }
}

export namespace UIChip {
    export interface RadioRowProps<K extends string = string> {
        options: { key: K; label: string }[];
        value: K;
        onChange: (value: K) => void;
    }
    export function RadioRow<K extends string = string>({
        options,
        value,
        onChange
    }: RadioRowProps<K>) {
        const scrollRef = useRef<UIScrollView>(null);
        const rects = useRef<Map<K, LayoutRectangle>>(new Map());

        useEffect(() => {
            return () => rects.current.clear();
        }, [options]);

        return (
            <View>
                <UIScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: "row", flexGrow: 1, paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
                >
                    {options.map(({ key, label }) => (
                        <View
                            key={key}
                            onLayout={(e) => rects.current.set(key, e.nativeEvent.layout)}
                        >
                            <UIChip
                                lg
                                label={label}
                                active={value === key}
                                onPress={() => {
                                    const rect = rects.current.get(key);
                                    if (rect) scrollRef.current?.centerRect(rect);

                                    onChange(key);
                                }}
                            />
                        </View>
                    ))}
                </UIScrollView>
            </View>
        );
    }
}
