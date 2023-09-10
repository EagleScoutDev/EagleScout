drop policy "Profiles are viewable by users who created them and others in t" on "public"."profiles";

create policy "Profiles are viewable by users who created them and others in t"
on "public"."profiles"
as permissive
for select
to public
using (((auth.uid() = id) OR is_same_team(id, auth.uid())));



