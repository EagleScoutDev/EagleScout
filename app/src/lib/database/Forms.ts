import { supabase } from "@/lib/supabase";
import type { Form } from "@/lib/forms";

export interface FormReturnData extends Form {
    id: number;
}

export class FormsDB {
    static async addForm(form: Form): Promise<void> {
        const { data, error } = await supabase.from("forms").insert({
            form_structure: form.formStructure,
            pit_scouting: form.pitScouting,
            name: form.name,
        });
        if (error) throw error;
    }

    static async deleteForm(form: FormReturnData): Promise<void> {
        const { error } = await supabase.from("forms").delete().eq("id", form.id);
        if (error) throw error;
    }

    static async getForm(id: number): Promise<FormReturnData> {
        const { data, error } = await supabase.from("forms").select("*").eq("id", id);
        if (error) {
            throw error;
        } else {
            if (data.length === 0) {
                throw new Error("Form not found");
            } else {
                return {
                    id: data[0].id,
                    formStructure: data[0].form_structure,
                    pitScouting: data[0].pit_scouting,
                    name: data[0].name,
                };
            }
        }
    }

    static async getAllForms(): Promise<FormReturnData[]> {
        const res: FormReturnData[] = [];
        const { data, error } = await supabase.from("forms").select("*");
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < data.length; i += 1) {
                res.push({
                    id: data[i].id,
                    formStructure: data[i].form_structure,
                    pitScouting: data[i].pit_scouting,
                    name: data[i].name,
                });
            }
        }
        return res;
    }
}
