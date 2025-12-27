import { supabase } from "@/lib/supabase";

export interface TBATeam {
    number: number;
    name: string;
}

export class TBATeams {
    static TEAM_CACHE: TBATeam[] = [];

    static async fetchAllTeams(): Promise<TBATeam[]> {
        if (TBATeams.TEAM_CACHE.length === 0) {
            const response = await supabase.from("tba_teams").select("*");
            if (response.error) {
                console.error(response.error);
                return [];
            }
            TBATeams.TEAM_CACHE = response.data.map((team: any) => {
                return {
                    number: team.number,
                    name: team.name,
                };
            });
        }
        return TBATeams.TEAM_CACHE;
    }

    static async searchTeams(query: string): Promise<TBATeam[]> {
        const teams = await TBATeams.fetchAllTeams();
        return teams.filter(
            (team) => team.name.toLowerCase().includes(query.toLowerCase()) || team.number.toString().includes(query),
        );
    }
}
