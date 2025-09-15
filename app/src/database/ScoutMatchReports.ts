import { supabase } from '../lib/supabase';
import type { CrescendoAutoPath } from '../components/games/crescendo/CrescendoAutoPath';
import type { ReefscapeAutoPath } from '../components/games/reefscape/ReefscapeAutoPath';

interface TimelineElement {
    time: number;
    label: string;
}

interface ScoutReport {
    reportId: number;
    matchNumber: number;
    teamNumber: number;
    data: any[];
    competitionId: number;
    timelineData?: TimelineElement[];
    autoPath?: CrescendoAutoPath | ReefscapeAutoPath;
}

interface ScoutReportWithDate extends ScoutReport {
    createdAt: Date;
}

export interface ScoutReportReturnData extends ScoutReportWithDate {
    form: [];
    userId: string;
    userName?: string;
    competitionName: string;
}

export interface ScoutReportHistory {
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
        fetchUserNames = false,
    ): Promise<ScoutReportReturnData[]> {
        const { data, error } = await supabase
            .from('scout_reports')
            .select(
                '*, matches!inner( number, competition_id, competitions(name, forms!competitions_form_id_fkey(form_structure)) )' +
                (fetchUserNames ? ', profiles(name)' : ''),
            )
            .eq('matches.competition_id', id);
        if (error) throw error;

        return data.map(x => ({
            reportId: x.id,
            matchNumber: x.matches.number,
            teamNumber: x.team,
            data: x.data,
            competitionId: x.matches.competition_id,
            form: x.matches.competitions.forms.form_structure,
            userId: x.user_id,
            userName: fetchUserNames ? x.profiles.name : undefined,
            createdAt: x.created_at,
            competitionName: x.matches.competitions.name,
            timelineData: x.timeline_data,
            autoPath: x.auto_path,
        }))
    }

    static async getReportsForSelf(): Promise<ScoutReportReturnData[]> {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user == null) {
            throw new Error('User not logged in');
        }
        const { data, error } = await supabase
            .from('scout_reports')
            .select(
                '*, matches( number, competition_id, competitions(name, forms!competitions_form_id_fkey(form_structure)) )',
            )
            .eq('user_id', user.id);
        if (error) throw error

        return data.map(x => ({
            reportId: x.id,
            matchNumber: x.matches.number,
            teamNumber: x.team,
            data: x.data,
            competitionId: x.matches.competition_id,
            form: x.matches.competitions.forms.form_structure,
            userId: x.user_id,
            createdAt: x.created_at,
            competitionName: x.matches.competitions.name,
            timelineData: x.timeline_data,
            autoPath: x.auto_path,
        }))
    }

    static async getReportsForTeam(
        team: number,
    ): Promise<ScoutReportReturnData[]> {
        const res: ScoutReportReturnData[] = [];
        const { data, error } = await supabase
            .from('scout_reports')
            .select(
                '*, matches( number, competition_id, competitions(name, forms!competitions_form_id_fkey(form_structure)) )',
            )
            .eq('team', team);
        if (error) throw error

        return data.map(x => ({
            reportId: x.id,
            matchNumber: x.matches.number,
            teamNumber: x.team,
            data: x.data,
            competitionId: x.matches.competition_id,
            form: x.matches.competitions.forms.form_structure,
            userId: x.user_id,
            createdAt: x.created_at,
            competitionName: x.matches.competitions.name,
            timelineData: x.timeline_data,
            autoPath: x.auto_path,
        }))
    }

    static async getReportsForTeamAtCompetition(
        team: number,
        compId: number,
    ): Promise<ScoutReportReturnData[]> {
        const { data, error } = await supabase
            .from('scout_reports')
            .select(
                '*, matches!inner( number, competition_id, competitions(name, forms!competitions_form_id_fkey(form_structure)) )',
            )
            .eq('team', team)
            .eq('matches.competition_id', compId);
        console.log('Got scout reports');
        if (error) throw error

        return data.map(x => ({
            reportId: x.id,
            matchNumber: x.matches.number,
            teamNumber: x.team,
            data: x.data,
            competitionId: x.matches.competition_id,
            form: x.matches.competitions.forms.form_structure,
            userId: x.user_id,
            createdAt: x.created_at,
            competitionName: x.matches.competitions.name,
            timelineData: x.timeline_data,
            autoPath: x.auto_path,
        }))
    }

    static async createOnlineScoutReport(report: ScoutReport): Promise<void> {
        const { data, error } = await supabase.rpc('add_online_scout_report', {
            competition_id_arg: report.competitionId,
            match_number_arg: report.matchNumber,
            team_number_arg: report.teamNumber,
            data_arg: report.data,
            timeline_data: report.timelineData,
            auto_path: report.autoPath,
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
        const { data, error } = await supabase.rpc('add_offline_scout_report', {
            competition_id_arg: report.competitionId,
            match_number_arg: report.matchNumber,
            team_number_arg: report.teamNumber,
            data_arg: report.data,
            created_at_arg: report.createdAt,
            timeline_data: report.timelineData,
            auto_path: report.autoPath,
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
        const { error } = await supabase.rpc('edit_online_scout_report', {
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
        const { data, error } = await supabase.rpc('get_scout_report_history', {
            report_id_arg: reportId,
        });
        if (error) throw error

        return data.map(x => ({
            historyId: x.id,
            editedAt: x.edited_at,
            editedById: x.edited_by_id,
            data: x.data,
            name: x.name,
        }))
    }
}

export default ScoutReportsDB;
