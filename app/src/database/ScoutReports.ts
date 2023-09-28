import { supabase } from '../lib/supabase';

interface ScoutReport {
  matchNumber: number,
  teamNumber: number,
  data: [],
  competitionId: number
}

interface ScoutReportWithDate extends ScoutReport {
  createdAt: Date
}

interface ScoutReportReturnData extends ScoutReportWithDate {
  form: [],
  userId: string,
  competitionName: string,
}


class ScoutReportsDB {
  static async getReportsForCompetition(id: number) : Promise<ScoutReportReturnData[]> {
    const res : ScoutReportReturnData[] = [];
    const { data, error } = await supabase.from('scout_reports')
      .select('*, matches!inner( number, competition_id, competitions(name, forms(form_structure)) )').eq('matches.competition_id'
      , id);
    if (error) {
      throw error;
    } else {
      console.log(data);
      for (let i = 0; i < data.length; i += 1) {
        res.push({
          matchNumber: data[i].matches.number,
          teamNumber: data[i].team,
          data: data[i].data,
          competitionId: data[i].matches.competition_id,
          form: data[i].matches.competitions.forms.form_structure,
          userId: data[i].user_id,
          createdAt: data[i].created_at,
          competitionName: data[i].matches.competitions.name,
        });
      }
    }
    return res;
  }

  static async getReportsForSelf() : Promise<ScoutReportReturnData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (user == null) {
      throw new Error('User not logged in');
    }
    const res : ScoutReportReturnData[] = [];
    const { data, error } = await supabase.from('scout_reports')
      .select('*, matches( number, competition_id, competitions(name, forms(form_structure)) )').eq('user_id', user.id);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        res.push({
          matchNumber: data[i].matches.number,
          teamNumber: data[i].team,
          data: data[i].data,
          competitionId: data[i].matches.competition_id,
          form: data[i].matches.competitions.forms.form_structure,
          userId: data[i].user_id,
          createdAt: data[i].created_at,
          competitionName: data[i].matches.competitions.name,
        });
      }
    }
    return res;
  }


  static async getReportsForTeam(team: number) : Promise<ScoutReportReturnData[]> {
    const res : ScoutReportReturnData[] = [];
    const { data, error } = await supabase.from('scout_reports')
      .select('*, matches( number, competition_id, competitions(name, forms(form_structure)) )').eq('team', team);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        res.push({
          matchNumber: data[i].matches.number,
          teamNumber: data[i].team,
          data: data[i].data,
          competitionId: data[i].matches.competition_id,
          form: data[i].matches.competitions.forms.form_structure,
          userId: data[i].user_id,
          createdAt: data[i].created_at,
          competitionName: data[i].matches.competitions.name,
        });
      }
    }
    return res;
  }

  static async createOnlineScoutReport(report: ScoutReport) : Promise<void> {
    const { data, error } = await supabase.rpc('add_online_scout_report', {
      competition_id_arg: report.competitionId,
      match_number_arg: report.matchNumber,
      team_number_arg: report.teamNumber,
      data_arg: report.data,
    });
    if (error) {
      throw error;
    } else {
      return data;
    }
  }

  static async createOfflineScoutReport(report: ScoutReportWithDate) : Promise<void> {
    const { data, error } = await supabase.rpc('add_offline_scout_report', {
      competition_id_arg: report.competitionId,
      match_number_arg: report.matchNumber,
      team_number_arg: report.teamNumber,
      data_arg: report.data,
      created_at_arg: report.createdAt,
    });
    if (error) {
      throw error;
    } else {
      return data;
    }
  }
}

export default ScoutReportsDB;