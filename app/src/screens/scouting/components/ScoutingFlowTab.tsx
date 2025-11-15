import { type PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton.tsx";
import { Color } from "../../../lib/color.ts";
import { useTheme } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface ReportFlowTabProps {
    title: string;
    buttonText: string;
    onNext: () => void;
}
export function ScoutingFlowTab({ title, buttonText, onNext, children }: PropsWithChildren<ReportFlowTabProps>) {
    const { colors } = useTheme();

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, height: "100%" }}
            contentContainerStyle={{ padding: 16, width: "100%", minHeight: "100%" }}
            keyboardShouldPersistTaps="handled"
            scrollToOverflowEnabled={true}
            bottomOffset={20}
        >
            <Text style={[{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 18 }]}>{title}</Text>
            <View style={{ marginBottom: 16 }}>{children}</View>
            <UIButton
                style={UIButtonStyle.fill}
                color={Color.parse(colors.primary)}
                size={UIButtonSize.xl}
                buttonStyle={{ marginTop: "auto", width: "100%" }}
                text={buttonText}
                onPress={onNext}
            />
        </KeyboardAwareScrollView>
    );
}
