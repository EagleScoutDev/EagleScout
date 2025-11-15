import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import { useProfile } from "../../../../lib/hooks/useProfile";
import { type Theme, useTheme } from "@react-navigation/native";
import { supabase } from "../../../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UIModal } from "../../../../ui/UIModal";

export interface ProfileEmojiModalProps {
    onClose: () => void;
}
export function ProfileEmojiModal({ onClose }: ProfileEmojiModalProps) {
    "use memo";
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const { profile } = useProfile();
    const [emojiModalVisible, setEmojiModalVisible] = useState(false);

    if (!profile) {
        return null;
    }

    return (
        <UIModal visible onClose={onClose} backdropPressBehavior={"none"} title={"Select New Emoji"}>
            <TouchableOpacity style={styles.emojiContainer} onPress={() => setEmojiModalVisible(true)}>
                <Text style={styles.emoji}>{profile?.emoji}</Text>
            </TouchableOpacity>
            <EmojiPicker
                onEmojiSelected={async (e) => {
                    onClose();
                    const { error } = await supabase.from("profiles").update({ emoji: e.emoji }).eq("id", profile?.id);
                    if (error) {
                        console.error(error);
                        Alert.alert("Error updating your profile");
                    }
                    const currentUserObj = JSON.parse((await AsyncStorage.getItem("user")) as string);
                    await AsyncStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...currentUserObj,
                            emoji: e.emoji,
                        })
                    );
                    Alert.alert(`Emoji updated to ${e.emoji}`);
                }}
                open={emojiModalVisible}
                onClose={() => setEmojiModalVisible(false)}
            />
        </UIModal>
    );
}

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        title: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
            color: colors.text,
        },
        emojiContainer: {
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            borderRadius: 10,
            backgroundColor: colors.primary,
        },
        emoji: {
            fontSize: 60,
        },
    });
