set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_same_team(user_1_id uuid, user_2_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  team_1 integer;
  team_2 integer;
BEGIN
  select team_id into team_1 from user_attributes where id = user_1_id;
  select team_id into team_2 from user_attributes where id = user_2_id;

  return team_1 = team_2;
END;
$function$
;

create policy "Admins can set user attributes in their team"
on "public"."user_attributes"
as permissive
for update
to public
using ((is_same_team(id, auth.uid()) AND ( SELECT user_attributes_1.admin
   FROM user_attributes user_attributes_1
  WHERE (user_attributes_1.id = auth.uid()))));


create policy "Users can see their own user attributes and everyone in a team "
on "public"."user_attributes"
as permissive
for select
to public
using ((is_same_team(id, auth.uid()) OR (auth.uid() = id)));



