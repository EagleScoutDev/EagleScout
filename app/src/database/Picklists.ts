import { supabase } from "../lib/supabase";

export interface SimpleTeam {
    key: string;
    team_number: number;
    nickname: string;
    name: string;
    city: string;
    state_prov: string;
    country: string;
}

export interface PicklistStructure {
    id: number;
    teams: PicklistTeam[];
    created_at: Date;
    name: string;
    created_by: string;
    competition_id: string;
}

export interface PicklistTeam {
    team_number: number;
    tags: number[]; // tag ids
    dnp: boolean;
    notes: string;
}

export class PicklistsDB {
    static async getPicklists(competition_id: any): Promise<PicklistStructure[]> {
        const { data, error } = await supabase.from("picklist").select("*").eq("competition_id", competition_id);
        if (error) {
            throw error;
        } else {
            return data;
        }
    }

    static async getPicklist(picklist_id: number): Promise<PicklistStructure> {
        const { data, error } = await supabase.from("picklist").select("*").eq("id", picklist_id);
        if (error) {
            throw error;
        } else {
            return data[0];
        }
    }

    static async deletePicklist(picklist_id: any) {
        const { data, error, count } = await supabase.from("picklist").delete().eq("id", picklist_id);
        if (error) {
            throw error;
        } else {
            return data;
        }
    }

    static async createPicklist(name: string, teams: PicklistTeam[], cmpId: any) {
        try {
            // Before creating a picklist, confirm that user_id is not null and exists in the user table
            // Your logic for checking if the user exists in your 'users' table can go here
            // For now, we proceed to insert assuming user_id is valid since we've got it from auth state

            const { data, error } = await supabase.from("picklist").insert([
                {
                    teams: teams,
                    created_at: new Date(),
                    name: name,
                    competition_id: cmpId,
                },
            ]);

            if (error) {
                throw error;
            }
            return data; // assuming 'data' contains the array of inserted rows
        } catch (error) {
            console.error("Error in picklist creation:", error);
            throw error;
        }
    }

    static async updatePicklist(id: number, new_teams: PicklistTeam[]) {
        console.log("updating picklist, id using is:", id);
        console.log("new teams list: ", new_teams);
        const { data, error } = await supabase.from("picklist").update({ teams: new_teams }).eq("id", id);
        if (error) {
            console.log("Picklist not updated, error");
            throw error;
        } else {
            console.log("Picklist updated successfully");
            return data;
        }
    }
}
