import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { ReefscapeActionType } from "./ReefscapeActions";

export const ReefscapeLevels = ({ onSubmit }: { onSubmit: (level: ReefscapeActionType) => void }) => {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        select_container: {
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            width: "100%",
        },
        level_container: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "90%",
            gap: 20,
        },
        level_button: {
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            padding: 8,
            paddingVertical: "9%",
            width: "90%",
        },
        level_text: {
            color: colors.text,
            fontSize: 20,
        },
    });

    const LevelButton = ({
        level,
        onPress,
        text,
    }: {
        level: ReefscapeActionType;
        onPress: (level: number) => void;
        text: string;
    }) => {
        return (
            <TouchableOpacity
                style={styles.level_button}
                onPress={() => {
                    onPress(level);
                    ReactNativeHapticFeedback.trigger("impactLight");
                }}
            >
                <Text style={styles.level_text}>{text}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.select_container}>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold" }}>Select Scoring Position</Text>
            <View style={styles.level_container}>
                <LevelButton text={"Level 4"} onPress={onSubmit} level={ReefscapeActionType.ScoreCoralL4} />
                <LevelButton text={"Level 3"} onPress={onSubmit} level={ReefscapeActionType.ScoreCoralL3} />
                <LevelButton text={"Level 2"} onPress={onSubmit} level={ReefscapeActionType.ScoreCoralL2} />
                <LevelButton text={"Level 1"} onPress={onSubmit} level={ReefscapeActionType.ScoreCoralL1} />
                <LevelButton text={"Dropped"} onPress={onSubmit} level={ReefscapeActionType.MissCoral} />
            </View>
        </View>
    );
};
