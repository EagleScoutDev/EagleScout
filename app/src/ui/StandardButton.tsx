import { ActivityIndicator, type DimensionValue, StyleSheet, Text, TouchableOpacity } from "react-native";

export interface StandardButtonProps {
    textColor?: string;
    color?: string;
    onPress: () => void;
    width?: DimensionValue | undefined;
    text: string;
    isLoading?: boolean;
    disabled?: boolean;
}
export function StandardButton({
    textColor = "white",
    color = "",
    onPress,
    width = "80%",
    text,
    isLoading = false,
    disabled = false,
}: StandardButtonProps) {
    "use memo";
    const baseButtonStyle = {
        backgroundColor: color,
        padding: 10,
        margin: 10,
        borderRadius: 10,
        width,
        alignSelf: "center",
    } as const;
    const styles = StyleSheet.create({
        button: baseButtonStyle,
        button_loading: {
            ...baseButtonStyle,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            backgroundColor: "gray",
        },
        button_text: {
            fontSize: 20,
            textAlign: "center",
            color: textColor,
            fontWeight: "600",
        },
    });
    return (
        <TouchableOpacity
            style={isLoading ? styles.button_loading : styles.button}
            onPress={onPress}
            disabled={isLoading || disabled}
        >
            {isLoading && <ActivityIndicator size="small" color="#ffffff" />}
            <Text style={styles.button_text}>{text}</Text>
        </TouchableOpacity>
    );
}
