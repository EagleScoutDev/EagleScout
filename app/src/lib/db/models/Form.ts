import { supabase } from "@/lib/supabase";
import type { Form } from "@/lib/forms";

export interface FormReturnData extends Form {
    id: number;
}

export namespace Forms {
    const query = () =>
        supabase.from("forms").select(`
            id,
            formStructure:  form_structure,
            pitScouting:    pit_scouting,
            name
        `);

    export async function get(id: number): Promise<FormReturnData> {
        const { data, error } = await query().eq("id", id).single();
        if (error) throw error;

        return data;
    }

    export async function getAll(): Promise<FormReturnData[]> {
        const { data, error } = await query();
        if (error) throw error;

        return data;
    }

    export async function create(form: Form): Promise<void> {
        const { error } = await supabase.from("forms").insert({
            form_structure: form.formStructure,
            pit_scouting: form.pitScouting,
            name: form.name,
        });
        if (error) throw error;
    }

    export async function remove(id: number): Promise<void> {
        const { error } = await supabase.from("forms").delete().eq("id", id);
        if (error) throw error;
    }
}
