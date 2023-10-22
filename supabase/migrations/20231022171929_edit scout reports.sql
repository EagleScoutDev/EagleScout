set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.edit_online_scout_report(match_number_arg integer, competition_id_arg integer, data_arg json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$declare
  match_id_var integer;
  scout_report_id_var integer;
begin
  SELECT id INTO match_id_var
    FROM matches
    WHERE number = match_number_arg
        AND competition_id = competition_id_arg;
    
    IF match_id_var IS NULL THEN
      raise exception 'Match #% in competition % not found',
        match_number_arg, competition_id_arg;
    END IF;

  SELECT id INTO scout_report_id_var
    FROM scout_reports
    WHERE match_id=match_id_var
      AND user_id=auth.uid();
  
    IF scout_report_id_var IS NULL THEN
      raise exception 'Scout report for match id % not found',
        match_id_var;
    END IF;

  UPDATE scout_reports
  SET data=data_arg
  WHERE id=scout_report_id_var;
end;
$function$
;
