import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";
import { UIText } from "@/ui/components/UIText";
import { Platform, View } from "react-native";
import BottomSheet, { type BottomSheetProps } from "@gorhom/bottom-sheet";
import { ThreeCenterLayout } from "@/ui/components/layout/ThreeCenterLayout";
import { useTheme } from "@/ui/context/ThemeContext";
import { type UIToolbarItem } from "@/ui/components/UIToolbar";

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
        // handle?: boolean;

        title?: string | null | undefined;
        left?: [UIToolbarItem | false | null | undefined];
        right?: [UIToolbarItem | false | null | undefined];
    }
    export function Header({ title, left, right }: HeaderProps) {
        return (
            <View style={{ padding: 8 }}>
                {/*TODO: <View style={{ height: 8 }}>{handle && <BottomSheetHandle {...sheet} />}</View>*/}
                <View style={{ marginTop: 0 }}>
                    <ThreeCenterLayout>
                        <HeaderItem item={left?.[0] || null} />

                        <UIText size={18} bold style={{ paddingVertical: 8 }} numberOfLines={1}>
                            {title}
                        </UIText>

                        <HeaderItem item={right?.[0] || null} />
                    </ThreeCenterLayout>
                </View>
            </View>
        );
    }
    function HeaderItem({ item }: { item: UIToolbarItem | null }) {
        const { colors } = useTheme();

        if (item === null) return <></>;

        const icon =
            item.icon === undefined
                ? undefined
                : typeof item.icon === "string"
                ? item.icon
                : item.icon[Platform.OS];

        switch (item.role) {
            case "done":
                item = {
                    text: "Done",
                    icon: { ios: "checkmark" },
                    color: colors.primary,
                    iosTint: colors.primary,
                    ...item,
                };
                break;
            case "cancel":
                item = {
                    text: "Cancel",
                    icon: { ios: "xmark" },
                    color: colors.danger,
                    ...item,
                };
        }

        // TODO: icons
        return (
            <UIButton
                size={UIButtonSize.md}
                style={UIButtonStyle.text}
                icon={icon}
                {...item}
                icon={undefined}
            />
        );
    }
}
