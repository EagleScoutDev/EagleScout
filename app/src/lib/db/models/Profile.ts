import { supabase } from "@/lib/supabase";

export interface Profile {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    emoji: string;
}

export namespace Profiles {
    const query = () =>
        supabase.from("profiles").select(`
            id,
            name,
            firstName: first_name,
            lastName: last_name,
            emoji
        `);

    export async function getAll(): Promise<Profile[]> {
        const { data, error } = await query();
        if (error) throw error;

        return data;
    }

    export async function get(id: string): Promise<Profile> {
        const { data, error } = await query().eq("id", id).single();
        if (error) throw error;

        return data;
    }

    // FIXME: impure queries are below

    export async function updateEmoji(emoji: string): Promise<void> {
        const { data } = await supabase.auth.getUser();
        const userId = data.user?.id;
        if (!userId) throw new Error("No user logged in");

        const { error } = await supabase.from("profiles").update({ emoji }).eq("id", userId);
        if (error) throw error;
    }

    export async function updateProfile(firstName: string, lastName: string): Promise<void> {
        const { data } = await supabase.auth.getUser();
        const userId = data.user?.id;
        if (!userId) throw new Error("No user logged in");

        const { error } = await supabase
            .from("profiles")
            .update({ first_name: firstName, last_name: lastName })
            .eq("id", userId);
        if (error) throw error;
    }
}
