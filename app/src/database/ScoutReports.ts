import {supabase} from '../lib/supabase';

interface TimelineElement {
  time: number;
  label: string;
}

interface ScoutReport {
  reportId: number;
  matchNumber: number;
  teamNumber: number;
  data: [];
  competitionId: number;
  timelineData?: TimelineElement[];
}

interface ScoutReportWithDate extends ScoutReport {
  createdAt: Date;
}

export interface ScoutReportReturnData extends ScoutReportWithDate {
  form: [];
  userId: string;
  competitionName: string;
}

interface ScoutReportHistory {
  // id col in db
  historyId: number;
  editedAt: Date;
  // the editor's uuid
  editedById: string;
  data: [];
  // the editor's name
  name: string;
}

class ScoutReportsDB {
  static async getReportsForCompetition(
    id: number,
  ): Promise<ScoutReportReturnData[]> {
    const res: ScoutReportReturnData[] = [];
    const {data, error} = await supabase
      .from('scout_reports')
      .select(
        '*, matches!inner( number, competition_id, competitions(name, forms(form_structure)) )',
      )
      .eq('matches.competition_id', id);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        res.push({
          reportId: data[i].id,
          matchNumber: data[i].matches.number,
          teamNumber: data[i].team,
          data: data[i].data,
          competitionId: data[i].matches.competition_id,
          form: data[i].matches.competitions.forms.form_structure,
          userId: data[i].user_id,
          createdAt: data[i].created_at,
          competitionName: data[i].matches.competitions.name,
          timelineData: data[i].timeline_data,
        });
      }
    }
    return res;
  }

  static async getReportsForSelf(): Promise<ScoutReportReturnData[]> {
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (user == null) {
      throw new Error('User not logged in');
    }
    const res: ScoutReportReturnData[] = [];
    const {data, error} = await supabase
      .from('scout_reports')
      .select(
        '*, matches( number, competition_id, competitions(name, forms(form_structure)) )',
      )
      .eq('user_id', user.id);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        res.push({
          reportId: data[i].id,
          matchNumber: data[i].matches.number,
          teamNumber: data[i].team,
          data: data[i].data,
          competitionId: data[i].matches.competition_id,
          form: data[i].matches.competitions.forms.form_structure,
          userId: data[i].user_id,
          createdAt: data[i].created_at,
          competitionName: data[i].matches.competitions.name,
          timelineData: data[i].timeline_data,
        });
      }
    }
    return res;
  }

  static async getReportsForTeam(
    team: number,
  ): Promise<ScoutReportReturnData[]> {
    const res: ScoutReportReturnData[] = [];
    const {data, error} = await supabase
      .from('scout_reports')
      .select(
        '*, matches( number, competition_id, competitions(name, forms(form_structure)) )',
      )
      .eq('team', team);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        res.push({
          reportId: data[i].id,
          matchNumber: data[i].matches.number,
          teamNumber: data[i].team,
          data: data[i].data,
          competitionId: data[i].matches.competition_id,
          form: data[i].matches.competitions.forms.form_structure,
          userId: data[i].user_id,
          createdAt: data[i].created_at,
          competitionName: data[i].matches.competitions.name,
          timelineData: data[i].timeline_data,
        });
      }
    }
    return res;
  }

  static async getReportsForTeamAtCompetition(
    team: number,
    compId: number,
  ): Promise<ScoutReportReturnData[]> {
    const res: ScoutReportReturnData[] = [];
    const {data, error} = await supabase
      .from('scout_reports')
      .select(
        '*, matches!inner( number, competition_id, competitions(name, forms(form_structure)) )',
      )
      .eq('team', team)
      .eq('matches.competition_id', compId);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        console.log('here4');
        console.log('data: ' + JSON.stringify(data[0]));
        res.push({
          reportId: data[i].id,
          matchNumber: data[i].matches.number,
          teamNumber: data[i].team,
          data: data[i].data,
          competitionId: data[i].matches.competition_id,
          form: data[i].matches.competitions.forms.form_structure,
          userId: data[i].user_id,
          createdAt: data[i].created_at,
          competitionName: data[i].matches.competitions.name,
          timelineData: data[i].timeline_data,
        });
      }
    }
    return res;
  }

  static async createOnlineScoutReport(report: ScoutReport): Promise<void> {
    const {data, error} = await supabase.rpc('add_online_scout_report', {
      competition_id_arg: report.competitionId,
      match_number_arg: report.matchNumber,
      team_number_arg: report.teamNumber,
      data_arg: report.data,
      timeline_data: report.timelineData,
    });
    if (error) {
      throw error;
    } else {
      return data;
    }
  }

  static async createOfflineScoutReport(
    report: ScoutReportWithDate,
  ): Promise<void> {
    const {data, error} = await supabase.rpc('add_offline_scout_report', {
      competition_id_arg: report.competitionId,
      match_number_arg: report.matchNumber,
      team_number_arg: report.teamNumber,
      data_arg: report.data,
      created_at_arg: report.createdAt,
      timeline_data: report.timelineData,
    });
    if (error) {
      throw error;
    } else {
      return data;
    }
  }

  static async editOnlineScoutReport(
    reportId: number,
    newData: [],
  ): Promise<void> {
    console.log('editing report with id: ', reportId);
    const {error} = await supabase.rpc('edit_online_scout_report', {
      report_id_arg: reportId,
      data_arg: newData,
    });
    if (error) {
      throw error;
    }
  }

  static async getReportHistory(
    reportId: number,
  ): Promise<ScoutReportHistory[]> {
    const res: ScoutReportHistory[] = [];
    const {data, error} = await supabase.rpc('get_scout_report_history', {
      report_id_arg: reportId,
    });
    console.log('got report history from db: ', data, 'report_id: ', reportId);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        res.push({
          historyId: data[i].id,
          editedAt: data[i].edited_at,
          editedById: data[i].edited_by_id,
          data: data[i].data,
          name: data[i].name,
        });
      }
    }
    return res;
  }
}

export default ScoutReportsDB;
