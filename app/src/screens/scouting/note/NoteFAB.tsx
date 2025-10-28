import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as Bs from "../../../ui/icons";

export const NoteFAB = ({
    onSubmitPress,
    isLoading,
    contentPresent,
}: {
    onSubmitPress: () => void;
    isLoading: boolean;
    // do any of the notes have content?
    contentPresent: boolean;
}) => {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        fab: {
            // position: 'absolute',
            // bottom: insets.bottom + 20,
            right: 20,
            alignSelf: "flex-end",
        },
        fabButton: {
            backgroundColor: contentPresent ? colors.primary : colors.notification,
            padding: 20,
            borderRadius: 99,
            elevation: 2,
        },
        fabButtonLoading: {
            backgroundColor: "gray",
            padding: 20,
            borderRadius: 99,
            elevation: 2,
        },
    });
    return (
        <View style={styles.fab}>
            <TouchableOpacity
                style={isLoading ? styles.fabButtonLoading : styles.fabButton}
                onPress={onSubmitPress}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <>{contentPresent ? <Bs.CloudUpload size="24" fill="white" /> : <Bs.X size="24" fill="white" />}</>
                )}
            </TouchableOpacity>
        </View>
    );
};
