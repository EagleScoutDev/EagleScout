import { supabase } from '../lib/supabase';

interface Competition {
  name: string,
  startTime: Date,
  endTime: Date,
  formId: number
}

interface CompetitionReturnData extends Competition {
  id: number
  form: []
}

class CompetitionsDB {
  static async getCurrentCompetition() : Promise<CompetitionReturnData | null> {
    // select the competiton from supabase where the current time is between the start and end time
    const currentTime = new Date().toISOString();
    const { data, error } = await supabase.from('competitions')
      .select('*, forms( form_structure )').lte('start_time', currentTime).gte('end_time', currentTime);
    if (error) {
      throw error;
    } else {
      if (data.length === 0) {
        return null;
      } else {
        return {
          id: data[0].id,
          name: data[0].name,
          startTime: data[0].start_time,
          endTime: data[0].end_time,
          formId: data[0].form_id,
          form: data[0].forms.form_structure
        };
      }
    }
  }

  static async createCompetition(competition: Competition) : Promise<void> {
    const { data, error} = await supabase.from('competitions').insert({
      name: competition.name,
      start_time: competition.startTime,
      end_time: competition.endTime,
      form_id: competition.formId
    });
    if (error) {
      throw error;
    }
  }
}

export default CompetitionsDB;