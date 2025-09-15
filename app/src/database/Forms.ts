import { supabase } from '../lib/supabase';

interface Form {
    formStructure: FormStructure;
    pitScouting: boolean;
    name: string;
}

export namespace Form {
    export type Structure = ItemStructure[]

    interface BaseItemStructure {
        type: ItemType
        idx: number

        question: string
        required: boolean
    }
    export interface RadioStructure extends BaseItemStructure {
        type: ItemType.radio
        options: string[]
    }
    export interface CheckboxesStructure extends BaseItemStructure {
        type: ItemType.checkbox
        options: string[]
    }
    export interface TextboxStructure extends BaseItemStructure {
        type: ItemType.textbox

    }
    export interface NumberStructure extends BaseItemStructure {
        type: ItemType.number
        slider: false
    }
    export interface SliderStructure extends BaseItemStructure {
        type: ItemType.number
        slider: true
        low: number
        high: number
        step: number
        lowLabel: string | null
        highLabel: string | null
    }
    export interface HeadingStructure extends BaseItemStructure {
        type: ItemType.heading
    }
    export type ItemStructure = RadioStructure | CheckboxesStructure | TextboxStructure | NumberStructure | SliderStructure | HeadingStructure
    export enum ItemType {
        radio = 'radio',
        checkbox = 'checkbox',
        textbox = 'textbox',
        number = 'number',
        heading = 'heading',
    }

    export type ArrayData<T> = (string | string[] | number | null)[]
}
export type FormStructure = Form.ItemStructure[]


export interface FormReturnData extends Form {
    id: number;
}

class FormsDB {
    static async addForm(form: Form): Promise<void> {
        const { data, error } = await supabase.from('forms').insert({
            form_structure: form.formStructure,
            pit_scouting: form.pitScouting,
            name: form.name,
        });
        if(error) throw error
    }

    static async deleteForm(form: FormReturnData): Promise<void> {
        const { error } = await supabase.from('forms').delete().eq('id', form.id);
        if(error) throw error
    }

    static async getForm(id: number): Promise<FormReturnData> {
        const { data, error } = await supabase.from('forms').select('*').eq('id', id);
        if (error) {
            throw error;
        } else {
            if (data.length === 0) {
                throw new Error('Form not found');
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
        const { data, error } = await supabase.from('forms').select('*');
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

export default FormsDB;
