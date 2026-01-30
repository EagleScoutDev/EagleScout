import { type PropsWithChildren } from "react";
import { View } from "react-native";
import { UIText } from "@/ui/components/UIText";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";
import { useTheme } from "@/ui/context/ThemeContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface ScoutingFlowTabProps {
    title: string;
    buttonText: string;
    onNext: () => void;
}
export function ScoutingFlowTab({
    title,
    buttonText,
    onNext,
    children,
}: PropsWithChildren<ScoutingFlowTabProps>) {
    const { colors } = useTheme();

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
        >
            <UIText size={22} bold style={[{ textAlign: "center", marginBottom: 18 }]}>
                {title}
            </UIText>
            <View style={{ marginBottom: 16 }}>{children}</View>
            <UIButton
                style={UIButtonStyle.fill}
                color={colors.primary}
                size={UIButtonSize.xl}
                buttonStyle={{ width: "100%" }}
                text={buttonText}
                onPress={onNext}
            />
        </KeyboardAwareScrollView>
    );
}
