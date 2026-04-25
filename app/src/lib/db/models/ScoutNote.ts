import { supabase } from "@/lib/supabase";
import type { UserStub } from "@/lib/db/models/User";

export interface NoteData {
    orgId: number;
    compId: number;
    matchId: number;
    matchNumber: number;
    teamNumber: number;
    content: string | null;
    createdAt: Date;
}

export interface NoteReturnData extends NoteData {
    id: number;

    uploadedAt: Date;
    createdBy: UserStub | null;
}

export namespace ScoutNotes {
    const query = () =>
        supabase.from("notes").select(`
            id,
            orgId:      organization_id,
            ...matches(
                matchId:        id,
                compId:         competition_id,
                matchNumber:    number
            ),
            teamNumber: team_number,
            content,
            createdAt:  created_at,
            uploadedAt: created_at,
            createdBy:  profiles(
                id,
                name,
                emoji
            )
            `);

    export async function getAllForTeam(
        teamNumber: number,
        competitionId: number,
    ): Promise<NoteReturnData[]> {
        const { data, error } = await query()
            .eq("teamNumber", teamNumber)
            .eq("competitionId", competitionId);
        if (error) throw error;

        return data.map((note) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            uploadedAt: new Date(note.uploadedAt),
        }));
    }

    // FIXME: impure queries are below

    // FIXME: impure queries are below

    export async function getAllForSelf(
        competitionId: number,
    ): Promise<NoteReturnData[]> {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user == null) {
            throw new Error("User not logged in");
        }

        const { data, error } = await query()
            .eq("createdBy.id", user.id)
            .eq("competitionId", competitionId);
        if (error) throw error;

        return data.map((note) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            uploadedAt: new Date(note.uploadedAt),
        }));
    }

    export async function create(
        content: string,
        teamNumber: number,
        matchNumber: number,
        competitionId: number,
    ): Promise<void> {
        const { Matches } = await import("./Match");
        const matchId = await Matches.ensureForNumber(matchNumber, competitionId);

        const { error } = await supabase
            .from("notes")
            .insert({
                content: content,
                team_number: teamNumber,
                match_id: matchId,
            });
        if (error) throw error;
    }

}
