import { type PropsWithChildren } from "react";
import { UIText } from "../../../ui/UIText";
import { View } from "react-native";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton";
import { Color } from "../../../lib/color";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

interface ReportFlowTabProps {
    title: string;
    buttonText: string;
    onNext: () => void;
}
export function ScoutingFlowTab({ title, buttonText, onNext, children }: PropsWithChildren<ReportFlowTabProps>) {
    const { colors } = useTheme();

    return (
        <SafeAreaProvider>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                keyboardShouldPersistTaps="handled"
                scrollToOverflowEnabled={true}
                contentInsetAdjustmentBehavior={"automatic"}
            >
                <UIText size={22} bold style={[{ textAlign: "center", marginBottom: 18 }]}>
                    {title}
                </UIText>
                <View style={{ marginBottom: 16 }}>{children}</View>
                <UIButton
                    style={UIButtonStyle.fill}
                    color={Color.parse(colors.primary.hex)}
                    size={UIButtonSize.xl}
                    buttonStyle={{ marginTop: "auto", width: "100%" }}
                    text={buttonText}
                    onPress={onNext}
                />
            </KeyboardAwareScrollView>
        </SafeAreaProvider>
    );
}
