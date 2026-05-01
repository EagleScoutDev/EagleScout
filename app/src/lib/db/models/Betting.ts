import { supabase } from "@/lib/supabase";
import { Competitions } from "@/lib/db/models/Competition";
import { Matches } from "@/lib/db/models/Match";
import type { UserStub } from "@/lib/db/models/User";
import { Scoutcoin } from "@/lib/db/models/Scoutcoin";

export interface MatchBetReturnData {
    id: number;
    matchId: number;
    matchNumber: number;
    alliance: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: UserStub;
}

export namespace Betting {
    const betQuery = () =>
        supabase.from("match_bets").select(`
            id,
            ...matches(
                matchId:        id,
                matchNumber:    number
            ),
            alliance,
            amount,
            createdAt:  created_at,
            updatedAt:  updated_at,
            createdBy:  profiles!inner(
                id,
                name,
                emoji
            )
        `);

    export async function getMatchBets(): Promise<MatchBetReturnData[]> {
        const { data, error } = await betQuery();
        if (error) throw error;

        return data.map((bet) => ({
            ...bet,
            createdAt: new Date(bet.createdAt),
            updatedAt: new Date(bet.updatedAt),
        }));
    }

    export async function getMatchBetsForMatch(matchNumber: number): Promise<MatchBetReturnData[]> {
        const activeComp = await Competitions.getCurrent();
        if (activeComp === null) return [];

        const matchId = await Matches.getIdForNumber(matchNumber, activeComp.id);
        if (matchId === null) return [];

        const { data, error } = await betQuery().eq("matchId", matchId);
        if (error) throw error;

        return data.map((bet) => ({
            ...bet,
            createdAt: new Date(bet.createdAt),
            updatedAt: new Date(bet.updatedAt),
        }));
    }

    export async function isMatchOver(matchNumber: number): Promise<boolean> {
        const activeComp = await Competitions.getCurrent();
        if (activeComp === null) throw new Error("No active competition");

        const matchId = await Matches.getIdForNumber(matchNumber, activeComp.id);
        if (matchId === null) throw new Error("Match not found");

        const { data, error } = await supabase
            .from("match_bets_results")
            .select("id")
            .eq("match_id", matchId);
        if (error) throw error;

        return data.length > 0;
    }

    // FIXME: impure queries are below

    export async function create(
        userId: string,
        matchNumber: number,
        alliance: string,
        amount: number,
    ): Promise<number> {
        const activeComp = await Competitions.getCurrent();
        if (activeComp === null) throw new Error("No active competition");
        const matchId = await Matches.ensureForNumber(matchNumber, activeComp.id);

        const { data, error } = await supabase
            .from("match_bets")
            .insert({
                user_id: userId,
                match_id: matchId,
                alliance,
                amount,
            })
            .select("id")
            .single();
        if (error) throw error;

        const balance = await Scoutcoin.getBalance(userId);
        const updateError = (
            await supabase
                .from("profiles")
                .update({
                    scoutcoins: balance - amount,
                })
                .eq("id", userId)
        ).error;
        if (updateError) throw updateError;

        return data.id;
    }

    export async function update(
        userId: string,
        matchNumber: number,
        amount: number,
    ): Promise<void> {
        const activeComp = await Competitions.getCurrent();
        if (activeComp === null) throw new Error("No active competition");
        const matchId = await Matches.getIdForNumber(matchNumber, activeComp.id);
        if (matchId === null) throw new Error("Match not found");

        const { error } = await supabase
            .from("match_bets")
            .update({
                amount,
            })
            .eq("user_id", userId)
            .eq("match_id", matchId);

        const balance = await Scoutcoin.getBalance(userId);
        const updateError = (
            await supabase
                .from("profiles")
                .update({
                    scoutcoins: balance - amount,
                })
                .eq("id", userId)
        ).error;
        if (error) throw error;
        if (updateError) throw updateError;
    }
}
