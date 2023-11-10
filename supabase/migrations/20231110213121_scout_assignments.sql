create type "public"."tba_alliance" as enum ('red', 'blue');

create type "public"."tba_match_type" as enum ('qm', 'ef', 'qf', 'sf', 'f');

alter table "public"."competitions" drop constraint "competitions_tba_event_fkey";

drop function if exists "public"."add_tba_event"(event_key_arg text, matches jsonb);

alter table "public"."competitions" drop column "tba_event";

alter table "public"."competitions" add column "tba_event_id" integer;

alter table "public"."scout_assignments" alter column "match_id" set not null;

alter table "public"."scout_assignments" alter column "user_id" set not null;

alter table "public"."tba_events" add column "end_date" timestamp with time zone;

alter table "public"."tba_events" add column "start_date" timestamp with time zone;

alter table "public"."tba_matches" add column "comp_level" tba_match_type;

alter table "public"."tba_matches" alter column "alliance" drop not null;

alter table "public"."tba_matches" alter column "alliance" set data type tba_alliance using "alliance"::text::tba_alliance;

alter table "public"."tba_matches" alter column "team" set data type text using "team"::text;

drop type "public"."alliance";

CREATE UNIQUE INDEX scout_assignments_competition_id_match_id_unique ON public.scout_assignments USING btree (competition_id, match_id);

alter table "public"."scout_assignments" add constraint "scout_assignments_competition_id_match_id_unique" UNIQUE using index "scout_assignments_competition_id_match_id_unique";

alter table "public"."competitions" add constraint "competitions_tba_event_fkey" FOREIGN KEY (tba_event_id) REFERENCES tba_events(id) not valid;

alter table "public"."competitions" validate constraint "competitions_tba_event_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_tba_event(event_key_arg text, start_date_arg timestamp with time zone, end_date_arg timestamp with time zone, matches jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
  event_id_var integer;
  match_elem jsonb;
  match_team_json_keys TEXT[] := ARRAY['team_red_1', 'team_red_2', 'team_red_3', 'team_blue_1', 'team_blue_2', 'team_blue_3'];
  match_team TEXT;
  alliance tba_alliance;
BEGIN
IF NOT EXISTS (SELECT 1 FROM tba_events WHERE event_key = event_key_arg) THEN
  INSERT INTO tba_events (event_key, start_date, end_date) VALUES (event_key_arg, start_date_arg, end_date_arg) returning id into event_id_var;
END IF;

SELECT id INTO event_id_var FROM tba_events WHERE event_key = event_key_arg;

FOR match_elem IN SELECT * FROM jsonb_array_elements(matches)
LOOP
  FOREACH match_team IN ARRAY match_team_json_keys
  LOOP
    IF EXISTS (SELECT 1 FROM tba_matches WHERE event_id = event_id_var AND match=CAST(match_elem->>'match_number' AS integer) AND team = match_elem->>match_team AND comp_level = CAST(match_elem->>'comp_level' AS tba_match_type))
    THEN
      UPDATE tba_matches SET predicted_time = CAST(match_elem->>'predicted_time' AS timestamp with time zone) WHERE event_id = event_id_var AND match=CAST(match_elem->>'match_number' AS integer) AND team = match_elem->>match_team AND predicted_time <> CAST(match_elem->>'predicted_time' AS timestamp with time zone);
    ELSE
      IF POSITION('blue' IN match_team) > 0 THEN
        alliance = 'blue';
      ELSE
        alliance = 'red';
      END IF;
      INSERT INTO tba_matches(event_id, team, match, predicted_time, alliance, comp_level) VALUES (event_id_var, match_elem->>match_team, CAST(match_elem->>'match_number' AS integer), CAST(match_elem->>'predicted_time' AS timestamp with time zone), alliance, CAST(match_elem->>'comp_level' AS tba_match_type));
    END IF;
  END LOOP;
END LOOP;

END;$function$
;

create policy "Everyone in a team can view scout assignments"
on "public"."scout_assignments"
as permissive
for select
to public
using ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = scout_assignments.competition_id))));


create policy "Only admins in a team can create scout assignments"
on "public"."scout_assignments"
as permissive
for insert
to public
with check (((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = scout_assignments.competition_id))) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Only admins in a team can delete scout assignments"
on "public"."scout_assignments"
as permissive
for delete
to public
using (((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = scout_assignments.competition_id))) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Only admins in a team can update scout assignments"
on "public"."scout_assignments"
as permissive
for update
to public
using ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = scout_assignments.competition_id))))
with check (( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())));


create policy "Enable read access for all users"
on "public"."tba_events"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."tba_matches"
as permissive
for select
to public
using (true);



