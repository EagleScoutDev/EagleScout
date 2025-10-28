import { UIButton, UIButtonStyle, type UIButtonProps, UIButtonSize } from "./UIButton.tsx";
import { type LayoutChangeEvent, View } from "react-native";
import BottomSheet, {
    BottomSheetHandle,
    type BottomSheetProps,
    useBottomSheet,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import Animated, { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { styles } from "../screens/onboarding/styles.ts";

export interface UISheetProps extends BottomSheetProps {}
export function UISheet(props: UISheetProps) {
    "use memo";

    return (
        <BottomSheet
            style={{
                boxShadow: [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        color: "rgba(0,0,0,0.125)",
                        blurRadius: 8,
                        spreadDistance: 1,
                    },
                ],
                borderRadius: 24,
            }}
            backgroundStyle={{ borderRadius: 24 }}
            {...props}
        />
    );
}

export namespace UISheet {
    export interface HeaderProps {
        handle?: boolean;

        title?: string | null | undefined;
        left?: UIButtonProps | null | undefined;
        right?: UIButtonProps | null | undefined;
    }
    export function Header({ handle = false, title, left, right }: HeaderProps) {
        "use memo";

        const sheet = useBottomSheet();

        // Manually calculate the positioning of the center title,
        // such that it consumes the maximum space whilst
        // remaining centered relative to the root element
        const leftWidth = useSharedValue(0);
        const rightWidth = useSharedValue(0);
        function updateLeftLayout(e: LayoutChangeEvent) {
            leftWidth.set(e.nativeEvent.layout.width);
        }
        function updateRightLayout(e: LayoutChangeEvent) {
            rightWidth.set(e.nativeEvent.layout.width);
        }

        const gap = 16; //< Gap between the title and buttons

        const centerMargin = useDerivedValue(
            () => Math.max(leftWidth.value, rightWidth.value) + gap,
            [leftWidth, rightWidth]
        );

        return (
            <View style={{ padding: 8, paddingTop: 0 }}>
                <View style={{ height: 8 }}>
                    {handle && <BottomSheetHandle {...sheet} />}
                </View>
                <View
                    style={{
                        marginTop: handle ? 4 : 0,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        position: "relative",
                    }}
                >
                    <View onLayout={updateLeftLayout}>
                        <UIButton size={UIButtonSize.md} style={UIButtonStyle.text} {...left} />
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                        }}
                    >
                        <Animated.Text
                            style={{ marginHorizontal: centerMargin, fontSize: 18, fontWeight: "bold" }}
                            numberOfLines={1}
                        >
                            {title}
                        </Animated.Text>
                    </View>
                    <View onLayout={updateRightLayout}>
                        <UIButton size={UIButtonSize.md} style={UIButtonStyle.text} {...right} />
                    </View>
                </View>
            </View>
        );
    }
}
