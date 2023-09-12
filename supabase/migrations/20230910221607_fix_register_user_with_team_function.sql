set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.register_user_with_team(team_number integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  existing_team_id INTEGER;
  selected_team_id INTEGER;
BEGIN
  -- Check if the user is already registered with a team
  SELECT team_id INTO existing_team_id
  FROM public.user_attributes
  WHERE id = auth.uid();

  -- If the user is already registered with a team, raise an error
  IF existing_team_id IS NOT NULL THEN
    RAISE EXCEPTION 'User is already registered with a team';
  END IF;

  -- Get the team's id
  IF EXISTS (
    SELECT id
    FROM public.teams
    WHERE number = team_number
  ) THEN
    SELECT id INTO selected_team_id
    FROM public.teams
    WHERE number = team_number;
  ELSE
    RAISE EXCEPTION 'Team does not exist';
  END IF;

  -- Register the user with the specified team
  UPDATE public.user_attributes SET (team_id, scouter, admin) = (selected_team_id, FALSE, FALSE) WHERE id = auth.uid();
END;
$function$
;


