alter table "public"."scout_reports" add column "timeline_data" jsonb;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_offline_scout_report(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, created_at_arg timestamp with time zone, timeline_data jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  match_id_var integer;
begin
  SELECT id INTO match_id_var
    FROM matches
    WHERE number = match_number_arg
        AND competition_id = competition_id_arg;
    
    IF match_id_var IS NULL THEN
        INSERT INTO matches (number, competition_id)
        VALUES (match_number_arg, competition_id_arg)
        RETURNING id INTO match_id_var;
    END IF;

    insert into scout_reports (match_id, user_id, data, team, created_at, online, timeline_data)
    values (match_id_var, auth.uid(), data_arg, team_number_arg, created_at_arg, false, timeline_data);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_online_scout_report(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, timeline_data jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  match_id_var integer;
begin
  SELECT id INTO match_id_var
    FROM matches
    WHERE number = match_number_arg
        AND competition_id = competition_id_arg;
    
    IF match_id_var IS NULL THEN
        INSERT INTO matches (number, competition_id)
        VALUES (match_number_arg, competition_id_arg)
        RETURNING id INTO match_id_var;
    END IF;

    insert into scout_reports (match_id, user_id, data, team, online, timeline_data)
    values (match_id_var, auth.uid(), data_arg, team_number_arg, true, timeline_data);
end;
$function$
;


