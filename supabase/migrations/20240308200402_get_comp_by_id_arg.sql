drop function if exists "public"."get_competition_by_id"(id integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_competition_by_id(id_arg integer)
 RETURNS TABLE(competition_id integer, competition_name text, start_time timestamp with time zone, end_time timestamp with time zone, form_id integer, scout_assignments_config scout_assignments_config, tba_event_id integer, organization_id integer, pit_scout_form_id integer, form_structure jsonb, pit_scout_form_structure jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
        SELECT
            c.id AS competition_id,
            c.name AS competition_name,
            c.start_time,
            c.end_time,
            c.form_id,
            c.scout_assignments_config,
            c.tba_event_id,
            c.organization_id,
            c.pit_scout_form_id,
            f1.form_structure AS form_structure,
            f2.form_structure AS pit_scout_form_structure
        FROM
            competitions c
        LEFT JOIN
            forms f1 ON c.form_id = f1.id
        LEFT JOIN
            forms f2 ON c.pit_scout_form_id = f2.id
        WHERE
            c.id = id_arg;
END;
$function$
;


