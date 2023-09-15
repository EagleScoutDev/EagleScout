set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_profiles()
 RETURNS TABLE(id uuid, first_name text, last_name text, scouter boolean, admin boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT ua.id, p.first_name, p.last_name, ua.scouter, ua.admin
    FROM public.user_attributes ua
    INNER JOIN public.profiles p ON ua.id = p.id;
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
        (select team_id from public.user_attributes as ua where ua.id=gup.id) = 
        (select team_id from public.user_attributes as ua where ua.id=auth.uid());
END;
$function$
;


