import { useState } from "react";
import { Alert, Modal, StyleSheet, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/hooks/useProfile";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { StandardButton } from "@/ui/StandardButton";
import * as Bs from "@/ui/icons";

interface LeaderboardUser {
    id: string;
    name: string;
    scoutcoins: number;
}

export function SendScoutcoinModal({
    targetUser,
    onClose,
}: {
    targetUser: LeaderboardUser;
    onClose: () => void;
}) {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [sending, setSending] = useState(false);
    const { profile } = useProfile();
    const { colors } = useTheme();

    const sendScoutcoin = async () => {
        if (!profile) {
            return;
        }
        setSending(true);
        if (description === "") {
            Alert.alert("Please enter a reason!");
            setSending(false);
            return;
        }
        if (amount === "") {
            Alert.alert("Please enter an amount!");
            setSending(false);
            return;
        }
        if (parseInt(amount, 10) <= 0) {
            Alert.alert("Please enter a positive amount!");
            setSending(false);
            return;
        }
        if (parseInt(amount, 10) > profile.scoutcoins) {
            Alert.alert("You do not have enough scoutcoins!");
            setSending(false);
            return;
        }
        await supabase.functions.invoke("send-scoutcoin", {
            body: JSON.stringify({
                targetUserId: targetUser.id,
                amount: parseInt(amount, 10),
                description,
            }),
        });
        setSending(false);
        onClose();
    };

    const styles = StyleSheet.create({
        centeredView: {
            margin: 20,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
        },
        modalView: {
            margin: 20,
            backgroundColor: colors.bg1.hex,
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            width: "100%",
        },
        coinContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: colors.fg.hex,
        },
        input: {
            width: "100%",
            margin: 12,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.fg.hex,
            padding: 10,
            color: colors.fg.hex,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
        },
        mask: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        text: {
            color: colors.fg.hex,
        },
    });
    console.log(profile);

    return (
        <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
            <View style={styles.mask} />
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <UIText style={styles.modalText}>Send Scoutcoin to {targetUser.name}</UIText>
                    <View style={styles.coinContainer}>
                        <UIText style={styles.text}>Your Scoutcoin: {profile?.scoutcoins}</UIText>
                        <Bs.Coin size="12" fill={colors.fg.hex} />
                    </View>
                    <TextInput
                        style={styles.input}
                        selectionColor={colors.fg.hex}
                        cursorColor={colors.fg.hex}
                        placeholderTextColor={colors.fg.hex}
                        placeholder="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="number-pad"
                    />
                    <TextInput
                        style={styles.input}
                        selectionColor={colors.fg.hex}
                        cursorColor={colors.fg.hex}
                        placeholderTextColor={colors.fg.hex}
                        placeholder="Reason"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <View style={styles.buttonContainer}>
                        <StandardButton
                            width="40%"
                            text="Cancel"
                            onPress={onClose}
                            disabled={sending}
                            color={colors.danger.hex}
                        />
                        <StandardButton
                            width="50%"
                            text="Send"
                            onPress={sendScoutcoin}
                            disabled={sending}
                            color={colors.primary.hex}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
