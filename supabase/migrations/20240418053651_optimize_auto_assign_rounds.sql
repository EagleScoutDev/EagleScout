set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.assign_rounds(competition_id_arg integer, user_ids uuid[], number_of_rounds integer, number_of_rounds_in_shift integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$declare
currentUserIdx integer;
currentMatchStart integer;
currentPosIdx integer;
stopIdx integer;
posEnum scout_assignments_robot_position;
begin

currentUserIdx := 1;
currentMatchStart := 1;
currentPosIdx := 0;

while currentMatchStart < number_of_rounds loop
for pos in 1..6 loop

  IF pos = 1 THEN
    posEnum = 'bc';
  ELSEIF pos = 2 THEN
    posEnum = 'bm';
  ELSEIF pos = 3 THEN
    posEnum = 'bf';
  ELSEIF pos = 4 THEN
    posEnum = 'rc';
  ELSEIF pos = 5 THEN
    posEnum = 'rm';
  ELSEIF pos = 6 THEN
    posEnum = 'rf';
  END IF;

  IF currentMatchStart+number_of_rounds_in_shift-1 < number_of_rounds THEN
    stopIdx = currentMatchStart+number_of_rounds_in_shift-1;
  ELSE
    stopIdx = number_of_rounds;
  END IF;

  INSERT INTO scout_assignments_position_based (competition_id, user_id, match_number, robot_position)
            SELECT competition_id_arg, user_ids[currentUserIdx], match_number, posEnum
            FROM generate_series(currentMatchStart, LEAST(currentMatchStart + number_of_rounds_in_shift - 1, number_of_rounds)) AS match_number
            ON CONFLICT (competition_id, match_number, robot_position)
            DO UPDATE SET user_id = EXCLUDED.user_id;

  IF currentUserIdx = array_length(user_ids, 1) THEN
    currentUserIdx = 1;
  ELSE
    currentUserIdx = currentUserIdx + 1;
  END IF;

end loop;

currentMatchStart := currentMatchStart + number_of_rounds_in_shift;

end loop;

end;$function$
;


