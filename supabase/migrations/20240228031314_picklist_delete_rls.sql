create policy "Enable delete for admins and creators"
on "public"."picklist"
as permissive
for delete
to public
using ((((( SELECT user_attributes.organization_id AS team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())) = organization_id) AND ( SELECT user_attributes.admin
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid()))) OR (created_by = auth.uid())));



