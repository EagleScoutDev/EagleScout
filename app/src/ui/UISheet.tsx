import { UIButton, type UIButtonProps, UIButtonSize, UIButtonStyle } from "./UIButton.tsx";
import { Text, View } from "react-native";
import BottomSheet, { BottomSheetHandle, type BottomSheetProps, useBottomSheet } from "@gorhom/bottom-sheet";
import { ThreeCenterLayout } from "./layout/ThreeCenterLayout.tsx";

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

        return (
            <View style={{ padding: 8, paddingTop: 0 }}>
                <View style={{ height: 8 }}>{handle && <BottomSheetHandle {...sheet} />}</View>
                <View
                    style={{
                        marginTop: handle ? 4 : 0,
                    }}
                >
                    <ThreeCenterLayout>
                        <UIButton size={UIButtonSize.md} style={UIButtonStyle.text} {...left} />

                        <Text style={{ fontSize: 18, fontWeight: "bold" }} numberOfLines={1}>
                            {title}
                        </Text>

                        <UIButton size={UIButtonSize.md} style={UIButtonStyle.text} {...right} />
                    </ThreeCenterLayout>
                </View>
            </View>
        );
    }
}
