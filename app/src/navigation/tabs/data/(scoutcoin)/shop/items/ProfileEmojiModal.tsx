import { useMemo, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { profileMutations } from "@/lib/mutations/profiles";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIModal } from "@/ui/components/UIModal";
import { UIText } from "@/ui/components/UIText";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";
import type { Theme } from "@/ui/lib/theme";
import { queries } from "@/lib/queries";

export interface ProfileEmojiModalProps {
    onClose: () => void;
}

export function ProfileEmojiModal({ onClose }: ProfileEmojiModalProps) {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const { data: profile = null } = useQuery(queries.profiles.current);
    const [emojiModalVisible, setEmojiModalVisible] = useState(false);
    const updateEmoji = useMutation(profileMutations.updateEmoji);

    if (!profile) {
        return null;
    }

    const handleEmojiSelect = async (e: any) => {
        onClose();
        try {
            await updateEmoji.mutateAsync({ emoji: e.emoji });
            await AsyncAlert.alert(`Emoji updated to ${e.emoji}`);
        } catch (error) {
            Alert.alert("Error updating your profile");
        }
    };

    return (
        <UIModal
            visible
            onDismiss={onClose}
            backdropPressBehavior={"none"}
            title={"Select New Emoji"}
        >
            <TouchableOpacity
                style={styles.emojiContainer}
                onPress={() => setEmojiModalVisible(true)}
            >
                <UIText style={styles.emoji}>{profile?.emoji}</UIText>
            </TouchableOpacity>
            <EmojiPicker
                onEmojiSelected={handleEmojiSelect}
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
            color: colors.fg.hex
        },
        emojiContainer: {
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            borderRadius: 10,
            backgroundColor: colors.primary.hex
        },
        emoji: {
            fontSize: 60
        }
    });
