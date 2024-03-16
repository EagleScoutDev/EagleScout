drop trigger if exists "validate_form_trigger" on "public"."forms";

alter table "public"."notes" add column "organization_id" integer not null;

alter table "public"."notes" enable row level security;

alter table "public"."notes" add constraint "notes_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_organization_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.note_before_insert_tasks()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  new.created_by = auth.uid();
  new.organization_id := (select organization_id from user_attributes where id = auth.uid());
  RETURN new;
END;$function$
;

create policy "Allow users in an org to view their reports"
on "public"."notes"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id));


create policy "Anyone on a team can insert notes"
on "public"."notes"
as permissive
for insert
to authenticated
with check (true);


CREATE TRIGGER set_created_by_notes AFTER INSERT ON public.notes FOR EACH STATEMENT EXECUTE FUNCTION note_before_insert_tasks();

CREATE TRIGGER validate_form_trigger BEFORE INSERT ON public.forms FOR EACH ROW EXECUTE FUNCTION validate_form();


