CREATE UNIQUE INDEX teams_number_key ON public.teams USING btree (number);

alter table "public"."teams" add constraint "teams_number_key" UNIQUE using index "teams_number_key";

create policy "Allow users to create new teams"
on "public"."teams"
as permissive
for insert
to public
with check (true);



