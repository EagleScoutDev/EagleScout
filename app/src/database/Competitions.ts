import {supabase} from '../lib/supabase';

interface Competition {
  name: string;
  startTime: Date;
  endTime: Date;
  formId: number;
}

export enum ScoutAssignmentsConfig {
  DISABLED,
  TEAM_BASED,
  POSITION_BASED,
}

export interface CompetitionReturnData extends Competition {
  id: number;
  form: [];
  scoutAssignmentsConfig: ScoutAssignmentsConfig;
}

class CompetitionsDB {
  static async getCompetitions(): Promise<CompetitionReturnData[]> {
    const {data, error} = await supabase
      .from('competitions')
      .select('*, forms( form_structure )');
    if (error) {
      throw error;
    } else {
      return data.map(competition => {
        let scoutAssignmentsConfig: ScoutAssignmentsConfig;
        if (competition.scout_assignments_config === 'team_based') {
          scoutAssignmentsConfig = ScoutAssignmentsConfig.TEAM_BASED;
        } else if (competition.scout_assignments_config === 'position_based') {
          scoutAssignmentsConfig = ScoutAssignmentsConfig.POSITION_BASED;
        } else {
          scoutAssignmentsConfig = ScoutAssignmentsConfig.DISABLED;
        }
        return {
          id: competition.id,
          name: competition.name,
          startTime: competition.start_time,
          endTime: competition.end_time,
          formId: competition.form_id,
          form: competition.forms.form_structure,
          scoutAssignmentsConfig: scoutAssignmentsConfig,
        };
      });
    }
  }

  static async getCurrentCompetition(): Promise<CompetitionReturnData | null> {
    // select the competiton from supabase where the current time is between the start and end time
    const currentTime = new Date().toISOString();
    const {data, error} = await supabase
      .from('competitions')
      .select('*, forms( form_structure )')
      .lte('start_time', currentTime)
      .gte('end_time', currentTime);
    if (error) {
      throw error;
    } else {
      if (data.length === 0) {
        return null;
      } else {
        let scoutAssignmentsConfig: ScoutAssignmentsConfig;
        if (data[0].scout_assignments_config === 'team_based') {
          scoutAssignmentsConfig = ScoutAssignmentsConfig.TEAM_BASED;
        } else if (data[0].scout_assignments_config === 'position_based') {
          scoutAssignmentsConfig = ScoutAssignmentsConfig.POSITION_BASED;
        } else {
          scoutAssignmentsConfig = ScoutAssignmentsConfig.DISABLED;
        }
        return {
          id: data[0].id,
          name: data[0].name,
          startTime: data[0].start_time,
          endTime: data[0].end_time,
          formId: data[0].form_id,
          form: data[0].forms.form_structure,
          scoutAssignmentsConfig: scoutAssignmentsConfig,
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

  static async getCompetitionTBAKey(competitionId: number): Promise<string> {
    const {data, error} = await supabase
      .from('competitions')
      .select('tba_events ( event_key )')
      .eq('id', competitionId)
      .single();
    if (error) {
      throw error;
    } else {
      return data.tba_events.event_key;
    }
  }

  static async getCompetitionById(
    competitionId: number,
  ): Promise<CompetitionReturnData> {
    const {data, error} = await supabase
      .from('competitions')
      .select('*, forms( form_structure )')
      .eq('id', competitionId)
      .single();
    if (error) {
      throw error;
    } else {
      let scoutAssignmentsConfig: ScoutAssignmentsConfig;
      if (data.scout_assignments_config === 'team_based') {
        scoutAssignmentsConfig = ScoutAssignmentsConfig.TEAM_BASED;
      } else if (data.scout_assignments_config === 'position_based') {
        scoutAssignmentsConfig = ScoutAssignmentsConfig.POSITION_BASED;
      } else {
        scoutAssignmentsConfig = ScoutAssignmentsConfig.DISABLED;
      }
      return {
        id: data.id,
        name: data.name,
        startTime: data.start_time,
        endTime: data.end_time,
        formId: data.form_id,
        form: data.forms.form_structure,
        scoutAssignmentsConfig: scoutAssignmentsConfig,
      };
    }
  }
}

export default CompetitionsDB;
