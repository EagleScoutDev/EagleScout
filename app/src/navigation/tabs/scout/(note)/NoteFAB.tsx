import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Bs from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";

export interface NoteFABProps {
    onSubmitPress: () => void;
    isLoading: boolean;
    // do any of the notes have content?
    contentPresent: boolean;
}
export function NoteFAB({ onSubmitPress, isLoading, contentPresent }: NoteFABProps) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        fab: {
            // position: 'absolute',
            // bottom: insets.bottom + 20,
            right: 20,
            alignSelf: "flex-end",
        },
        fabButton: {
            backgroundColor: contentPresent ? colors.primary.hex : colors.danger.hex,
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
}
