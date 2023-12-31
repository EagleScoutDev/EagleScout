drop trigger if exists "on_competition_created" on "public"."competitions";

drop trigger if exists "set_created_by_picklist" on "public"."picklist";

drop policy "Enable read access for all users" on "public"."picklist";

drop policy "allow any authenticated user to update a picklist" on "public"."picklist";

drop policy "All users can see the teams registered on the app." on "public"."teams";

drop policy "Allow users to create new teams" on "public"."teams";

drop policy "Admins can create competitions." on "public"."competitions";

drop policy "Admins can delete competitions." on "public"."competitions";

drop policy "Admins can update competitions." on "public"."competitions";

drop policy "Competitions are viewable by those in the team." on "public"."competitions";

drop policy "Admins can add forms" on "public"."forms";

drop policy "Enable read access for all users in the team" on "public"."forms";

drop policy "Admins can delete matches." on "public"."matches";

drop policy "Everyone in a team can create matches." on "public"."matches";

drop policy "Matches are viewable by those in the team." on "public"."matches";

drop policy "Profiles are viewable by users who created them and others in t" on "public"."profiles";

drop policy "Everyone in a team can view scout assignments" on "public"."scout_assignments";

drop policy "Only admins in a team can create scout assignments" on "public"."scout_assignments";

drop policy "Only admins in a team can delete scout assignments" on "public"."scout_assignments";

drop policy "Only admins in a team can update scout assignments" on "public"."scout_assignments";

drop policy "Admins and scout report submitters can update their report" on "public"."scout_reports";

drop policy "Everyone in a team can create scout reports." on "public"."scout_reports";

drop policy "Scout reports are viewable by those in the team." on "public"."scout_reports";

drop policy "Admins can set user attributes in their team" on "public"."user_attributes";

drop policy "Users can see their own user attributes and everyone in a team " on "public"."user_attributes";

alter table "public"."competitions" drop constraint "competitions_team_id_fkey";

alter table "public"."forms" drop constraint "forms_team_id_fkey";

alter table "public"."teams" drop constraint "teams_number_key";

alter table "public"."user_attributes" drop constraint "user_attributes_team_id_fkey";

drop function if exists "public"."is_same_team"(user_1_id uuid, user_2_id uuid);

drop function if exists "public"."register_user_with_team"(team_number integer);

drop function if exists "public"."set_competition_team_id"();

drop function if exists "public"."set_created_by"();

alter table "public"."teams" drop constraint "teams_pkey";

drop index if exists "public"."teams_number_key";

drop index if exists "public"."teams_pkey";

drop table "public"."teams";

create table "public"."organizations" (
    "id" integer generated always as identity not null,
    "number" integer,
    "name" text
);


alter table "public"."organizations" enable row level security;

alter table "public"."competitions" drop column "team_id";

alter table "public"."competitions" add column "organization_id" integer not null;

alter table "public"."forms" drop column "team_id";

alter table "public"."forms" add column "organization_id" integer not null;

alter table "public"."picklist" add column "organization_id" integer;

alter table "public"."user_attributes" drop column "team_id";

alter table "public"."user_attributes" add column "organization_id" integer;

CREATE UNIQUE INDEX teams_number_key ON public.organizations USING btree (number);

CREATE UNIQUE INDEX teams_pkey ON public.organizations USING btree (id);

alter table "public"."organizations" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."competitions" add constraint "competitions_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."competitions" validate constraint "competitions_organization_id_fkey";

alter table "public"."forms" add constraint "forms_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."forms" validate constraint "forms_organization_id_fkey";

alter table "public"."organizations" add constraint "teams_number_key" UNIQUE using index "teams_number_key";

alter table "public"."picklist" add constraint "picklist_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."picklist" validate constraint "picklist_organization_id_fkey";

