import { supabase } from './supabase';

export interface SimpleEvent {
    rank: number | null;
    key: string;
    name: string;
    event_code: string;
    event_type: number;
    district: {
        abbreviation: string;
        display_name: string;
        key: string;
        year: number;
    };
    city: string;
    state_prov: string;
    country: string;
    start_date: string;
    end_date: string;
    year: number;
}

export interface SimpleTeam {
    key: string;
    team_number: number;
    nickname: string;
    name: string;
    city: string;
    state_prov: string;
    country: string;
}

export interface SimpleEvent {
    key: string;
    name: string;
    event_code: string;
    event_type: number;
    district: {
        abbreviation: string;
        display_name: string;
        key: string;
        year: number;
    };
    city: string;
    state_prov: string;
    country: string;
    start_date: string;
    end_date: string;
    year: number;
}

export class TBA {
    constructor() {
        // TODO
    }

    static async getEventsForYear(year: number): Promise<SimpleEvent[]> {
        const { data, error } = await supabase.functions.invoke('tba-api', {
            body: { endpoint: `/events/${year}/simple` },
        });
        if (error) {
            throw error;
        }
        return data;
    }

    static async getTeamsAtCompetition(comp_id: string): Promise<SimpleTeam[]> {
        const { data, error } = await supabase.functions.invoke('tba-api', {
            body: { endpoint: `/event/${comp_id}/teams/simple` },
        });
        if (error) {
            throw error;
        }
        return data;
    }

    /**
     * Returns the rank of the team at the competition
     * @param comp_id the competition id
     * @param team_number the team number
     * @returns the rank of the team at the competition, or -1 if the competition has not taken place yet, or -2 if the team is not ranked
     */
    static async getTeamRank(
        comp_id: string,
        team_number: number,
    ): Promise<number> {
        console.log(`getting rank for ${team_number} at ${comp_id}`);
        const { data, error } = await supabase.functions.invoke('tba-api', {
            body: {
                endpoint: `/team/frc${team_number}/event/${comp_id}/status`,
            },
        });
        if (error) {
            throw error;
        }

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

    static async getCurrentCompetitionForTeam(
        team_number: number,
    ): Promise<SimpleEvent> {
        const current_year = new Date().getFullYear();
        const { data, error } = await supabase.functions.invoke('tba-api', {
            body: { endpoint: `/team/frc${team_number}/events/${current_year}/simple` },
        });
        if (error) {
            throw error;
        }
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

    static async getAllCompetitionsForTeam(
        team_number: number,
    ): Promise<SimpleEvent[]> {
        const current_year = new Date().getFullYear();
        const { data, error } = await supabase.functions.invoke('tba-api', {
            body: { endpoint: `/team/frc${team_number}/events/${current_year}/simple` },
        });
        if (error) {
            throw error;
        }

        // sort by start date
        data.sort((a: SimpleEvent, b: SimpleEvent) => {
            const a_date = new Date(a.start_date);
            const b_date = new Date(b.start_date);
            return a_date.getTime() - b_date.getTime();
        });
        return data;
    }
}
