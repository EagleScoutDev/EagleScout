import { supabase } from "@/lib/supabase";
import type { MutationOptions } from "@tanstack/react-query";

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
            const { data, error } = await supabase.functions.invoke("confirm-bet", {
                body: JSON.stringify({
                    matchId,
                    result,
                }),
            });

            if (error) throw error;
            return data;
        },
        async onSuccess(_data, _variables, _onMutateResult, { client }) {
            await Promise.all([
                client.invalidateQueries({ queryKey: ["bets"] }),
                client.invalidateQueries({ queryKey: ["matchBets"] }),
            ]);
        },
    },
    createCompetition: {
        mutationKey: ["createCompetition"],
        async mutationFn({ name, startTime, endTime, tbaEventId, matchFormId, pitFormId }: CreateCompetitionParams) {
            const { error } = await supabase
                .from("competitions")
                .insert({
                    name,
                    start_time: startTime,
                    end_time: endTime,
                    tba_event_id: tbaEventId,
                    form_id: matchFormId,
                    pit_scout_form_id: pitFormId,
                });

            if (error) throw error;
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["competitions"] });
        },
    },
    updateCompetition: {
        mutationKey: ["updateCompetition"],
        async mutationFn({
            competitionId,
            name,
            startTime,
            endTime,
        }: UpdateCompetitionParams) {
            const { error } = await supabase
                .from("competitions")
                .update({
                    name,
                    start_time: startTime,
                    end_time: endTime,
                })
                .eq("id", competitionId);

            if (error) throw error;
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["competitions"] });
        },
    },
    deleteCompetition: {
        mutationKey: ["deleteCompetition"],
        async mutationFn({ competitionId }: DeleteCompetitionParams) {
            const { error } = await supabase
                .from("competitions")
                .delete()
                .eq("id", competitionId);

            if (error) throw error;
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["competitions"] });
        },
    },
    requestDeletion: {
        mutationKey: ["requestDeletion"],
        async mutationFn({ password, reason }: RequestDeletionParams) {
            const { data: userData, error: getUserError } = await supabase.auth.getUser();
            if (getUserError) throw getUserError;
            if (!userData.user) throw new Error("No user logged in");

            const { error: signInError } = await supabase.auth.signInWithPassword({
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

            const { error: insertError } = await supabase.from("deletion_requests").insert({
                user_id: userData.user.id,
                reason: reason || "No reason given",
                processed: false,
            });

            if (insertError) throw insertError;
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
