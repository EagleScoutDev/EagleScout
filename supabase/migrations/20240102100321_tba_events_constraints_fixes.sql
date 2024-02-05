alter table "public"."matches" drop constraint "matches_competition_id_fkey";

alter table "public"."scout_reports" drop constraint "scout_reports_match_id_fkey";

drop function if exists "public"."add_tba_event"(event_key_arg text, start_date_arg timestamp with time zone, end_date_arg timestamp with time zone, matches jsonb);

alter table "public"."tba_events" add column "teams" jsonb;

alter table "public"."matches" add constraint "matches_competition_id_fkey" FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE not valid;

alter table "public"."matches" validate constraint "matches_competition_id_fkey";

alter table "public"."scout_reports" add constraint "scout_reports_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE not valid;

alter table "public"."scout_reports" validate constraint "scout_reports_match_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_tba_event(event_key_arg text, start_date_arg timestamp with time zone, end_date_arg timestamp with time zone, matches jsonb, teams jsonb)
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
  INSERT INTO tba_events (event_key, start_date, end_date, teams) VALUES (event_key_arg, start_date_arg, end_date_arg, teams) returning id into event_id_var;
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


