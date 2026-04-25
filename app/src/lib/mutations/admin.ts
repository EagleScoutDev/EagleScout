import { supabase } from "@/lib/supabase";
import { Competitions } from "@/lib/db/models/Competition";
import type { MutationOptions } from "@tanstack/query-core";

export interface ConfirmBetParams {
    matchId: number;
    result: "red" | "blue" | "tie";
}

export interface CreateCompetitionParams {
    name: string;
    startTime: Date;
    endTime: Date;
    tbaEventId: number;
    matchFormId: number;
    pitFormId: number;
}

export interface UpdateCompetitionParams {
    competitionId: number;
    name: string;
    startTime: Date;
    endTime: Date;
}

export interface DeleteCompetitionParams {
    competitionId: number;
}

export interface RequestDeletionParams {
    password: string;
    reason: string;
}

export const adminMutations = {
    confirmBet: {
        mutationKey: ["confirmBet"],
        async mutationFn({ matchId, result }: ConfirmBetParams) {
            const { data, error } = await supabase.functions.invoke(
                "confirm-bet",
                {
                    body: JSON.stringify({
                        matchId,
                        result,
                    }),
                },
            );
            if (error) throw error;

            return data;
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return Promise.all([
                client.invalidateQueries({ queryKey: ["bets"] }),
                client.invalidateQueries({ queryKey: ["matchBets"] }),
            ]);
        },
    },
    createCompetition: {
        mutationKey: ["createCompetition"],
        mutationFn: (comp: CreateCompetitionParams) =>
            Competitions.create(
                comp.name,
                comp.startTime,
                comp.endTime,
                comp.tbaEventId,
                comp.matchFormId,
                comp.pitFormId,
            ),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["competitions"] });
        },
    },
    updateCompetition: {
        mutationKey: ["updateCompetition"],
        mutationFn: (comp: UpdateCompetitionParams) =>
            Competitions.update(
                comp.competitionId,
                comp.name,
                comp.startTime,
                comp.endTime,
            ),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["competitions"] });
        },
    },
    deleteCompetition: {
        mutationKey: ["deleteCompetition"],
        mutationFn: Competitions.remove,
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["competitions"] });
        },
    },
    requestDeletion: {
        mutationKey: ["requestDeletion"],
        async mutationFn({ password, reason }: RequestDeletionParams) {
            // TODO: move to rpc function
            const { data: userData, error: getUserError } =
                await supabase.auth.getUser();
            if (getUserError) throw getUserError;

            const { error: signInError } =
                await supabase.auth.signInWithPassword({
                    email: userData.user.email!,
                    password,
                });

            if (signInError) {
                if ((signInError as any).status === 400) {
                    throw new Error("Invalid password");
                }
                throw signInError;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    requested_deletion: true,
                },
            });

            if (updateError) throw updateError;

            const { error: insertError } = await supabase
                .from("deletion_requests")
                .insert({
                    user_id: userData.user.id,
                    reason: reason || "No reason given",
                    processed: false,
                });

            if (insertError) throw insertError;
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
