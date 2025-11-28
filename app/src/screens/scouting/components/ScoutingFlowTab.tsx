import { type PropsWithChildren } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton";
import { Color } from "../../../lib/color";
import { useTheme } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
                style={{ flex: 1}}
                contentContainerStyle={{ padding: 16 }}
                keyboardShouldPersistTaps="handled"
                scrollToOverflowEnabled={true}
                contentInsetAdjustmentBehavior={"automatic"}
            >
                <Text style={[{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 18 }]}>
                    {title}
                </Text>
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
        </SafeAreaProvider>
    );
}
