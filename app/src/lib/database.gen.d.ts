export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "12.2.3 (519615d)";
    };
    public: {
        Tables: {
            collaborators: {
                Row: {
                    competition_id: number;
                    org_id: number;
                };
                Insert: {
                    competition_id: number;
                    org_id: number;
                };
                Update: {
                    competition_id?: number;
                    org_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "collaborators_competition_id_fkey";
                        columns: ["competition_id"];
                        isOneToOne: false;
                        referencedRelation: "competitions";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "collaborators_org_id_fkey";
                        columns: ["org_id"];
                        isOneToOne: false;
                        referencedRelation: "organizations";
                        referencedColumns: ["id"];
                    },
                ];
            };
            competitions: {
                Row: {
                    end_time: string;
                    form_id: number | null;
                    id: number;
                    name: string;
                    organization_id: number;
                    pit_scout_form_id: number | null;
                    scout_assignments_config: Database["public"]["Enums"]["scout_assignments_config"];
                    start_time: string;
                    tba_event_id: number;
                };
                Insert: {
                    end_time: string;
                    form_id?: number | null;
                    id?: number;
                    name: string;
                    organization_id: number;
                    pit_scout_form_id?: number | null;
                    scout_assignments_config?: Database["public"]["Enums"]["scout_assignments_config"];
                    start_time: string;
                    tba_event_id: number;
                };
                Update: {
                    end_time?: string;
                    form_id?: number | null;
                    id?: number;
                    name?: string;
                    organization_id?: number;
                    pit_scout_form_id?: number | null;
                    scout_assignments_config?: Database["public"]["Enums"]["scout_assignments_config"];
                    start_time?: string;
                    tba_event_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "competitions_form_id_fkey";
                        columns: ["form_id"];
                        isOneToOne: false;
                        referencedRelation: "forms";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "competitions_organization_id_fkey";
                        columns: ["organization_id"];
                        isOneToOne: false;
                        referencedRelation: "organizations";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "competitions_pit_scout_form_id_fkey";
                        columns: ["pit_scout_form_id"];
                        isOneToOne: false;
                        referencedRelation: "forms";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "competitions_tba_event_id_fkey";
                        columns: ["tba_event_id"];
                        isOneToOne: false;
                        referencedRelation: "tba_events";
                        referencedColumns: ["id"];
                    },
                ];
            };
            deletion_requests: {
                Row: {
                    processed: boolean;
                    reason: string | null;
                    requested_at: string;
                    user_id: string;
                };
                Insert: {
                    processed: boolean;
                    reason?: string | null;
                    requested_at?: string;
                    user_id: string;
                };
                Update: {
                    processed?: boolean;
                    reason?: string | null;
                    requested_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            forms: {
                Row: {
                    created_at: string;
                    form_structure: Json;
                    id: number;
                    name: string;
                    organization_id: number;
                    pit_scouting: boolean;
                };
                Insert: {
                    created_at?: string;
                    form_structure: Json;
                    id?: number;
                    name?: string;
                    organization_id: number;
                    pit_scouting?: boolean;
                };
                Update: {
                    created_at?: string;
                    form_structure?: Json;
                    id?: number;
                    name?: string;
                    organization_id?: number;
                    pit_scouting?: boolean;
                };
                Relationships: [
                    {
                        foreignKeyName: "forms_organization_id_fkey";
                        columns: ["organization_id"];
                        isOneToOne: false;
                        referencedRelation: "organizations";
                        referencedColumns: ["id"];
                    },
                ];
            };
            match_bets: {
                Row: {
                    alliance: string;
                    amount: number;
                    created_at: string;
                    id: number;
                    match_id: number;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    alliance: string;
                    amount: number;
                    created_at?: string;
                    id?: number;
                    match_id: number;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    alliance?: string;
                    amount?: number;
                    created_at?: string;
                    id?: number;
                    match_id?: number;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "fk_user_id";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "match_bets_match_id_fkey";
                        columns: ["match_id"];
                        isOneToOne: false;
                        referencedRelation: "matches";
                        referencedColumns: ["id"];
                    },
                ];
            };
            match_bets_results: {
                Row: {
                    id: number;
                    match_id: number;
                    result: string;
                };
                Insert: {
                    id?: number;
                    match_id: number;
                    result: string;
                };
                Update: {
                    id?: number;
                    match_id?: number;
                    result?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "match_bets_results_match_id_fkey";
                        columns: ["match_id"];
                        isOneToOne: false;
                        referencedRelation: "matches";
                        referencedColumns: ["id"];
                    },
                ];
            };
            matches: {
                Row: {
                    competition_id: number;
                    id: number;
                    number: number;
                };
                Insert: {
                    competition_id: number;
                    id?: number;
                    number: number;
                };
                Update: {
                    competition_id?: number;
                    id?: number;
                    number?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "matches_competition_id_fkey";
                        columns: ["competition_id"];
                        isOneToOne: false;
                        referencedRelation: "competitions";
                        referencedColumns: ["id"];
                    },
                ];
            };
            notes: {
                Row: {
                    content: string | null;
                    created_at: string;
                    created_by: string;
                    id: number;
                    match_id: number;
                    organization_id: number;
                    team_number: number;
                };
                Insert: {
                    content?: string | null;
                    created_at?: string;
                    created_by: string;
                    id?: number;
                    match_id: number;
                    organization_id: number;
                    team_number: number;
                };
                Update: {
                    content?: string | null;
                    created_at?: string;
                    created_by?: string;
                    id?: number;
                    match_id?: number;
                    organization_id?: number;
                    team_number?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "notes_created_by_fkey";
                        columns: ["created_by"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "notes_match_id_fkey";
                        columns: ["match_id"];
                        isOneToOne: false;
                        referencedRelation: "matches";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "notes_organization_id_fkey";
                        columns: ["organization_id"];
                        isOneToOne: false;
                        referencedRelation: "organizations";
                        referencedColumns: ["id"];
                    },
                ];
            };
            organizations: {
                Row: {
                    email: string | null;
                    id: number;
                    name: string | null;
                    number: number | null;
                };
                Insert: {
                    email?: string | null;
                    id?: never;
                    name?: string | null;
                    number?: number | null;
                };
                Update: {
                    email?: string | null;
                    id?: never;
                    name?: string | null;
                    number?: number | null;
                };
                Relationships: [];
            };
            picklist: {
                Row: {
                    competition_id: number;
                    created_at: string;
                    created_by: string;
                    id: number;
                    name: string;
                    teams: Json;
                };
                Insert: {
                    competition_id: number;
                    created_at?: string;
                    created_by: string;
                    id?: number;
                    name: string;
                    teams: Json;
                };
                Update: {
                    competition_id?: number;
                    created_at?: string;
                    created_by?: string;
                    id?: number;
                    name?: string;
                    teams?: Json;
                };
                Relationships: [
                    {
                        foreignKeyName: "picklist_competition_id_fkey";
                        columns: ["competition_id"];
                        isOneToOne: false;
                        referencedRelation: "competitions";
                        referencedColumns: ["id"];
                    },
                ];
            };
            pit_scout_reports: {
                Row: {
                    competition_id: number;
                    created_at: string;
                    data: Json;
                    id: number;
                    online: boolean;
                    team_id: number;
                    user_id: string;
                };
                Insert: {
                    competition_id: number;
                    created_at: string;
                    data: Json;
                    id?: number;
                    online?: boolean;
                    team_id: number;
                    user_id: string;
                };
                Update: {
                    competition_id?: number;
                    created_at?: string;
                    data?: Json;
                    id?: number;
                    online?: boolean;
                    team_id?: number;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "pit_scout_reports_competition_id_fkey";
                        columns: ["competition_id"];
                        isOneToOne: false;
                        referencedRelation: "competitions";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "pit_scout_reports_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
            };
            profiles: {
                Row: {
                    emoji: string;
                    first_name: string | null;
                    id: string;
                    last_name: string | null;
                    name: string | null;
                    scoutcoins: number;
                };
                Insert: {
                    emoji?: string;
                    first_name?: string | null;
                    id: string;
                    last_name?: string | null;
                    name?: string | null;
                    scoutcoins?: number;
                };
                Update: {
                    emoji?: string;
                    first_name?: string | null;
                    id?: string;
                    last_name?: string | null;
                    name?: string | null;
                    scoutcoins?: number;
                };
                Relationships: [];
            };
            register_team_requests: {
                Row: {
                    created_at: string;
                    email: string;
                    id: number;
                    processed: boolean;
                    team: number | null;
                };
                Insert: {
                    created_at?: string;
                    email: string;
                    id?: number;
                    processed?: boolean;
                    team?: number | null;
                };
                Update: {
                    created_at?: string;
                    email?: string;
                    id?: number;
                    processed?: boolean;
                    team?: number | null;
                };
                Relationships: [];
            };
            scout_assignments_position_based: {
                Row: {
                    competition_id: number;
                    id: number;
                    match_number: number;
                    robot_position: Database["public"]["Enums"]["scout_assignments_robot_position"];
                    user_id: string;
                };
                Insert: {
                    competition_id: number;
                    id?: number;
                    match_number: number;
                    robot_position: Database["public"]["Enums"]["scout_assignments_robot_position"];
                    user_id: string;
                };
                Update: {
                    competition_id?: number;
                    id?: number;
                    match_number?: number;
                    robot_position?: Database["public"]["Enums"]["scout_assignments_robot_position"];
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "scout_assignments_position_based_competition_id_fkey";
                        columns: ["competition_id"];
                        isOneToOne: false;
                        referencedRelation: "competitions";
                        referencedColumns: ["id"];
                    },
                ];
            };
            scout_assignments_team_based: {
                Row: {
                    competition_id: number;
                    id: number;
                    match_id: number;
                    user_id: string;
                };
                Insert: {
                    competition_id: number;
                    id?: number;
                    match_id: number;
                    user_id: string;
                };
                Update: {
                    competition_id?: number;
                    id?: number;
                    match_id?: number;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "scout_assignments_team_based_competition_id_fkey";
                        columns: ["competition_id"];
                        isOneToOne: false;
                        referencedRelation: "competitions";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "scout_assignments_team_based_match_id_fkey";
                        columns: ["match_id"];
                        isOneToOne: false;
                        referencedRelation: "tba_matches";
                        referencedColumns: ["id"];
                    },
                ];
            };
            scout_reports: {
                Row: {
                    auto_path: Json | null;
                    created_at: string;
                    data: Json;
                    id: number;
                    match_id: number;
                    online: boolean;
                    team: number;
                    timeline_data: Json | null;
                    user_id: string;
                };
                Insert: {
                    auto_path?: Json | null;
                    created_at: string;
                    data: Json;
                    id?: number;
                    match_id: number;
                    online?: boolean;
                    team: number;
                    timeline_data?: Json | null;
                    user_id: string;
                };
                Update: {
                    auto_path?: Json | null;
                    created_at?: string;
                    data?: Json;
                    id?: number;
                    match_id?: number;
                    online?: boolean;
                    team?: number;
                    timeline_data?: Json | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "scout_reports_match_id_fkey";
                        columns: ["match_id"];
                        isOneToOne: false;
                        referencedRelation: "matches";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "scout_reports_user_id_fkey1";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
            };
            scout_reports_edits: {
                Row: {
                    data: Json | null;
                    edited_at: string | null;
                    edited_by_id: string | null;
                    id: number;
                    scout_report_id: number | null;
                };
                Insert: {
                    data?: Json | null;
                    edited_at?: string | null;
                    edited_by_id?: string | null;
                    id?: number;
                    scout_report_id?: number | null;
                };
                Update: {
                    data?: Json | null;
                    edited_at?: string | null;
                    edited_by_id?: string | null;
                    id?: number;
                    scout_report_id?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "scout_reports_edits_scout_report_id_fkey";
                        columns: ["scout_report_id"];
                        isOneToOne: false;
                        referencedRelation: "scout_reports";
                        referencedColumns: ["id"];
                    },
                ];
            };
            scoutcoin_ledger: {
                Row: {
                    amount_change: number;
                    created_at: string;
                    description: string;
                    dest_user: string | null;
                    id: number;
                    src_user: string | null;
                };
                Insert: {
                    amount_change: number;
                    created_at?: string;
                    description: string;
                    dest_user?: string | null;
                    id?: number;
                    src_user?: string | null;
                };
                Update: {
                    amount_change?: number;
                    created_at?: string;
                    description?: string;
                    dest_user?: string | null;
                    id?: number;
                    src_user?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "scoutcoin_ledger_dest_user_fkey";
                        columns: ["dest_user"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "scoutcoin_ledger_src_user_fkey";
                        columns: ["src_user"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
            };
            tags: {
                Row: {
                    color: string | null;
                    created_at: string;
                    id: number;
                    name: string | null;
                    picklist_id: number;
                };
                Insert: {
                    color?: string | null;
                    created_at?: string;
                    id?: number;
                    name?: string | null;
                    picklist_id: number;
                };
                Update: {
                    color?: string | null;
                    created_at?: string;
                    id?: number;
                    name?: string | null;
                    picklist_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "public_tags_picklist_id_fkey";
                        columns: ["picklist_id"];
                        isOneToOne: false;
                        referencedRelation: "picklist";
                        referencedColumns: ["id"];
                    },
                ];
            };
            tba_events: {
                Row: {
                    end_date: string | null;
                    event_key: string;
                    id: number;
                    start_date: string | null;
                    teams: Json;
                };
                Insert: {
                    end_date?: string | null;
                    event_key: string;
                    id?: number;
                    start_date?: string | null;
                    teams: Json;
                };
                Update: {
                    end_date?: string | null;
                    event_key?: string;
                    id?: number;
                    start_date?: string | null;
                    teams?: Json;
                };
                Relationships: [];
            };
            tba_matches: {
                Row: {
                    alliance: Database["public"]["Enums"]["tba_alliance"] | null;
                    comp_level: Database["public"]["Enums"]["tba_match_type"] | null;
                    event_id: number;
                    id: number;
                    match: number;
                    predicted_time: string | null;
                    team: string;
                };
                Insert: {
                    alliance?: Database["public"]["Enums"]["tba_alliance"] | null;
                    comp_level?: Database["public"]["Enums"]["tba_match_type"] | null;
                    event_id: number;
                    id?: number;
                    match: number;
                    predicted_time?: string | null;
                    team: string;
                };
                Update: {
                    alliance?: Database["public"]["Enums"]["tba_alliance"] | null;
                    comp_level?: Database["public"]["Enums"]["tba_match_type"] | null;
                    event_id?: number;
                    id?: number;
                    match?: number;
                    predicted_time?: string | null;
                    team?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "tba_matches_event_id_fkey";
                        columns: ["event_id"];
                        isOneToOne: false;
                        referencedRelation: "tba_events";
                        referencedColumns: ["id"];
                    },
                ];
            };
            tba_teams: {
                Row: {
                    name: string;
                    number: number;
                };
                Insert: {
                    name: string;
                    number: number;
                };
                Update: {
                    name?: string;
                    number?: number;
                };
                Relationships: [];
            };
            user_attributes: {
                Row: {
                    admin: boolean | null;
                    id: string;
                    organization_id: number | null;
                    scouter: boolean | null;
                };
                Insert: {
                    admin?: boolean | null;
                    id: string;
                    organization_id?: number | null;
                    scouter?: boolean | null;
                };
                Update: {
                    admin?: boolean | null;
                    id?: string;
                    organization_id?: number | null;
                    scouter?: boolean | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_attributes_organization_id_fkey";
                        columns: ["organization_id"];
                        isOneToOne: false;
                        referencedRelation: "organizations";
                        referencedColumns: ["id"];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            add_offline_scout_report:
                | {
                      Args: {
                          competition_id_arg: number;
                          created_at_arg: string;
                          data_arg: Json;
                          match_number_arg: number;
                          team_number_arg: number;
                      };
                      Returns: undefined;
                  }
                | {
                      Args: {
                          auto_path: Json;
                          competition_id_arg: number;
                          created_at_arg: string;
                          data_arg: Json;
                          match_number_arg: number;
                          team_number_arg: number;
                          timeline_data: Json;
                      };
                      Returns: undefined;
                  };
            add_online_scout_report:
                | {
                      Args: {
                          competition_id_arg: number;
                          data_arg: Json;
                          match_number_arg: number;
                          team_number_arg: number;
                      };
                      Returns: undefined;
                  }
                | {
                      Args: {
                          auto_path: Json;
                          competition_id_arg: number;
                          data_arg: Json;
                          match_number_arg: number;
                          team_number_arg: number;
                          timeline_data: Json;
                      };
                      Returns: undefined;
                  };
            add_tba_event: {
                Args: {
                    end_date_arg: string;
                    event_key_arg: string;
                    matches: Json;
                    start_date_arg: string;
                    teams: Json;
                };
                Returns: undefined;
            };
            assign_rounds: {
                Args: {
                    competition_id_arg: number;
                    number_of_rounds: number;
                    number_of_rounds_in_shift: number;
                    user_ids: string[];
                };
                Returns: undefined;
            };
            change_scoutcoin_by: {
                Args: { amount: number; dest_user_id: string; src_user_id: string };
                Returns: undefined;
            };
            does_org_lack_admin:
                | { Args: { org_id_arg: number }; Returns: boolean }
                | { Args: { organization_id_arg: number }; Returns: boolean };
            edit_online_scout_report: {
                Args: { data_arg: Json; report_id_arg: number };
                Returns: undefined;
            };
            get_competition_by_id: {
                Args: { id_arg: number };
                Returns: {
                    competition_id: number;
                    competition_name: string;
                    end_time: string;
                    form_id: number;
                    form_structure: Json;
                    organization_id: number;
                    pit_scout_form_id: number;
                    pit_scout_form_structure: Json;
                    scout_assignments_config: Database["public"]["Enums"]["scout_assignments_config"];
                    start_time: string;
                    tba_event_id: number;
                }[];
            };
            get_current_competition: {
                Args: never;
                Returns: {
                    competition_id: number;
                    competition_name: string;
                    end_time: string;
                    form_id: number;
                    form_structure: Json;
                    organization_id: number;
                    pit_scout_form_id: number;
                    pit_scout_form_structure: Json;
                    scout_assignments_config: Database["public"]["Enums"]["scout_assignments_config"];
                    start_time: string;
                    tba_event_id: number;
                }[];
            };
            get_scout_report_history: {
                Args: { report_id_arg: number };
                Returns: {
                    data: Json;
                    edited_at: string;
                    edited_by_id: string;
                    id: number;
                    name: string;
                }[];
            };
            get_user_profiles: {
                Args: never;
                Returns: {
                    admin: boolean;
                    first_name: string;
                    id: string;
                    last_name: string;
                    scouter: boolean;
                }[];
            };
            get_user_profiles_with_email: {
                Args: never;
                Returns: {
                    admin: boolean;
                    email: string;
                    first_name: string;
                    id: string;
                    last_name: string;
                    scouter: boolean;
                }[];
            };
            is_same_organization: {
                Args: { user_1_id: string; user_2_id: string };
                Returns: boolean;
            };
            list_all_competitions: {
                Args: never;
                Returns: {
                    competition_id: number;
                    competition_name: string;
                    end_time: string;
                    form_id: number;
                    form_structure: Json;
                    organization_id: number;
                    pit_scout_form_id: number;
                    pit_scout_form_structure: Json;
                    scout_assignments_config: Database["public"]["Enums"]["scout_assignments_config"];
                    start_time: string;
                    tba_event_id: number;
                }[];
            };
            match_tie: { Args: { match_id: number }; Returns: undefined };
            match_winner: {
                Args: { change_amounts: Json[]; match_id: number; winner: string };
                Returns: undefined;
            };
            register_user_with_organization: {
                Args: { team_number: number };
                Returns: string;
            };
        };
        Enums: {
            scout_assignments_config: "disabled" | "position_based" | "team_based";
            scout_assignments_robot_position: "rf" | "rm" | "rc" | "bf" | "bm" | "bc";
            tba_alliance: "red" | "blue";
            tba_match_type: "qm" | "ef" | "qf" | "sf" | "f";
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
      ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
      ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
      : never;

export const Constants = {
    public: {
        Enums: {
            scout_assignments_config: ["disabled", "position_based", "team_based"],
            scout_assignments_robot_position: ["rf", "rm", "rc", "bf", "bm", "bc"],
            tba_alliance: ["red", "blue"],
            tba_match_type: ["qm", "ef", "qf", "sf", "f"],
        },
    },
} as const;
