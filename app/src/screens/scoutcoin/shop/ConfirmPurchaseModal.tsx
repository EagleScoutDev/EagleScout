import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMemo, useState } from "react";
import { useTheme, type Theme } from "@react-navigation/native";
import { supabase } from "../../../lib/supabase";
import { type ShopItem } from "./ScoutcoinShop";
import { getIdealTextColor, parseColor } from "../../../lib/color";
import { useProfile } from "../../../lib/hooks/useProfile";
import * as Bs from "../../../ui/icons";

export interface ConfirmPurchaseModalProps {
    item: ShopItem;
    onClose: (purchased: boolean) => void;
}
export const ConfirmPurchaseModal = ({ item, onClose }: ConfirmPurchaseModalProps) => {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const [purchasing, setPurchasing] = useState(false);
    const { profile } = useProfile();

    const purchaseItem = async () => {
        if (!profile) {
            return;
        }
        setPurchasing(true);
        if (profile.scoutcoins < item.cost) {
            Alert.alert("You do not have enough scoutcoins!");
            setPurchasing(false);
            return;
        }
        const { data } = await supabase.functions.invoke("purchase-item", {
            body: JSON.stringify({
                itemName: item.id,
            }),
        });
        if (data !== "Success") {
            Alert.alert(data);
            onClose(false);
        }
        setPurchasing(false);
        onClose(true);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={true} onRequestClose={() => onClose(false)}>
            <View style={styles.mask} />
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => onClose(false)} style={styles.xClose}>
                        <Bs.XCircle size={30} fill={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.itemInfoContainer}>
                        <item.icon size={100} fill={theme.colors.text} />
                        <Text style={styles.itemNameText}>{item.name}</Text>
                        <Text style={styles.itemDescriptionText}>{item.description}</Text>
                    </View>
                    <TouchableOpacity
                        style={purchasing ? styles.purchaseButtonActive : styles.purchaseButton}
                        onPress={purchaseItem}
                    >
                        {purchasing && <ActivityIndicator color={theme.colors.text} />}
                        <Text style={styles.purchaseButtonText}>Confirm Purchase</Text>
                        <View style={styles.coinContainer}>
                            <Text style={styles.purchaseButtonText}>{item.cost}</Text>
                            <Bs.Coin size={24} fill={getIdealTextColor(parseColor(theme.colors.primary))} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        centeredView: {
            margin: 20,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
        },
        modalView: {
            margin: 20,
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            width: "100%",
        },
        itemInfoContainer: {
            alignItems: "center",
            gap: 16,
            padding: 16,
        },
        itemNameText: {
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.text,
        },
        itemDescriptionText: {
            fontSize: 16,
            textAlign: "center",
            color: colors.text,
        },
        coinContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
        },
        mask: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        xClose: {
            position: "absolute",
            right: 10,
            top: 10,
            padding: 10,
        },
        purchaseButton: {
            backgroundColor: colors.primary,
            padding: 10,
            margin: 10,
            borderRadius: 10,
            width: "100%",
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
        },
        purchaseButtonActive: {
            padding: 10,
            margin: 10,
            borderRadius: 10,
            width: "100%",
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
            backgroundColor: "gray",
        },
        purchaseButtonText: {
            fontSize: 20,
            textAlign: "center",
            color: getIdealTextColor(parseColor(colors.primary)),
            fontWeight: "600",
            paddingRight: 2,
        },
    });
