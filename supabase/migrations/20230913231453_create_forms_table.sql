create table "public"."forms" (
    "id" integer generated by default as identity not null,
    "scout_data" jsonb not null
);


alter table "public"."forms" enable row level security;

CREATE UNIQUE INDEX forms_pkey ON public.forms USING btree (id);

alter table "public"."forms" add constraint "forms_pkey" PRIMARY KEY using index "forms_pkey";

create policy "Enable read access for all users"
on "public"."forms"
as permissive
for select
to public
using (true);



