import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { supabase } from "../../../lib/supabase";
import { type ShopItem } from "./ScoutcoinShop";
import { Color } from "../../../lib/color";
import { useProfile } from "../../../lib/react/hooks/useProfile";
import * as Bs from "../../../ui/icons";
import { UIModal } from "../../../ui/UIModal.tsx";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton.tsx";
import { AsyncAlert } from "../../../lib/react/util/AsyncAlert.ts";
import { PressableOpacity } from "../../../ui/components/PressableOpacity.tsx";

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
            itemBody: JSON.stringify({
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

    const buyFg = Color.parse(colors.primary).fg.hex;

    return (
        <UIModal visible onDismiss={() => onClose(false)} backdropPressBehavior={"dismiss"}>
            <PressableOpacity onPress={() => onClose(false)} style={{ position: "absolute", top: 16, right: 16 }}>
                <Bs.X size={32} fill={"gray"} />
            </PressableOpacity>

            <View style={{ alignItems: "center", marginBottom: 16, gap: 8 }}>
                <item.icon size={100} fill={colors.text} />
                <Text style={{ color: colors.text, fontSize: 28, fontWeight: "bold" }}>{item.name}</Text>
                <Text style={{ color: colors.text, fontSize: 16, textAlign: "center" }}>{item.description}</Text>
            </View>
            <View style={{ width: "100%" }}>
                <UIButton size={UIButtonSize.xl} style={UIButtonStyle.fill} onPress={purchaseItem}>
                    <Text style={{ fontSize: 20, color: buyFg, marginRight: 16 }}>Buy</Text>
                    <Text style={{ fontSize: 20, color: buyFg, marginRight: 4 }}>{item.cost}</Text>
                    <Bs.Coin size={20} fill={buyFg} />
                </UIButton>
            </View>
        </UIModal>
    );
}
