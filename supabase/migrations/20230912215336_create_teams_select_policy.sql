create policy "All users can see the teams registered on the app."
on "public"."teams"
as permissive
for select
to public
using (true);



