import { UIButton, UIButtonFrame, type UIButtonProps, UIButtonSize } from "./UIButton.tsx";
import { Text, View } from "react-native";
import BottomSheet, { type BottomSheetProps } from "@gorhom/bottom-sheet";

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
        title?: string | null | undefined;
        left?: UIButtonProps | null | undefined;
        right?: UIButtonProps | null | undefined;
    }
    export function Header({ title, left, right }: HeaderProps) {
        return (
            <View
                style={{
                    width: "100%",
                    padding: 8,
                    gap: 16,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row" }}>
                    <UIButton size={UIButtonSize.md} frame={UIButtonFrame.text} {...left} />
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>{title}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <UIButton size={UIButtonSize.md} frame={UIButtonFrame.text} {...right} />
                </View>
            </View>
        );
    }
}
