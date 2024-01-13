import {supabase} from '../lib/supabase';

interface Competition {
  name: string;
  startTime: Date;
  endTime: Date;
  formId: number;
  pitScoutFormId: number;
}

export interface CompetitionReturnData extends Competition {
  id: number;
  form: [];
  scoutAssignmentsEnabled: boolean;
  pitScoutFormStructure: [];
}

class CompetitionsDB {
  static async getCompetitions(): Promise<CompetitionReturnData[]> {
    const {data, error} = await supabase.rpc('list_all_competitions');
    if (error) {
      throw error;
    } else {
      return (data as any[]).map(competition => ({
        id: competition.competition_id,
        name: competition.competition_name,
        startTime: competition.start_time,
        endTime: competition.end_time,
        formId: competition.form_id,
        form: competition.form_structure,
        scoutAssignmentsEnabled: competition.scout_assignments_enabled,
        pitScoutFormId: competition.pit_scout_form_id,
        pitScoutFormStructure: competition.pit_scout_form_structure,
      }));
    }
  }

  static async getCurrentCompetition(): Promise<CompetitionReturnData | null> {
    const {data, error} = await supabase.rpc('get_current_competition');
    if (error) {
      throw error;
    } else {
      if (data.length === 0) {
        return null;
      } else {
        return {
          id: data[0].competition_id,
          name: data[0].competition_name,
          startTime: data[0].start_time,
          endTime: data[0].end_time,
          formId: data[0].form_id,
          form: data[0].form_structure,
          scoutAssignmentsEnabled: data[0].scout_assignments_enabled,
          pitScoutFormId: data[0].pit_scout_form_id,
          pitScoutFormStructure: data[0].pit_scout_form_structure,
        };
      }
    }
  }

  static async createCompetition(competition: Competition): Promise<void> {
    const {data, error} = await supabase.from('competitions').insert({
      name: competition.name,
      start_time: competition.startTime,
      end_time: competition.endTime,
      form_id: competition.formId,
    });
    if (error) {
      throw error;
    }
  }

  static async getCompetitionTeams(competitionId: number): Promise<number[]> {
    const {data, error} = await supabase
      .from('competitions')
      .select('tba_events ( teams )')
      .eq('id', competitionId)
      .single();
    if (error) {
      throw error;
    } else {
      console.log(data);
      return data.tba_events.teams;
    }
  }
}

export default CompetitionsDB;
