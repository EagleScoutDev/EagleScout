import { UIButton, type UIButtonProps, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";
import { UIText } from "@/ui/components/UIText";
import { View } from "react-native";
import BottomSheet, { BottomSheetHandle, type BottomSheetProps, useBottomSheet } from "@gorhom/bottom-sheet";
import { ThreeCenterLayout } from "@/ui/components/layout/ThreeCenterLayout";
import { useTheme } from "@/ui/context/ThemeContext";

export interface UISheetProps extends BottomSheetProps {}
export function UISheet(props: UISheetProps) {
    const { colors } = useTheme();

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
            backgroundStyle={{
                backgroundColor: colors.bg0.hex,
                borderRadius: 24,
            }}
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
