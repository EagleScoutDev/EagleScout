import type { MutationOptions } from "@tanstack/query-core";
import { Betting } from "@/lib/db/models/Betting";

interface CreateMatchBetParams {
    userId: string;
    matchNumber: number;
    alliance: string;
    amount: number;
}

interface UpdateMatchBetParams {
    userId: string;
    matchNumber: number;
    amount: number;
}

export const matchBetMutations = {
    create: {
        mutationKey: ["createMatchBet"],
        mutationFn: ({
            userId,
            matchNumber,
            alliance,
            amount,
        }: CreateMatchBetParams) =>
            Betting.create(userId, matchNumber, alliance, amount),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["matchBets"] });
        },
    },
    update: {
        mutationKey: ["updateMatchBet"],
        mutationFn: ({ userId, matchNumber, amount }: UpdateMatchBetParams) =>
            Betting.update(userId, matchNumber, amount),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["matchBets"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
