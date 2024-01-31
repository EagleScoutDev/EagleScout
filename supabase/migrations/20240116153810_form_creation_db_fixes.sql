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
        if not (question ? 'title' and question ? 'description' ) then
          raise exception 'Invalid heading question %', question->>'question';
        end if;

      when 'radio' then
        if not (question ? 'options' and jsonb_typeof(question->'options') = 'array' and
                question ? 'question' and 
                question ? 'required' and 
                question ? 'defaultIndex' and 
                (question->>'defaultIndex')::int >= 0 and (question->>'defaultIndex')::int < jsonb_array_length(question->'options')) then
          raise exception 'Invalid radio question %', question->>'question';  
        end if;

      when 'number' then
        if not (question ? 'question' and 
                question ? 'low' and 
                question ? 'high' and
                question ? 'step' and
                question ? 'slider') then
          raise exception 'Invalid number question %', question->>'question';
        end if;
        
      when 'textbox' then
        if not (question ? 'question' and
                question ? 'required') then
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

create policy "Admins can delete forms"
on "public"."forms"
as permissive
for delete
to public
using ((( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) AND (( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) IS NOT NULL)));



