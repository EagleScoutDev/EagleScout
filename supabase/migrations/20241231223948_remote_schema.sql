drop function if exists "public"."add_offline_scout_report"(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, created_at_arg timestamp with time zone, timeline_data jsonb, auto_path jsonb);

alter table "public"."competitions" alter column "id" set generated by default;

alter table "public"."matches" alter column "id" set generated by default;

alter table "public"."profiles" alter column "emoji" set default '🙂'::text;

alter table "public"."register_team_requests" add column "processed" boolean not null default false;

CREATE INDEX main_index ON public.scout_assignments_position_based USING btree (competition_id, match_number, robot_position);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.does_org_lack_admin(org_id_arg integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (SELECT COUNT(*) = 0 FROM user_attributes WHERE organization_id = org_id_arg AND admin = true);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.does_org_lack_admin(organization_id_arg bigint)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (SELECT COUNT(*) = 0 FROM user_attributes WHERE organization_id = organization_id_arg AND admin = true);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_offline_scout_report(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, created_at_arg timestamp with time zone, timeline_data jsonb, auto_path jsonb)
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

    insert into scout_reports (match_id, user_id, data, team, created_at, online, timeline_data, auto_path)
    values (match_id_var, auth.uid(), data_arg, team_number_arg, created_at_arg, false, timeline_data, auto_path);

    update profiles
    set scoutcoins = scoutcoins + 10
    where id = auth.uid();
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_online_scout_report(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, timeline_data jsonb, auto_path jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$declare
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

    insert into scout_reports (match_id, user_id, data, team, online, timeline_data, auto_path)
    values (match_id_var, auth.uid(), data_arg, team_number_arg, true, timeline_data, auto_path);
end;$function$
;

create policy "admin can change matches"
on "public"."matches"
as permissive
for insert
to service_role
with check (true);


CREATE TRIGGER "Register Team Email Trigger" AFTER INSERT ON public.register_team_requests FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://ltbaymxtkftdtqyjjuoi.supabase.co/functions/v1/register-team-email-trigger', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0YmF5bXh0a2Z0ZHRxeWpqdW9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MzkzNjI2MywiZXhwIjoyMDA5NTEyMjYzfQ.vKsVHusMDnIEeXgxVtxwC8-44s15hQg-k6f9zYBnTec"}', '{}', '1000');


