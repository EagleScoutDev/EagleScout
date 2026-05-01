import { supabase } from "@/lib/supabase";

export interface PicklistTeam {
    teamNumber: number;
    tags: number[]; // tag ids
    dnp: boolean;
    notes: string;
}

export interface Picklist {
    id: number;
    teams: PicklistTeam[];
    createdAt: Date;
    name: string;
    createdBy: string;
    competitionId: number;
}

export interface Tag {
    id: number;
    name: string;
    createdAt: Date;
    picklistId: number;
    color?: string; // hex color
}

export namespace Picklists {
    const picklistQuery = () =>
        supabase.from("picklist").select(`
            id,
            teams,
            createdAt:      created_at,
            name,
            createdBy:      created_by,
            competitionId:  competition_id
        `);

    const tagQuery = () =>
        supabase.from("tags").select(`
            id,
            name,
            createdAt:   created_at,
            picklistId:  picklist_id,
            color
        `);

    export async function get(id: number): Promise<Picklist> {
        const { data, error } = await picklistQuery().eq("id", id).single();
        if (error) throw error;

        return {
            ...data,
            createdAt: new Date(data.createdAt),
        };
    }

    export async function getAllForComp(
        competitionId: number,
    ): Promise<Picklist[]> {
        const { data, error } = await picklistQuery().eq(
            "competitionId",
            competitionId,
        );
        if (error) throw error;

        return data.map((picklist) => ({
            ...picklist,
            createdAt: new Date(picklist.createdAt),
        }));
    }

    export async function getAllTags(picklistId: number): Promise<Tag[]> {
        const { data, error } = await tagQuery().eq("picklistId", picklistId);
        if (error) throw error;

        return data.map((tag) => ({
            ...tag,
            createdAt: new Date(tag.createdAt),
        }));
    }

    export async function create(name: string, teams: PicklistTeam[], competitionId: number): Promise<number> {
        const { data, error } = await supabase.from("picklist").insert({
            teams: teams.map((t) => ({
                team_number: t.teamNumber,
                tags: t.tags,
                dnp: t.dnp,
                notes: t.notes,
            })),
            created_at: new Date(),
            name: name,
            competition_id: competitionId,
        }).select("id").single();
        if (error) throw error;

        return data.id;
    }

    export async function update(id: number, teams: PicklistTeam[]): Promise<void> {
        const { error } = await supabase
            .from("picklist")
            .update({
                teams: teams.map((t) => ({
                    team_number: t.teamNumber,
                    tags: t.tags,
                    dnp: t.dnp,
                    notes: t.notes,
                })),
            })
            .eq("id", id);
        if (error) throw error;
    }

    export async function remove(id: number): Promise<void> {
        const { error } = await supabase.from("picklist").delete().eq("id", id);
        if (error) throw error;
    }

    export async function createTag(picklistId: number, name: string, color?: string): Promise<number> {
        const { data, error } = await supabase
            .from("tags")
            .insert({
                name: name,
                picklist_id: picklistId,
                color: color,
            })
            .select("id")
            .single();
        if (error) throw error;

        return data.id;
    }

    export async function updateTagColor(tagId: number, color: string): Promise<void> {
        const { error } = await supabase.from("tags").update({ color }).eq("id", tagId);
        if (error) throw error;
    }

    export async function removeTag(tagId: number): Promise<void> {
        const { error } = await supabase.from("tags").delete().eq("id", tagId);
        if (error) throw error;
    }
}
