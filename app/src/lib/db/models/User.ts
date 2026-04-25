import { supabase } from "@/lib/supabase";

export interface UserStub {
    id: string;
    name: string | null;
    emoji: string;
}

export interface User {
    id: string;

    orgId: number | null;
    scouter: boolean | null;
    admin: boolean | null;

    onboarded: boolean;
    approved: boolean | null;
}

export namespace Users {
    export async function get(id: string): Promise<User> {
        const { data, error } = await supabase
            .from("user_attributes")
            .select(
                `
                id,
                orgId:      organization_id,
                scouter:    scouter,
                admin:      admin
                `,
            )
            .eq("id", id)
            .single();
        if (error) throw error;

        return {
            ...data,
            onboarded: data.orgId !== null,
            approved: data.scouter || data.admin,
        };
    }

    // FIXME: impure queries are below

    export async function updateApproveStatus(userId: string, approved: boolean): Promise<void> {
        const { error } = await supabase
            .from("user_attributes")
            .update({ scouter: approved })
            .eq("id", userId);
        if (error) throw error;
    }

    export async function updateAdminStatus(userId: string, isAdmin: boolean): Promise<void> {
        const { error } = await supabase
            .from("user_attributes")
            .update({ admin: isAdmin })
            .eq("id", userId);
        if (error) throw error;
    }
}
