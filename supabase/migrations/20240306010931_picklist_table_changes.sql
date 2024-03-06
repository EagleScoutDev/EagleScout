drop policy "Enable delete for admins and creators" on "public"."picklist";

drop policy "Enable read access for all users in an org" on "public"."picklist";

drop policy "allow any authenticated user in an org to update a picklist" on "public"."picklist";

alter table "public"."picklist" drop constraint "picklist_organization_id_fkey";

alter table "public"."picklist" drop column "organization_id";

alter table "public"."picklist" add column "competition_id" integer not null;

alter table "public"."picklist" add constraint "picklist_competition_id_fkey" FOREIGN KEY (competition_id) REFERENCES competitions(id) not valid;

alter table "public"."picklist" validate constraint "picklist_competition_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.picklist_before_insert_tasks()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  new.created_by = auth.uid();
  RETURN new;
END;$function$
;

create policy "Enable delete for admins and creators"
on "public"."picklist"
as permissive
for delete
to public
using ((((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id
   FROM competitions
  WHERE (competitions.id = picklist.competition_id))) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))) OR (created_by = auth.uid())));


create policy "Enable read access for all users in an org"
on "public"."picklist"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id
   FROM competitions
  WHERE (competitions.id = picklist.competition_id))));


create policy "allow any authenticated user in an org to update a picklist"
on "public"."picklist"
as permissive
for update
to authenticated
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id
   FROM competitions
  WHERE (competitions.id = picklist.competition_id))))
with check (true);



