alter table "public"."pit_scout_reports" add column "competition_id" integer not null;

alter table "public"."pit_scout_reports" enable row level security;

alter table "public"."pit_scout_reports" add constraint "pit_scout_reports_competition_id_fkey" FOREIGN KEY (competition_id) REFERENCES competitions(id) not valid;

alter table "public"."pit_scout_reports" validate constraint "pit_scout_reports_competition_id_fkey";

create policy "Everyone in a team can create pit scout reports"
on "public"."pit_scout_reports"
as permissive
for insert
to public
with check ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id
   FROM competitions
  WHERE (competitions.id = pit_scout_reports.competition_id))));


create policy "Those in a team can view their pit scout reports"
on "public"."pit_scout_reports"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id
   FROM competitions
  WHERE (competitions.id = pit_scout_reports.competition_id))));

CREATE POLICY "Authenticated users of a team can write" ON "storage"."objects" FOR insert WITH CHECK (((bucket_id = 'organizations'::text) AND (((storage.foldername(name))[1])::integer = ( SELECT user_attributes.organization_id FROM user_attributes WHERE (user_attributes.id = auth.uid())))));
CREATE POLICY "Authenticated users of a team can read" ON "storage"."objects" FOR select USING (((bucket_id = 'organizations'::text) AND (((storage.foldername(name))[1])::integer = ( SELECT user_attributes.organization_id FROM user_attributes WHERE (user_attributes.id = auth.uid())))));
