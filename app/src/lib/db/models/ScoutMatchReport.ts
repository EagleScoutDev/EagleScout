import { supabase } from "@/lib/supabase";
import * as Rebuilt from "@/frc/rebuilt";
import { Form } from "@/lib/forms";

export interface TimelineElement {
    time: number;
    label: string;
}

export interface MatchReport {
    reportId: number;
    matchNumber: number;
    teamNumber: number;
    data: any[];
    competitionId: number;
    timelineData?: TimelineElement[];
    autoPath?: Rebuilt.AutoPath;
}

export interface MatchReportWithDate extends MatchReport {
    createdAt: string;
}

export interface MatchReportReturnData extends MatchReportWithDate {
    form: Form.Structure;
    userId: string;
    userName?: string;
    competitionName: string;
}

export interface MatchReportHistory {
    historyId: number;
    editedAt: Date;
    editedById: string;
    data: any[];
    name: string;
}

export namespace ScoutMatchReports {
    const reportQuery = () =>
        supabase.from("scout_reports").select(`
            reportId:       id,
            teamNumber:     team,
            data,
            timelineData:   timeline_data,
            autoPath:       auto_path,
            ...matches!inner(
                matchNumber:    number,
                competitionId:  competition_id,
                ...competitions(
                    competitionName:    name,
                    ...forms!competitions_form_id_fkey(
                        form:   form_structure
                    )
                )
            ),
            createdAt:      created_at,
            ...profiles(
                userId:     id,
                userName:   name
            )
        `);

    export async function getAllForTeam(
        teamNumber: number,
        competitionId: number,
    ): Promise<MatchReportReturnData[]> {
        const { data, error } = await reportQuery()
            .eq("team", teamNumber)
            .eq("matches.competition_id", competitionId);
        if (error) throw error;

        return data;
    }

    export async function getAllForTeams(
        teams: number[],
        competitionId: number,
    ): Promise<MatchReportReturnData[][]> {
        const { data, error } = await reportQuery()
            .eq("matches.competition_id", competitionId)
            .in("team", teams);
        if (error) throw error;

        return teams.map((team) => data.filter((r) => r.teamNumber === team));
    }

    export async function getAllForComp(
        competitionId: number,
    ): Promise<MatchReportReturnData[]> {
        const { data, error } = await reportQuery().eq(
            "matches.competition_id",
            competitionId,
        );
        if (error) throw error;

        return data;
    }

    // FIXME: impure queries are below

    export async function getHistory(
        reportId: number,
    ): Promise<MatchReportHistory[]> {
        // FIXME: the .edited_by_id column of scout_report_history joins to auth.users, so we can't query it from the client
        const { data, error } = await supabase.rpc("get_scout_report_history", {
            report_id_arg: reportId,
        });
        if (error) throw error;

        return data.map((x) => ({
            historyId: x.id,
            editedAt: new Date(x.edited_at),
            editedById: x.edited_by_id,
            data: x.data,
            name: x.name,
        }));
    }

    export async function getAllForSelf(
        competitionId: number,
    ): Promise<MatchReportReturnData[]> {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user == null) throw new Error("User not logged in");

        const { data, error } = await reportQuery()
            .eq("user_id", user.id)
            .eq("matches.competition_id", competitionId);
        if (error) throw error;

        return data;
    }

    // FIXME: impure queries are below

    export async function create(
        matchNumber: number,
        teamNumber: number,
        data: any[],
        competitionId: number,
        timelineData?: TimelineElement[],
        autoPath?: Rebuilt.AutoPath,
    ): Promise<void> {
        const { error } = await supabase.rpc("add_online_scout_report", {
            competition_id_arg: competitionId,
            match_number_arg: matchNumber,
            team_number_arg: teamNumber,
            data_arg: data,
            timeline_data: timelineData,
            auto_path: autoPath,
        });
        if (error) throw error;
    }

    export async function edit(
        reportId: number,
        newData: any[],
    ): Promise<void> {
        const { error } = await supabase.rpc("edit_online_scout_report", {
            report_id_arg: reportId,
            data_arg: newData,
        });
        if (error) throw error;
    }
}
