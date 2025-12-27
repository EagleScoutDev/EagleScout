import { supabase } from "@/lib/supabase";
import { Form } from "@/lib/forms";

interface Competition {
    name: string;
    startTime: Date;
    endTime: Date;
    formId: number;
    pitScoutFormId: number;
}

export enum ScoutAssignmentsConfig {
    DISABLED,
    TEAM_BASED,
    POSITION_BASED,
}

export interface CompetitionReturnData extends Competition {
    id: number;
    form: Form.Structure;
    scoutAssignmentsConfig: ScoutAssignmentsConfig;
    pitScoutFormStructure: Form.Structure;
}

export class CompetitionsDB {
    static async getCompetitions(): Promise<CompetitionReturnData[]> {
        const { data, error } = await supabase.rpc("list_all_competitions");
        if (error) {
            throw error;
        } else {
            return data.map((competition) => {
                let scoutAssignmentsConfig: ScoutAssignmentsConfig;
                if (competition.scout_assignments_config === "team_based") {
                    scoutAssignmentsConfig = ScoutAssignmentsConfig.TEAM_BASED;
                } else if (competition.scout_assignments_config === "position_based") {
                    scoutAssignmentsConfig = ScoutAssignmentsConfig.POSITION_BASED;
                } else {
                    scoutAssignmentsConfig = ScoutAssignmentsConfig.DISABLED;
                }
                return {
                    id: competition.competition_id,
                    name: competition.competition_name,
                    startTime: competition.start_time,
                    endTime: competition.end_time,
                    formId: competition.form_id,
                    form: competition.form_structure,
                    scoutAssignmentsConfig: scoutAssignmentsConfig,
                    pitScoutFormId: competition.pit_scout_form_id,
                    pitScoutFormStructure: competition.pit_scout_form_structure,
                };
            });
        }
    }

    static async getCurrentCompetition(): Promise<CompetitionReturnData | null> {
        const { data, error } = await supabase.rpc("get_current_competition");
        if (error) {
            throw error;
        } else {
            if (data.length === 0) {
                return null;
            } else {
                let scoutAssignmentsConfig: ScoutAssignmentsConfig;
                if (data[0].scout_assignments_config === "team_based") {
                    scoutAssignmentsConfig = ScoutAssignmentsConfig.TEAM_BASED;
                } else if (data[0].scout_assignments_config === "position_based") {
                    scoutAssignmentsConfig = ScoutAssignmentsConfig.POSITION_BASED;
                } else {
                    scoutAssignmentsConfig = ScoutAssignmentsConfig.DISABLED;
                }
                return {
                    id: data[0].competition_id,
                    name: data[0].competition_name,
                    startTime: data[0].start_time,
                    endTime: data[0].end_time,
                    formId: data[0].form_id,
                    form: data[0].form_structure,
                    scoutAssignmentsConfig: scoutAssignmentsConfig,
                    pitScoutFormId: data[0].pit_scout_form_id,
                    pitScoutFormStructure: data[0].pit_scout_form_structure,
                };
            }
        }
    }

    static async createCompetition(competition: Competition): Promise<void> {
        const { data, error } = await supabase.from("competitions").insert({
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
        const { data, error } = await supabase
            .from("competitions")
            .select("tba_events ( teams )")
            .eq("id", competitionId)
            .single();
        if (error) {
            throw error;
        } else {
            console.log(data);
            return data.tba_events.teams;
        }
    }

    static async getCompetitionTBAKey(competitionId: number): Promise<string> {
        const { data, error } = await supabase
            .from("competitions")
            .select("tba_events ( event_key )")
            .eq("id", competitionId)
            .single();
        if (error) {
            throw error;
        } else {
            return data.tba_events.event_key;
        }
    }

    static async getCompetitionById(competitionId: number): Promise<CompetitionReturnData> {
        const { data, error } = await supabase.rpc("get_competition_by_id", {
            id_arg: competitionId,
        });
        // .from('competitions')
        // .select('*, forms( form_structure )')
        // .eq('id', competitionId)
        // .single();
        if (error) {
            throw error;
        } else {
            let scoutAssignmentsConfig: ScoutAssignmentsConfig;
            if (data.scout_assignments_config === "team_based") {
                scoutAssignmentsConfig = ScoutAssignmentsConfig.TEAM_BASED;
            } else if (data.scout_assignments_config === "position_based") {
                scoutAssignmentsConfig = ScoutAssignmentsConfig.POSITION_BASED;
            } else {
                scoutAssignmentsConfig = ScoutAssignmentsConfig.DISABLED;
            }
            return {
                id: data[0].competition_id,
                name: data[0].competition_name,
                startTime: data[0].start_time,
                endTime: data[0].end_time,
                formId: data[0].form_id,
                form: data[0].form_structure,
                scoutAssignmentsConfig: scoutAssignmentsConfig,
                pitScoutFormId: data[0].pit_scout_form_id,
                pitScoutFormStructure: data[0].pit_scout_form_structure,
            };
        }
    }
}