alter table "public"."user_attributes" add constraint "user_attributes_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."user_attributes" validate constraint "user_attributes_organization_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.competition_before_insert_tasks()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.organization_id := 1;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.is_same_organization(user_1_id uuid, user_2_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  team_1 integer;
  team_2 integer;
BEGIN
  select organization_id into team_1 from user_attributes where id = user_1_id;
  select organization_id into team_2 from user_attributes where id = user_2_id;

  return team_1 = team_2;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.picklist_before_insert_tasks()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  new.created_by = auth.uid();
  new.organization_id := (select organization_id from user_attributes where id = auth.uid());
  RETURN new;
END;$function$
;

CREATE OR REPLACE FUNCTION public.register_user_with_organization(organization_number integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  existing_organization_id INTEGER;
  selected_organization_id INTEGER;
BEGIN
  -- Check if the user is already registered with an organization
  SELECT organization_id INTO existing_organization_id
  FROM public.user_attributes
  WHERE id = auth.uid();

  -- If the user is already registered with a organization, raise an error
  IF existing_organization_id IS NOT NULL THEN
    RAISE EXCEPTION 'User is already registered with a organization';
  END IF;

  -- Get the organization's id
  IF EXISTS (
    SELECT id
    FROM public.organizations
    WHERE number = organization_number
  ) THEN
    SELECT id INTO selected_organization_id
    FROM public.organizations
    WHERE number = organization_number;
  ELSE
    RAISE EXCEPTION 'Organization does not exist';
  END IF;

  -- Register the user with the specified organization
  UPDATE public.user_attributes SET (organization_id, scouter, admin) = (selected_organization_id, FALSE, FALSE) WHERE id = auth.uid();
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_profiles_with_email()
 RETURNS TABLE(id uuid, first_name text, last_name text, scouter boolean, admin boolean, email character varying)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public,auth'
AS $function$
BEGIN
    RETURN QUERY
    select gup.*, auth.users.email as email from public.get_user_profiles() as gup inner join auth.users on gup.id = auth.users.id where 
        (select organization_id from public.user_attributes as ua where ua.id=gup.id) =
        (select organization_id from public.user_attributes as ua where ua.id=auth.uid());
END;
$function$
;

CREATE OR REPLACE FUNCTION public.validate_form()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare 
  form_structure jsonb := new.form_structure; 
  question jsonb;
begin

  if form_structure is null then 
    raise exception 'Form structure cannot be null';
  end if;

  for question in select * from jsonb_array_elements(form_structure)
  loop
    if not question ? 'type' then
      raise exception 'Question % is missing required type field', question->>'question';
    end if;

    case question->>'type' 
      when 'heading' then
        if not (question ? 'text' and question ? 'description' ) then
          raise exception 'Invalid heading question %', question->>'question';
        end if;

      when 'radio' then
        if not (question ? 'labels' and jsonb_typeof(question->'labels') = 'array' and
                question ? 'question' and 
                question ? 'required' and 
                question ? 'help' and
                question ? 'default' and 
                (question->>'default')::int >= 0 and (question->>'default')::int < jsonb_array_length(question->'labels')) then
          raise exception 'Invalid radio question %', question->>'question';  
        end if;

      when 'number' then
        if not (question ? 'question' and 
                question ? 'required' and
                question ? 'help' and
                question ? 'low' and 
                question ? 'high' and
                question ? 'step' and
                question ? 'slider' and
                question ? 'default') then
          raise exception 'Invalid number question %', question->>'question';
        end if;
        
      when 'textbox' then
        if not (question ? 'help' and 
                question ? 'question' and
                question ? 'required' and
                question ? 'default' and
                question ? 'placeholder') then
          raise exception 'Invalid textbox question %', question->>'question';
        end if;

      when 'checkbox' then
        if not (question ? 'labels' and jsonb_typeof(question->'labels') = 'array' and
                question ? 'question' and
                question ? 'required' and
                question ? 'help' and
                question ? 'default' and
                jsonb_array_length(question->'labels') = jsonb_array_length(question->'default')) then
          raise exception 'Invalid checkbox question %', question->>'question';
        end if;

      else
        raise exception 'Invalid question type %', question->>'type';
    end case;

  end loop;
  
  new.organization_id := (select organization_id from user_attributes where id = auth.uid());
  
  return new;
  
end;
$function$
;

create policy "All users can see the teams registered on the app."
on "public"."organizations"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users in an org"
on "public"."picklist"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id));


