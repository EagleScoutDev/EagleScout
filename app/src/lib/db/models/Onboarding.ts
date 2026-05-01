import { supabase } from "@/lib/supabase";

export namespace Onboarding {
    // FIXME: impure queries are below
    export async function registerUserWithOrganization(teamNumber: number) {
        const { data, error } = await supabase.rpc(
            "register_user_with_organization",
            {
                team_number: teamNumber,
            },
        );

        if (error) throw error;
        return data;
    }

    export async function setScouterAndAdmin(userId: string) {
        const { error } = await supabase
            .from("user_attributes")
            .update({ scouter: true, admin: true })
            .eq("id", userId);

        if (error) throw error;
    }
}
