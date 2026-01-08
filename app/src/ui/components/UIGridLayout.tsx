import { View } from "react-native";
import { Children, type ReactNode } from "react";

export interface UIGridLayoutProps {
    children: ReactNode;
    columns: number;
    gap?: number;
}

export function UIGridLayout({ children: rawChildren, columns, gap = 0 }: UIGridLayoutProps) {
    const children = Children.toArray(rawChildren);

    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            {children.map((child, index) => (
                <View
                    key={index}
                    style={{
                        flexBasis: `${100 / columns}%`,
                        flexGrow: 0,
                        flexShrink: 1,
                        paddingLeft: index % columns === 0 ? 0 : gap,
                        paddingTop: index >= columns ? gap : 0,
                    }}
                >
                    {child}
                </View>
            ))}
        </View>
    );
}