create policy "allow any authenticated user in an org to update a picklist"
on "public"."picklist"
as permissive
for update
to authenticated
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id))
with check (true);


create policy "Admins can create competitions."
on "public"."competitions"
as permissive
for insert
to public
with check (((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Admins can delete competitions."
on "public"."competitions"
as permissive
for delete
to public
using (((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Admins can update competitions."
on "public"."competitions"
as permissive
for update
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id))
with check (( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())));


create policy "Competitions are viewable by those in the team."
on "public"."competitions"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id));


create policy "Admins can add forms"
on "public"."forms"
as permissive
for insert
to authenticated
with check ((( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) AND (( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) IS NOT NULL)));


create policy "Enable read access for all users in the team"
on "public"."forms"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id));


create policy "Admins can delete matches."
on "public"."matches"
as permissive
for delete
to public
using (((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = matches.competition_id))) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Everyone in a team can create matches."
on "public"."matches"
as permissive
for insert
to public
with check ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = matches.competition_id))));


create policy "Matches are viewable by those in the team."
on "public"."matches"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = matches.competition_id))));


create policy "Profiles are viewable by users who created them and others in t"
on "public"."profiles"
as permissive
for select
to public
using (((auth.uid() = id) OR is_same_organization(id, auth.uid())));


create policy "Everyone in a team can view scout assignments"
on "public"."scout_assignments"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = scout_assignments.competition_id))));


create policy "Only admins in a team can create scout assignments"
on "public"."scout_assignments"
as permissive
for insert
to public
with check (((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = scout_assignments.competition_id))) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Only admins in a team can delete scout assignments"
on "public"."scout_assignments"
as permissive
for delete
to public
using (((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = scout_assignments.competition_id))) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))));


create policy "Only admins in a team can update scout assignments"
on "public"."scout_assignments"
as permissive
for update
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = scout_assignments.competition_id))))
with check (( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())));


create policy "Admins and scout report submitters can update their report"
on "public"."scout_reports"
as permissive
for update
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = ( SELECT matches.competition_id
           FROM matches
          WHERE (matches.id = scout_reports.match_id))))))
with check (((user_id = auth.uid()) OR (( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = true)));


create policy "Everyone in a team can create scout reports."
on "public"."scout_reports"
as permissive
for insert
to public
with check ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = ( SELECT matches.competition_id
           FROM matches
          WHERE (matches.id = scout_reports.match_id))))));


create policy "Scout reports are viewable by those in the team."
on "public"."scout_reports"
as permissive
for select
to public
using ((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = ( SELECT competitions.organization_id AS team_id
   FROM competitions
  WHERE (competitions.id = ( SELECT matches.competition_id
           FROM matches
          WHERE (matches.id = scout_reports.match_id))))));


create policy "Admins can set user attributes in their team"
on "public"."user_attributes"
as permissive
for update
to public
using ((is_same_organization(id, auth.uid()) AND ( SELECT user_attributes_1.admin
   FROM user_attributes user_attributes_1
  WHERE (user_attributes_1.id = auth.uid()))));


create policy "Users can see their own user attributes and everyone in a team "
on "public"."user_attributes"
as permissive
for select
to public
using ((is_same_organization(id, auth.uid()) OR (auth.uid() = id)));


CREATE TRIGGER on_competition_created BEFORE INSERT ON public.competitions FOR EACH ROW EXECUTE FUNCTION competition_before_insert_tasks();

CREATE TRIGGER set_created_by_picklist BEFORE INSERT ON public.picklist FOR EACH ROW EXECUTE FUNCTION picklist_before_insert_tasks();


