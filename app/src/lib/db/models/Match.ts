import { supabase } from "@/lib/supabase";

export namespace Matches {
    export async function getIdForNumber(
        matchNumber: number,
        compId: number,
    ): Promise<number | null> {
        const { data, error } = await supabase
            .from("matches")
            .select("id, number, competition_id")
            .eq("number", matchNumber)
            .eq("competition_id", compId)
            .maybeSingle();
        if (error) throw error;

        return data?.id ?? null;
    }

    // FIXME: impure queries are below

    export async function create(
        matchNumber: number,
        compId: number,
    ): Promise<number> {
        const { data, error } = await supabase
            .from("matches")
            .insert({
                number: matchNumber,
                competition_id: compId,
            })
            .select("id")
            .single();
        if (error) throw error;

        return data.id;
    }

    export async function ensureForNumber(
        matchNumber: number,
        compId: number,
    ): Promise<number> {
        return (
            (await Matches.getIdForNumber(matchNumber, compId)) ??
            (await Matches.create(matchNumber, compId))
        );
    }
}
