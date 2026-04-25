import { supabase } from "@/lib/supabase";
import type { components } from "./schema.generated";

export type TBAEvent = { rank: number | null } & components["schemas"]["Event_Simple"];
export type TBATeam = components["schemas"]["Team_Simple"];

export interface FRCTeam {
    number: number;
    name: string;
}

export interface TBAMatch {
    id: number;
    team: string;
    match: number;
    predictedTime: Date;
    eventId: string;
    alliance: string;
    compLevel: string;
}

export namespace TBA {
    export async function checkEventKey(key: string): Promise<boolean> {
        const { error } = await supabase.functions.invoke("fetch-tba-event", {
            body: { tbakey: key },
        });
        return !error;
    }

    export async function getEventsForYear(year: number): Promise<TBAEvent[]> {
        const { data, error } = await supabase.functions.invoke("tba-api", {
            body: { endpoint: `/events/${year}/simple` },
        });
        if (error) throw error;

        return data;
    }

    export async function getTeamsAtCompetition(comp_id: string): Promise<TBATeam[]> {
        const { data, error } = await supabase.functions.invoke("tba-api", {
            body: { endpoint: `/event/${comp_id}/teams/simple` },
        });
        if (error) throw error;

        return data;
    }

    /**
     * Returns the rank of the team at the competition
     * @param comp_id the competition id
     * @param team_number the team number
     * @returns the rank of the team at the competition, or -1 if the competition has not taken place yet, or -2 if the team is not ranked
     */
    export async function getTeamRank(comp_id: string, team_number: number): Promise<number> {
        const { data, error } = await supabase.functions.invoke("tba-api", {
            body: {
                endpoint: `/team/frc${team_number}/event/${comp_id}/status`,
            },
        });
        if (error) throw error;

        // this means that the competition has not taken place yet
        if (data === null) {
            return -1;
        }

        // if the qualification ranking is null, then the team is not ranked
        if (data.qual == null) {
            return -2;
        }

        return data.qual.ranking.rank;
    }

    export async function getCurrentCompetitionForTeam(team_number: number): Promise<TBAEvent> {
        const current_year = new Date().getFullYear();
        const { data, error } = await supabase.functions.invoke("tba-api", {
            body: { endpoint: `/team/frc${team_number}/events/${current_year}/simple` },
        });
        if (error) throw error;

        const current_date = new Date();
        for (let i = 0; i < data.length; i++) {
            const start_date = new Date(data[i].start_date);
            const end_date = new Date(data[i].end_date);
            if (current_date > start_date && current_date < end_date) {
                return data[i];
            }
        }
        // else, return the last one
        return data[data.length - 1];
    }

    export async function getAllCompetitionsForTeam(team_number: number): Promise<TBAEvent[]> {
        const current_year = new Date().getFullYear();
        const { data, error } = await supabase.functions.invoke("tba-api", {
            body: { endpoint: `/team/frc${team_number}/events/${current_year}/simple` },
        });
        if (error) throw error;

        // sort by start date
        data.sort((a: TBAEvent, b: TBAEvent) => {
            const a_date = new Date(a.start_date);
            const b_date = new Date(b.start_date);
            return a_date.getTime() - b_date.getTime();
        });
        return data;
    }
}

export namespace TBA {
    export async function searchTeams(query: string): Promise<FRCTeam[]> {
        let response;
        if (isNaN(Number(query))) {
            response = await supabase.from("tba_teams").select("*").ilike("name", `%${query}%`);
        } else {
            response = await supabase.from("tba_teams").select("*").eq("number", Number(query));
        }

        if (response.error) {
            console.error(response.error);
            return [];
        }

        return response.data.map((team: any) => ({
            number: team.number,
            name: team.name,
        }));
    }

    export async function getAllMatchesForComp(competitionId: number): Promise<TBAMatch[]> {
        const { data: compData, error: compError } = await supabase
            .from("competitions")
            .select("tba_event_id")
            .eq("id", competitionId)
            .single();
        if (compError) throw compError;

        const { data, error } = await supabase
            .from("tba_matches")
            .select("id, team, match, predicted_time, event_id, alliance, comp_level")
            .eq("event_id", compData.tba_event_id);
        if (error) throw error;

        return data.map((match: any) => ({
            id: match.id,
            team: match.team,
            match: match.match,
            predictedTime: new Date(match.predicted_time),
            eventId: match.event_id,
            alliance: match.alliance,
            compLevel: match.comp_level,
        }));
    }
}
