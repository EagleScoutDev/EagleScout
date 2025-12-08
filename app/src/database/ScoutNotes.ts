import { supabase } from "../lib/supabase";

export interface Note {
    id?: string;

    content: string;

    team_number: number;
    match_id: number; // foreign-key relation to matches table

    created_at: Date;
    created_by: string;
    scouter_name?: string;
}

export interface NoteWithMatch extends Note {
    match_number: number;
    competition_name?: string;
}

export interface OfflineNote {
    content: string;
    team_number: number;
    comp_id: number;
    match_number: number;
    created_at: Date;
}

export class NotesDB {
    /**
     * Checks if a match exists in the database. If it does, return the match id.
     * @param match_number the match number to check
     * @param competition_id the id of the competition to check
     */
    static async checkIfMatchExists(
        match_number: number,
        competition_id: number
    ): Promise<{
        exists: boolean;
        id: number;
    }> {
        const { data, error } = await supabase
            .from("matches")
            .select("id")
            .eq("number", match_number)
            .eq("competition_id", competition_id);

        if (!data || data?.length === 0) {
            return {
                exists: false,
                id: -1,
            };
        }
        if (error) {
            throw error;
        } else {
            return {
                exists: true,
                id: data[0].id,
            };
        }
    }

    static async createMatch(match_number: number, competition_id: number): Promise<number> {
        const { data, error } = await supabase
            .from("matches")
            .insert([
                {
                    number: match_number,
                    competition_id: competition_id,
                },
            ])
            .select("id");
        if (error) {
            throw error;
        } else {
            return data[0].id;
        }
    }

    static async createNote(
        content: string,
        teamNumber: number,
        matchNumber: number,
        competitionId: number
    ): Promise<void> {
        let { exists: matchExists, id: matchId } = await this.checkIfMatchExists(matchNumber, competitionId);

        if (!matchExists) {
            matchId = await this.createMatch(matchNumber, competitionId);
        }

        const { error } = await supabase.from("notes").insert([
            {
                content: content,
                team_number: teamNumber,
                match_id: matchId,
            },
        ]);
        if (error) {
            throw error;
        }
    }

    static async getAllNotes(): Promise<any[]> {
        let { data, error } = await supabase.from("notes").select("*");

        if (error) {
            throw error;
        }

        if (!data) {
            return [];
        }

        return data;
    }

    static async getNotesForCompetition(competitionId: number): Promise<NoteWithMatch[]> {
        // TODO: query is including values where the competition_id is wrong
        const { data, error } = await supabase
            .from("notes")
            .select("*, matches!inner( number, competition_id, competitions!inner(name) ), profiles(name)")
            .eq("matches.competition_id", competitionId);
        if (error) {
            console.log(error)
            throw error;
        }
        console.log(data)

        return data.map((note) => ({
            id: note.id,
            content: note.content,
            team_number: note.team_number,
            match_id: note.match_id,
            match_number: note.matches.number,
            created_at: note.created_at,
            created_by: note.created_by,
            scouter_name: note.profiles.name,
            competition_name: note.matches.competitions.name
        }));
    }

    static async getNotesForTeam(teamNumber: number): Promise<Note[]> {
        const res: Note[] = [];
        const { data, error } = await supabase.from("notes").select("*, profiles(name)").eq("team_number", teamNumber);
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < data.length; i += 1) {
                res.push({
                    id: data[i].id,
                    content: data[i].content,
                    team_number: data[i].team_number,
                    match_id: data[i].match_id,
                    created_at: data[i].created_at,
                    created_by: data[i].created_by,
                    scouter_name: data[i].profiles.name,
                });
            }
        }
        return res;
    }

    static async getNotesForTeamAtCompetition(teamNumber: number, competitionId: number): Promise<NoteWithMatch[]> {
        const res: NoteWithMatch[] = [];
        const { data: compIds } = await supabase.from("matches").select("id").eq("competition_id", competitionId);
        if (!compIds) {
            return [];
        }
        // the way that the match_id filter works is very janky
        // find a better way to check that matches.competition_id == competitionId
        const { data, error } = await supabase
            .from("notes")
            .select("*, matches(number), profiles(name)")
            .eq("team_number", teamNumber)
            .filter("match_id", "in", `(${compIds.map((match: { id: number }) => match.id).join(",")})`);
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < data.length; i += 1) {
                res.push({
                    id: data[i].id,
                    content: data[i].content,
                    team_number: data[i].team_number,
                    match_id: data[i].match_id,
                    match_number: data[i].matches.number,
                    created_at: data[i].created_at,
                    created_by: data[i].created_by,
                    scouter_name: data[i].profiles.name,
                });
            }
        }
        return res;
    }

    static async getNotesForSelf(): Promise<NoteWithMatch[]> {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user == null) {
            throw new Error("User not logged in");
        }
        const res: NoteWithMatch[] = [];
        const { data, error } = await supabase
            .from("notes")
            .select("*, matches(number, competitions(name))")
            .eq("created_by", user.id);
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < data.length; i += 1) {
                res.push({
                    id: data[i].id,
                    content: data[i].content,
                    team_number: data[i].team_number,
                    match_id: data[i].match_id,
                    created_at: data[i].created_at,
                    created_by: data[i].created_by,
                    match_number: data[i].matches.number,
                    competition_name: data[i].matches.competitions.name,
                });
            }
        }
        return res;
    }

    static async createOfflineNote(note: OfflineNote): Promise<void> {
        let { exists: matchExists, id: matchId } = await this.checkIfMatchExists(note.match_number, note.comp_id);

        if (!matchExists) {
            matchId = await this.createMatch(note.match_number, note.comp_id);
        }
        const { data, error } = await supabase.from("notes").insert([
            {
                content: note.content,
                team_number: note.team_number,
                match_id: matchId,
            },
        ]);
        if (error) {
            throw error;
        }
    }
}
