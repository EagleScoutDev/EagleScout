import { supabase } from "@/lib/supabase";

export interface TBAMatch {
    id: number;
    team: string;
    match: number;
    predictedTime: Date;
    eventId: string;
    alliance: string;
    compLevel: string;
}

export class TBAMatches {
    static async getMatchesForCompetition(compId: string): Promise<TBAMatch[]> {
        const { data: compData, error: compError } = await supabase
            .from("competitions")
            .select("tba_event_id")
            .eq("id", compId)
            .single();
        if (compError) {
            throw compError;
        }
        const { data, error } = await supabase
            .from("tba_matches")
            .select("id, team, match, predicted_time, event_id, alliance, comp_level")
            .eq("event_id", compData.tba_event_id);
        if (error) {
            throw error;
        } else {
            const res: TBAMatch[] = [];
            for (let i = 0; i < data.length; i += 1) {
                res.push({
                    id: data[i].id,
                    team: data[i].team,
                    match: data[i].match,
                    predictedTime: data[i].predicted_time,
                    eventId: data[i].event_id,
                    alliance: data[i].alliance,
                    compLevel: data[i].comp_level,
                });
            }
            return res;
        }
    }
    
}
