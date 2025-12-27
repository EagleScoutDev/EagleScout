import { type FC, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ProfileEmojiModal } from "./items/ProfileEmojiModal";
import { ConfirmPurchaseModal } from "./ConfirmPurchaseModal";
import { AppThemeModal } from "./items/AppThemeModal";
import * as Bs from "@/ui/icons";
import { PressableOpacity } from "@/components/PressableOpacity";
import { UIText } from "@/ui/components/UIText";
import { useTheme } from "@/ui/context/ThemeContext";
import type { Theme } from "@/ui/lib/theme";

type ModalProps = {
    onClose: () => void;
};

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: Bs.Icon;
    modal: FC<ModalProps>;
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

export function ScoutcoinShop() {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [activeItem, setActiveItem] = useState<ShopItem | null>(null);
    const [confirmPurchaseModalVisible, setConfirmPurchaseModalVisible] = useState(false);
    const [itemSpecificModalVisible, setItemSpecificModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <UIText style={styles.heading}>Items</UIText>
            <View style={styles.itemsContainer}>
                {Object.entries(shopItems).map(([key, value]) => (
                    <PressableOpacity
                        key={key}
                        style={styles.itemContainer}
                        onPress={() => {
                            setActiveItem(value);
                            setConfirmPurchaseModalVisible(true);
                        }}
                    >
                        <value.icon size="50" fill={colors.fg.hex} />
                        <UIText style={styles.itemNameText}>{value.name}</UIText>
                        <View style={styles.coinContainer}>
                            <UIText style={styles.costText}>{value.cost}</UIText>
                            <Bs.Coin size="12" fill={colors.fg.hex} />
                        </View>
                    </PressableOpacity>
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
                        setActiveItem(null);
                    }}
                />
            )}
        </View>
    );
}

const makeStyles = (colors: Theme["colors"]) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        heading: {
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
            color: colors.fg.hex,
        },
        itemsContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
        },
        itemContainer: {
            flex: 1,
            minWidth: 100,
            maxWidth: 400,
            width: "25%",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border.hex,
            backgroundColor: colors.bg1.hex,
            display: "flex",
            alignItems: "center",
            gap: 5,
        },
        itemNameText: {
            fontSize: 14,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.fg.hex,
        },
        coinContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
        },
        costText: {
            color: colors.fg.hex,
        },
    });
