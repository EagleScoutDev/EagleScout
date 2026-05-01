import { Scoutcoin } from "@/lib/db/models/Scoutcoin";
import type { MutationOptions } from "@tanstack/query-core";

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
        mutationFn: ({ recipientId, amount, reason }: SendScoutcoinParams) =>
            Scoutcoin.send(recipientId, amount, reason),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["profile"] });
        },
    },
    purchaseItem: {
        mutationKey: ["purchaseScoutcoinItem"],
        mutationFn: ({ itemName }: PurchaseItemParams) =>
            Scoutcoin.purchaseItem(itemName),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["profile"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
