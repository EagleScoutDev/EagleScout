alter table "public"."matches" enable row level security;

create policy "Admins can delete matches."
on "public"."matches"
as permissive
for delete
to public
using (((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = matches.competition_id))) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Everyone in a team can create matches."
on "public"."matches"
as permissive
for insert
to public
with check ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = matches.competition_id))));


create policy "Matches are viewable by those in the team."
on "public"."matches"
as permissive
for select
to public
using ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = matches.competition_id))));



