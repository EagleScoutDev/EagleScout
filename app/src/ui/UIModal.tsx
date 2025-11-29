import { Modal, TouchableWithoutFeedback, View } from "react-native";
import { UIText } from "../ui/UIText";
import { useTheme } from "@react-navigation/native";
import type { PropsWithChildren } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export interface StandardModalProps extends PropsWithChildren {
    visible: boolean;
    title?: string;
    onDismiss?: () => void;
    backdropPressBehavior: "none" | "dismiss";
}
export function UIModal({ visible, title, onDismiss, backdropPressBehavior, children }: StandardModalProps) {
    "use memo";
    const { colors } = useTheme();

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onDismiss={backdropPressBehavior === "dismiss" ? onDismiss : undefined}
        >
            <SafeAreaProvider>
                <TouchableWithoutFeedback
                    onPress={() => backdropPressBehavior === "dismiss" && onDismiss && onDismiss()}
                >
                    <SafeAreaView
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <TouchableWithoutFeedback>
                            <View
                                style={{
                                    width: "85%",
                                    maxWidth: 400,
                                    maxHeight: 800,
                                    backgroundColor: colors.card,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 20,
                                    padding: 18,
                                    position: "relative",
                                }}
                            >
                                {/* TODO: move this title element to a new UIModal.Title component */}
                                {typeof title === "string" && (
                                    <UIText size={20} bold style={{ paddingBottom: 20 }}>
                                        {title}
                                    </UIText>
                                )}
                                {children}
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </SafeAreaProvider>
        </Modal>
    );
}
