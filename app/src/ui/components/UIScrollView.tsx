import { type LayoutRectangle, ScrollView, type ScrollViewProps } from "react-native";
import { type Ref, useImperativeHandle, useRef } from "react";

export interface UIScrollViewProps extends ScrollViewProps {
    ref?: Ref<UIScrollView> | undefined;
}
export interface UIScrollView {
    centerRect(rect: LayoutRectangle): void;
}
export function UIScrollView({ ref, ...props }: UIScrollViewProps) {
    const scrollRef = useRef<ScrollView>(null);
    const scrollRect = useRef<LayoutRectangle>(null);

    useImperativeHandle(ref, () => ({
        centerRect({ x, y, width, height }: LayoutRectangle) {
            if(scrollRect.current === null) return
            const {width: sw, height: sh} = scrollRect.current

            scrollRef.current?.scrollTo({ x: x + width / 2 - sw / 2, y: y + height / 2 - sh / 2 });
        },
    }));
    return <ScrollView onLayout={(e) => scrollRect.current = e.nativeEvent.layout} ref={scrollRef} {...props} />;
}

export namespace UIScrollView {
    export interface ItemProps {}
    export function Item() {}
}
