import {supabase} from '../lib/supabase';

export interface TagStructure {
  id?: string;
  name: string;
  created_at: Date;
  picklist_id: number;
}

export class TagsDB {
  static async getTagsForPicklist(
    picklist_id: string,
  ): Promise<TagStructure[]> {
    const {data, error} = await supabase
      .from('tags')
      .select('*')
      .eq('picklist_id', picklist_id);
    if (error) {
      throw error;
    } else {
      return data;
    }
  }

  static async createTag(picklist_id: number, name: string) {
    try {
      const {data, error} = await supabase
        .from('tags')
        .insert([{name: name, picklist_id: picklist_id}]);
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  static async renameTag(tag_id: string, name: string) {
    try {
      const {error} = supabase
        .from('tags')
        .update({name: name})
        .eq('id', tag_id);
    } catch (error) {
      throw error;
    }
  }
}
