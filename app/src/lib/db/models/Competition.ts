import type { FormReturnData } from "@/lib/db/models/Form";
import { supabase } from "@/lib/supabase";

interface Competition {
    name: string;
    startTime: Date;
    endTime: Date;
    tbaKey: string;
    formId: number;
    pitScoutFormId: number;
}

export interface CompetitionReturnData extends Competition {
    id: number;
    matchForm: FormReturnData;
    pitForm: FormReturnData;
}

export namespace Competitions {
    const query = () =>
        supabase.from("competitions").select(`
            id,
            name,
            startTime:      start_time,
            endTime:        end_time,
            ...tba_events(
                tbaKey:     event_key
            ),
            formId:         form_id,
            pitScoutFormId: pit_scout_form_id,
            matchForm:      forms!competitions_form_id_fkey(
                id,
                formStructure:  form_structure,
                pitScouting:    pit_scouting
            ),
            pitForm:        forms!competitions_pit_scout_form_id_fkey(
                id,
                formStructure:  form_structure,
                pitScouting:    pit_scouting
            )
        `);

    export async function get(id: number): Promise<CompetitionReturnData> {
        const { data, error } = await query().eq("id", id).single();
        if (error) throw error;

        return {
            ...data,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
        };
    }

    export async function getAll(): Promise<CompetitionReturnData[]> {
        const { data, error } = await query();
        if (error) throw error;

        return data.map((row) => ({
            ...row,
            startTime: new Date(row.startTime),
            endTime: new Date(row.endTime),
        }));
    }

    export async function getTeams(compId: number): Promise<number[]> {
        const { data, error } = await supabase
            .from("competitions")
            .select("tba_events ( teams )")
            .eq("id", compId)
            .single();
        if (error) throw error;

        return data.tba_events.teams;
    }

    export async function getTBAKey(compId: number): Promise<string> {
        const { data, error } = await supabase
            .from("competitions")
            .select("tba_events ( event_key )")
            .eq("id", compId)
            .single();
        if (error) throw error;

        return data.tba_events.event_key;
    }

    export async function getCurrent(): Promise<CompetitionReturnData | null> {
        const now = new Date().toISOString();
        const { data, error } = await query()
            .lte("start_time", now)
            .gte("end_time", now)
            .maybeSingle();
        if (error) throw error;

        if (data === null) return null;
        return {
            ...data,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
        };
    }

    // FIXME: impure queries are below

    export async function create(
        name: string,
        startTime: Date,
        endTime: Date,
        tbaEventId: number,
        matchFormId: number,
        pitFormId: number,
    ): Promise<void> {
        const { error } = await supabase.from("competitions").insert({
            name: name,
            start_time: startTime,
            end_time: endTime,
            tba_event_id: tbaEventId,
            form_id: matchFormId,
            pit_scout_form_id: pitFormId,
        });
        if (error) throw error;
    }

    export async function update(
        competitionId: number,
        name: string,
        startTime: Date,
        endTime: Date,
    ): Promise<void> {
        const { error } = await supabase
            .from("competitions")
            .update({
                name: name,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString()
            })
            .eq("id", competitionId);
        if (error) throw error;
    }

    export async function remove(competitionId: number): Promise<void> {
        const { error } = await supabase.from("competitions").delete().eq("id", competitionId);
        if (error) throw error;
    }
}
