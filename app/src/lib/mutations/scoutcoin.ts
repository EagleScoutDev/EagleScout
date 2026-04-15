import { supabase } from "@/lib/supabase";
import type { MutationOptions } from "@tanstack/react-query";

export interface SendScoutcoinParams {
    recipientId: string;
    amount: number;
    reason: string;
}

export interface PurchaseItemParams {
    itemName: string;
}

export const scoutcoinMutations = {
    send: {
        mutationKey: ["sendScoutcoin"],
        async mutationFn({ recipientId, amount, reason }: SendScoutcoinParams) {
            const { data, error } = await supabase.functions.invoke("send-scoutcoin", {
                body: JSON.stringify({
                    recipientId,
                    amount,
                    reason,
                }),
            });

            if (error) throw error;
            return data;
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["profile"] });
        },
    },
    purchaseItem: {
        mutationKey: ["purchaseScoutcoinItem"],
        async mutationFn({ itemName }: PurchaseItemParams) {
            const { data, error } = await supabase.functions.invoke("purchase-item", {
                body: JSON.stringify({
                    itemName,
                }),
            });

            if (error) throw error;
            if (data !== "Success") throw new Error(data);
            return data;
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["profile"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
