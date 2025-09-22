import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProfileEmojiModal } from "./shop-items/ProfileEmojiModal";
import { useTheme, type Theme } from "@react-navigation/native";
import { ConfirmPurchaseModal } from "./ConfirmPurchaseModal";
import { AppThemeModal } from "./shop-items/AppThemeModal";
import * as Bs from "../../components/icons/icons.generated";

type ModalProps = {
    onClose: () => void;
};

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: Bs.Icon;
    modal: React.FC<ModalProps>;
}

const shopItems = {
    "emoji-change": {
        id: "emoji-change",
        name: "Profile Emoji",
        description: "Change your profile emoji!",
        cost: 5,
        icon: Bs.PersonBadge,
        modal: ({ onClose }: ModalProps) => <ProfileEmojiModal onClose={onClose} />,
    },
    "theme-change": {
        id: "theme-change",
        name: "App Theme",
        description: "Change the app theme! Who doesn't like a nice forest color?",
        cost: 8,
        icon: Bs.PaintBucket,
        modal: ({ onClose }: ModalProps) => <AppThemeModal onClose={onClose} />,
    },
} as Record<string, ShopItem>;

export const ScoutcoinShop = () => {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const [activeItem, setActiveItem] = useState<ShopItem | null>(null);
    const [confirmPurchaseModalVisible, setConfirmPurchaseModalVisible] = useState(false);
    const [itemSpecificModalVisible, setItemSpecificModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Items</Text>
            <View style={styles.itemsContainer}>
                {Object.entries(shopItems).map(([key, value]) => (
                    <TouchableOpacity
                        key={key}
                        style={styles.itemContainer}
                        onPress={() => {
                            setActiveItem(value);
                            setConfirmPurchaseModalVisible(true);
                        }}
                    >
                        <value.icon size="50" fill={theme.colors.text} />
                        <Text style={styles.itemNameText}>{value.name}</Text>
                        <View style={styles.coinContainer}>
                            <Text style={styles.costText}>{value.cost}</Text>
                            <Bs.Coin size="12" fill={theme.colors.text} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            {confirmPurchaseModalVisible && activeItem && (
                <ConfirmPurchaseModal
                    item={activeItem}
                    onClose={(purchased) => {
                        setConfirmPurchaseModalVisible(false);
                        if (purchased) {
                            setItemSpecificModalVisible(true);
                        } else {
                            setActiveItem(null);
                        }
                    }}
                />
            )}
            {itemSpecificModalVisible && activeItem && (
                <activeItem.modal
                    onClose={() => {
                        setItemSpecificModalVisible(false);
                    }}
                />
            )}
        </View>
    );
};

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
        },
        heading: {
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
            color: colors.text,
        },
        itemsContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
        },
        itemContainer: {
            width: "30%",
            marginBottom: 10,
            padding: 10,
            borderRadius: 10,
            backgroundColor: colors.card,
            display: "flex",
            alignItems: "center",
            gap: 5,
            paddingVertical: 20,
        },
        itemNameText: {
            fontSize: 14,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.text,
        },
        coinContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
        },
        costText: {
            color: colors.text,
        },
    });
