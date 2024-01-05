import {supabase} from '../lib/supabase';

interface Form {
  formStructure: [];
  pitScouting: boolean;
}
export enum FormQuestionTypes {
  radio = 'radio',
  checkbox = 'checkbox',
  textbox = 'textbox',
  number = 'number',
  heading = 'heading',
}

interface FormReturnData extends Form {
  id: number;
}

class FormsDB {
  static async addForm(form: Form): Promise<void> {
    const {data, error} = await supabase.from('forms').insert({
      form_structure: form.formStructure,
      pit_scouting: form.pitScouting,
    });
    if (error) {
      throw error;
    }
  }

  static async getForm(id: number): Promise<Form> {
    const {data, error} = await supabase.from('forms').select('*').eq('id', id);
    if (error) {
      throw error;
    } else {
      if (data.length === 0) {
        throw new Error('Form not found');
      } else {
        return {
          formStructure: data[0].form_structure,
          pitScouting: data[0].pit_scouting,
        };
      }
    }
  }

  static async getAllForms(): Promise<FormReturnData[]> {
    const res: FormReturnData[] = [];
    const {data, error} = await supabase.from('forms').select('*');
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        res.push({
          id: data[i].id,
          formStructure: data[i].form_structure,
          pitScouting: data[i].pit_scouting,
        });
      }
    }
    return res;
  }
}

export default FormsDB;
