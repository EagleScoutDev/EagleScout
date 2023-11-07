drop function if exists "public"."add_offline_scout_report"(competition_id_arg integer, match_number_arg integer, team_number_arg integer, form_id_arg integer, data_arg jsonb, created_at_arg timestamp with time zone);

drop function if exists "public"."add_online_scout_report"(competition_id_arg integer, match_number_arg integer, team_number_arg integer, form_id_arg integer, data_arg jsonb);


