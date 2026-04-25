import { supabase } from "@/lib/supabase";

export namespace Organization {
    export async function updateEmail(orgId: number, email: string) {
        const { error } = await supabase
            .from("organizations")
            .update({ email })
            .eq("id", orgId);

        if (error) throw error;
    }
}
