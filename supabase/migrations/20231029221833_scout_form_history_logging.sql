create sequence "public"."scout_reports_edits_id_seq";

drop policy "Everyone can update their own scout reports." on "public"."scout_reports";

drop function if exists "public"."edit_online_scout_report"(match_number_arg integer, competition_id_arg integer, data_arg json);

create table "public"."scout_reports_edits" (
    "id" integer not null default nextval('scout_reports_edits_id_seq'::regclass),
    "scout_report_id" integer,
    "edited_by_id" uuid,
    "data" json,
    "edited_at" timestamp with time zone default now()
);


alter table "public"."scout_reports_edits" enable row level security;

alter table "public"."competitions" alter column "end_time" set data type timestamp with time zone using "end_time"::timestamp with time zone;

alter table "public"."competitions" alter column "start_time" set data type timestamp with time zone using "start_time"::timestamp with time zone;

--alter table "public"."forms" add column "created_at" timestamp with time zone default now();

--alter table "public"."forms" add column "name" text not null default ''::text;

alter sequence "public"."scout_reports_edits_id_seq" owned by "public"."scout_reports_edits"."id";

CREATE UNIQUE INDEX scout_reports_edits_pkey ON public.scout_reports_edits USING btree (id);

alter table "public"."scout_reports_edits" add constraint "scout_reports_edits_pkey" PRIMARY KEY using index "scout_reports_edits_pkey";

alter table "public"."scout_reports_edits" add constraint "scout_reports_edits_edited_by_id_fkey" FOREIGN KEY (edited_by_id) REFERENCES auth.users(id) not valid;

alter table "public"."scout_reports_edits" validate constraint "scout_reports_edits_edited_by_id_fkey";

alter table "public"."scout_reports_edits" add constraint "scout_reports_edits_scout_report_id_fkey" FOREIGN KEY (scout_report_id) REFERENCES scout_reports(id) not valid;

alter table "public"."scout_reports_edits" validate constraint "scout_reports_edits_scout_report_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.edit_online_scout_report(report_id_arg integer, data_arg json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    curr_report scout_reports;
    report_history_exists boolean;
BEGIN
    -- check if there exists a scout report with the given id
    SELECT * INTO curr_report FROM scout_reports WHERE id = report_id_arg;
    IF curr_report IS NULL THEN
       RAISE EXCEPTION 'Scout report not found';
    END IF;
    -- update the scout report
    UPDATE scout_reports
    SET data=data_arg
    WHERE id = report_id_arg;
    -- if there is no past/initial edit history for this report, create one as an initial edit
    report_history_exists := NOT EXISTS (SELECT 1 FROM scout_reports_edits WHERE scout_report_id = report_id_arg);
    IF report_history_exists THEN
       INSERT INTO scout_reports_edits (edited_by_id, scout_report_id, data, edited_at) VALUES (curr_report.user_id, report_id_arg, curr_report.data, curr_report.created_at);
    END IF;
    -- create a new edit history entry for this edit
    INSERT INTO scout_reports_edits (edited_by_id, scout_report_id, data)
    VALUES (auth.uid(), report_id_arg, data_arg);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_scout_report_history(report_id_arg integer)
 RETURNS TABLE(id integer, edited_at timestamp with time zone, edited_by_id uuid, data json, name text)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select scout_reports_edits.id, scout_reports_edits.edited_at, scout_reports_edits.edited_by_id, scout_reports_edits.data, profiles.name
  from scout_reports_edits
  join profiles on scout_reports_edits.edited_by_id = profiles.id
  where scout_report_id = report_id_arg
  order by edited_at DESC;
end;
$function$
;

create policy "Admins and scout report submitters can update their report"
on "public"."scout_reports"
as permissive
for update
to public
using ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = ( SELECT matches.competition_id
           FROM matches
          WHERE (matches.id = scout_reports.match_id))))))
with check (((user_id = auth.uid()) OR (( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = true)));


create policy "Enable insert for authenticated users only"
on "public"."scout_reports_edits"
as permissive
for insert
to authenticated
with check (true);


create policy "allow select to all (todo: change to team members only)"
on "public"."scout_reports_edits"
as permissive
for select
to public
using (true);
