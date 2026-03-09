import { View } from "react-native";
import { Children, type ReactNode } from "react";

export interface UIGridLayoutProps {
    children: ReactNode;
    cols: number;
    gap?: number;
}

export function UIGridLayout({ children: rawChildren, cols, gap = 0 }: UIGridLayoutProps) {
    const children = Children.toArray(rawChildren);

    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            {children.map((child, index) => {
                const x = index % cols;
                const first = x === 0;
                const last = x === cols - 1;

                return <View
                    key={index}
                    style={{
                        flexBasis: `${100 / cols}%`,
                        flexGrow: 0,
                        flexShrink: 1,
                        paddingLeft: first ? 0 : last ? gap*2/3 : gap*1/3,
                        paddingRight: first ? gap*2/3 : last ? 0 : gap*1/3,
                        paddingTop: index >= cols ? gap : 0,
                    }}
                >
                    {child}
                </View>
            })}
        </View>
    );
}
