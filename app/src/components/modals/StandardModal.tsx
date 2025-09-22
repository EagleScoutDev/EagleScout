import { Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { useTheme } from "@react-navigation/native";

export function StandardModal({ visible, title, onDismiss, children }) {
    const { colors } = useTheme();

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            {/* https://stackoverflow.com/questions/38311562/how-to-dismiss-modal-by-tapping-screen-in-reactnative */}
            <TouchableWithoutFeedback
                onPress={() => {
                    if (onDismiss) {
                        onDismiss();
                    }
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        padding: 20,
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View
                            style={{
                                width: "100%",
                                backgroundColor: colors.card,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 20,
                                borderColor: colors.border,
                                borderWidth: 1,
                                padding: 35,
                                elevation: 5,
                                maxHeight: "90%",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 30,
                                    color: colors.text,
                                    fontWeight: "600",
                                    paddingBottom: 20,
                                }}
                            >
                                {title}
                            </Text>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
