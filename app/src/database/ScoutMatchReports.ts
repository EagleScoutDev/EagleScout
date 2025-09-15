import { supabase } from '../lib/supabase';
import type { CrescendoAutoPath } from '../components/games/crescendo/CrescendoAutoPath';
import type { ReefscapeAutoPath } from '../components/games/reefscape/ReefscapeAutoPath';

interface TimelineElement {
    time: number;
    label: string;
}

interface MatchReport {
    reportId: number;
    matchNumber: number;
    teamNumber: number;
    data: any[];
    competitionId: number;
    timelineData?: TimelineElement[];
    autoPath?: CrescendoAutoPath | ReefscapeAutoPath;
}

interface MatchReportWithDate extends MatchReport {
    createdAt: Date;
}

export interface MatchReportReturnData extends MatchReportWithDate {
    form: [];
    userId: string;
    userName?: string;
    competitionName: string;
}

export interface MatchReportHistory {
    // id col in db
    historyId: number;
    editedAt: Date;
    // the editor's uuid
    editedById: string;
    data: [];
    // the editor's name
    name: string;
}

export class MatchReportsDB {
    static async getReportsForCompetition(
        id: number,
        fetchUserNames = false,
    ): Promise<MatchReportReturnData[]> {
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

    static async getReportsForSelf(): Promise<MatchReportReturnData[]> {
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
    ): Promise<MatchReportReturnData[]> {
        const res: MatchReportReturnData[] = [];
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
    ): Promise<MatchReportReturnData[]> {
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

    static async createOnlineScoutReport(report: MatchReport): Promise<void> {
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
        report: MatchReportWithDate,
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
    ): Promise<MatchReportHistory[]> {
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
