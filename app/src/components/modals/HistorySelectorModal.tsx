import { UIModal } from "../../ui/UIModal";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";

/**
 * Modal that allows the user to select a form history to view
 * @param formHistory - the history of the form from the db
 * @param selectedHistoryId - the id of the selected history
 * @param visible - whether the modal is visible
 * @param setVisible - function to set the visibility of the modal
 * @param onHistorySelect - function to call when a history is selected
 * @returns {JSX.Element} - the modal
 */
export function HistorySelectorModal({ formHistory, selectedHistoryId, visible, setVisible, onHistorySelect }) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        report_info: {
            textAlign: "center",
            color: colors.text,
        },
    });
    return (
        <UIModal
            title="Form History"
            visible={visible}
            onDismiss={() => {
                setVisible(false);
                onHistorySelect(null);
            }}
        >
            <View
                style={{
                    gap: 10,
                    width: "100%",
                }}
            >
                {formHistory &&
                    formHistory.length &&
                    formHistory.map((history) => (
                        <TouchableOpacity
                            key={history.historyId}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                            onPress={() => {
                                if (selectedHistoryId === history.historyId) {
                                    onHistorySelect(null);
                                    return;
                                }
                                onHistorySelect(history.historyId);
                            }}
                        >
                            <Text
                                style={[
                                    styles.report_info,
                                    {
                                        ...(selectedHistoryId === history.historyId && {
                                            fontWeight: "bold",
                                            color: colors.primary,
                                        }),
                                    },
                                ]}
                            >
                                {history.historyId === formHistory[0].historyId
                                    ? "Current"
                                    : new Date(history.editedAt).toLocaleString()}
                            </Text>
                            <Text style={styles.report_info}>{history.name}</Text>
                        </TouchableOpacity>
                    ))}
            </View>
        </UIModal>
    );
}
