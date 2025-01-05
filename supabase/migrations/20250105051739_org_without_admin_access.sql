CREATE OR REPLACE FUNCTION public.does_org_lack_admin(org_id_arg int)
    RETURNS boolean
    LANGUAGE plpgsql
AS
$function$
BEGIN
    RETURN (SELECT COUNT(*) = 0 FROM user_attributes WHERE organization_id = org_id_arg AND admin = true);
END;
$function$;

alter policy "Admins can set user attributes in their team"
    on "public"."user_attributes"
    to public
    using (
    ((is_same_organization(id, auth.uid()) AND (SELECT user_attributes_1.admin
                                                FROM user_attributes user_attributes_1
                                                WHERE (user_attributes_1.id = auth.uid())))) OR
    does_org_lack_admin((SELECT organization_id
                         FROM user_attributes
                         WHERE user_attributes.id = auth.uid()))
    );

alter policy "Admins can set user attributes in their team"
    on "public"."user_attributes"
    rename to "Admins or orgs w/o admins can set user attributes in their team";
