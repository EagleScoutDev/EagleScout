import { Modal, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import type { PropsWithChildren } from "react";
import { Pressable } from "react-native-gesture-handler";

export interface StandardModalProps extends PropsWithChildren {
    visible: boolean;
    title: string;
    onDismiss?: () => void;
}
export function UIModal({ visible, title, onDismiss, children }: StandardModalProps) {
    const { colors } = useTheme();

    return (
        <Modal transparent={true} animationType="fade" visible={visible} onDismiss={onDismiss}>
            <Pressable
                style={{ width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" }}
                accessible={false}
                onPress={() => onDismiss && onDismiss()}
            >
                <View
                    style={{
                        width: "85%",
                        maxWidth: 400,
                        maxHeight: 800,
                        backgroundColor: colors.card,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20,
                        padding: 24
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: colors.text,
                            fontWeight: "600",
                            paddingBottom: 20,
                        }}
                    >
                        {title}
                    </Text>
                    {children}
                </View>
            </Pressable>
        </Modal>
    );
}
