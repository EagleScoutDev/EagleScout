create table "public"."scout_reports" (
    "id" integer generated always as identity not null,
    "match_id" integer not null,
    "user_id" uuid not null,
    "data" json not null
);


alter table "public"."scout_reports" enable row level security;

alter table "public"."scout_reports" add constraint "scout_reports_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) not valid;

alter table "public"."scout_reports" validate constraint "scout_reports_match_id_fkey";

alter table "public"."scout_reports" add constraint "scout_reports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."scout_reports" validate constraint "scout_reports_user_id_fkey";

create policy "Everyone can delete their own scout reports and admins can dele"
on "public"."scout_reports"
as permissive
for delete
to public
using (((user_id = auth.uid()) OR ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Everyone can update their own scout reports."
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
with check ((user_id = auth.uid()));


create policy "Everyone in a team can create scout reports."
on "public"."scout_reports"
as permissive
for insert
to public
with check ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = ( SELECT matches.competition_id
           FROM matches
          WHERE (matches.id = scout_reports.match_id))))));


create policy "Scout reports are viewable by those in the team."
on "public"."scout_reports"
as permissive
for select
to public
using ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.team_id
   FROM competitions
  WHERE (competitions.id = ( SELECT matches.competition_id
           FROM matches
          WHERE (matches.id = scout_reports.match_id))))));



