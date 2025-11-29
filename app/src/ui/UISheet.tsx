import { UIButton, type UIButtonProps, UIButtonSize, UIButtonStyle } from "./UIButton";
import { UIText } from "../ui/UIText";
import { View } from "react-native";
import BottomSheet, { BottomSheetHandle, type BottomSheetProps, useBottomSheet } from "@gorhom/bottom-sheet";
import { ThreeCenterLayout } from "./layout/ThreeCenterLayout";

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
        left?: UIButtonProps | false | null | undefined;
        right?: UIButtonProps | false | null | undefined;
    }
    export function Header({ handle = false, title, left, right }: HeaderProps) {
        "use memo";

        const sheet = useBottomSheet();

        return (
            <View style={{ padding: 8, paddingTop: 0 }}>
                <View style={{ height: 8 }}>{handle && <BottomSheetHandle {...sheet} />}</View>
                <View style={{ marginTop: handle ? 4 : 0 }}>
                    <ThreeCenterLayout>
                        <UIButton size={UIButtonSize.md} style={UIButtonStyle.text} {...(left || {})} />

                        <UIText size={18} bold style={{ paddingVertical: 8 }} numberOfLines={1}>
                            {title}
                        </UIText>

                        <UIButton size={UIButtonSize.md} style={UIButtonStyle.text} {...(right || {})} />
                    </ThreeCenterLayout>
                </View>
            </View>
        );
    }
}
