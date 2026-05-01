import { View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { scoutcoinMutations } from "@/lib/mutations/scoutcoin";
import { type ShopItem } from "./ScoutcoinShop";
import * as Bs from "@/ui/icons";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";
import { PressableOpacity } from "@/components/PressableOpacity";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIModal } from "@/ui/components/UIModal";
import { UIText } from "@/ui/components/UIText";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";
import { queries } from "@/lib/queries";

export interface ConfirmPurchaseModalProps {
    item: ShopItem;
    onClose: (purchased: boolean) => void;
}
export function ConfirmPurchaseModal({ item, onClose }: ConfirmPurchaseModalProps) {
    const { colors } = useTheme();
    const { data: profile = null } = useQuery(queries.profiles.current);
    const { data: balance } = useQuery({
        ...queries.scoutcoinLedger.balanceForId({ id: profile! && profile.id }),
        enabled: !!profile,
    });
    const purchaseItem = useMutation(scoutcoinMutations.purchaseItem);

    function handlePurchase() {
        if (!profile) return;

        if (balance !== undefined && balance < item.cost) {
            AsyncAlert.alert("You do not have enough scoutcoins!");
            return;
        }

        handlePurchaseAsync();
    }

    async function handlePurchaseAsync() {
        try {
            await purchaseItem.mutateAsync({ itemName: item.id });
            onClose(true);
        } catch (error: any) {
            await AsyncAlert.alert(error.message || "Purchase failed");
            onClose(true);
        }
    }

    return (
        <UIModal visible onDismiss={() => onClose(false)} backdropPressBehavior={"dismiss"}>
            <PressableOpacity
                onPress={() => onClose(false)}
                style={{ position: "absolute", top: 16, right: 16 }}
            >
                <Bs.X size={32} fill={"gray"} />
            </PressableOpacity>

            <View style={{ alignItems: "center", marginBottom: 16, gap: 8 }}>
                <item.icon size={100} fill={colors.fg.hex} />
                <UIText size={28} bold>
                    {item.name}
                </UIText>
                <UIText size={16} style={{ textAlign: "center" }}>
                    {item.description}
                </UIText>
            </View>
            <View style={{ width: "100%" }}>
                <UIButton
                    size={UIButtonSize.xl}
                    style={UIButtonStyle.fill}
                    loading={purchaseItem.isPending}
                    onPress={handlePurchase}
                >
                    <UIText size={20} color={colors.primary.fg} style={{ marginRight: 16 }}>
                        Buy
                    </UIText>
                    <UIText size={20} color={colors.primary.fg} style={{ marginRight: 4 }}>
                        {item.cost}
                    </UIText>
                    <Bs.Coin size={20} fill={colors.primary.fg.hex} />
                </UIButton>
            </View>
        </UIModal>
    );
}
