import { View } from "react-native";
import { UIText } from "../../../ui/UIText";
import { useTheme } from "@react-navigation/native";
import { supabase } from "../../../lib/supabase";
import { type ShopItem } from "./ScoutcoinShop";
import { Color } from "../../../lib/color";
import { useProfile } from "../../../lib/hooks/useProfile";
import * as Bs from "../../../ui/icons";
import { UIModal } from "../../../ui/UIModal";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton";
import { AsyncAlert } from "../../../lib/util/react/AsyncAlert";
import { PressableOpacity } from "../../../ui/components/PressableOpacity";

export interface ConfirmPurchaseModalProps {
    item: ShopItem;
    onClose: (purchased: boolean) => void;
}
export function ConfirmPurchaseModal({ item, onClose }: ConfirmPurchaseModalProps) {
    "use memo";
    const { colors } = useTheme();
    const { profile } = useProfile();

    async function purchaseItem() {
        if (!profile) return;

        if (profile.scoutcoins < item.cost) {
            await AsyncAlert.alert("You do not have enough scoutcoins!");
            return;
        }

        const { data } = await supabase.functions.invoke("purchase-item", {
            body: JSON.stringify({
                itemName: item.id,
            }),
        });
        console.log(data);
        if (data !== "Success") {
            await AsyncAlert.alert(data);
            onClose(true);
        }
        onClose(true);
    }

    const buyFg = Color.parse(colors.primary).fg;

    return (
        <UIModal visible onDismiss={() => onClose(false)} backdropPressBehavior={"dismiss"}>
            <PressableOpacity onPress={() => onClose(false)} style={{ position: "absolute", top: 16, right: 16 }}>
                <Bs.X size={32} fill={"gray"} />
            </PressableOpacity>

            <View style={{ alignItems: "center", marginBottom: 16, gap: 8 }}>
                <item.icon size={100} fill={colors.text} />
                <UIText size={28} bold>
                    {item.name}
                </UIText>
                <UIText size={16} style={{ textAlign: "center" }}>
                    {item.description}
                </UIText>
            </View>
            <View style={{ width: "100%" }}>
                <UIButton size={UIButtonSize.xl} style={UIButtonStyle.fill} onPress={purchaseItem}>
                    <UIText size={20} color={buyFg} style={{ marginRight: 16 }}>
                        Buy
                    </UIText>
                    <UIText size={20} color={buyFg} style={{ marginRight: 4 }}>
                        {item.cost}
                    </UIText>
                    <Bs.Coin size={20} fill={buyFg.hex} />
                </UIButton>
            </View>
        </UIModal>
    );
}
