alter table "public"."competitions" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_competition_team_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.team := current_user_id();
  return new;
end;
$function$
;

create policy "Admins can create competitions."
on "public"."competitions"
as permissive
for insert
to public
with check (((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = team_id) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Admins can delete competitions."
on "public"."competitions"
as permissive
for delete
to public
using (((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = team_id) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Admins can update competitions."
on "public"."competitions"
as permissive
for update
to public
using ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = team_id))
with check (( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())));


create policy "Competitions are viewable by those in the team."
on "public"."competitions"
as permissive
for select
to public
using ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = team_id));


CREATE TRIGGER on_competition_created BEFORE INSERT ON public.competitions FOR EACH ROW EXECUTE FUNCTION set_competition_team_id();


