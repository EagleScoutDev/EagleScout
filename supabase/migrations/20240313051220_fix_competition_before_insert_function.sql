set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.competition_before_insert_tasks()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.organization_id := (select organization_id from user_attributes where id = auth.uid());
  return new;
end;
$function$
;


