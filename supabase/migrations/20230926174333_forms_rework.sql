drop policy "Enable read access for all users" on "public"."forms";

alter table "public"."competitions" add column "form_id" integer;

alter table "public"."forms" drop column "scout_data";

alter table "public"."forms" add column "form_structure" jsonb not null;

alter table "public"."forms" add column "team_id" integer not null;

alter table "public"."competitions" add constraint "competitions_form_id_fkey" FOREIGN KEY (form_id) REFERENCES forms(id) not valid;

alter table "public"."competitions" validate constraint "competitions_form_id_fkey";

alter table "public"."forms" add constraint "forms_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."forms" validate constraint "forms_team_id_fkey";

set check_function_bodies = off;

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
  
  new.team_id := (select team_id from user_attributes where id = auth.uid());
  
  return new;
  
end;
$function$
;

create policy "Admins can add forms"
on "public"."forms"
as permissive
for insert
to authenticated
with check ((( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) AND (( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) IS NOT NULL)));


create policy "Enable read access for all users in the team"
on "public"."forms"
as permissive
for select
to public
using ((( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = team_id));


CREATE TRIGGER validate_form_trigger BEFORE INSERT ON public.forms FOR EACH ROW EXECUTE FUNCTION validate_form();


