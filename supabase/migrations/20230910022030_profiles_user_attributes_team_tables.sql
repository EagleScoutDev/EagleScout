create table "public"."profiles" (
    "id" uuid not null,
    "firstname" text,
    "lastname" text
);


alter table "public"."profiles" enable row level security;

create table "public"."teams" (
    "id" integer generated always as identity not null,
    "number" integer,
    "name" text
);


alter table "public"."teams" enable row level security;

create table "public"."user_attributes" (
    "id" uuid not null,
    "team_id" integer,
    "scouter" boolean,
    "admin" boolean
);


alter table "public"."user_attributes" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

CREATE UNIQUE INDEX user_attributes_pkey ON public.user_attributes USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."user_attributes" add constraint "user_attributes_pkey" PRIMARY KEY using index "user_attributes_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."user_attributes" add constraint "user_attributes_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_attributes" validate constraint "user_attributes_id_fkey";

alter table "public"."user_attributes" add constraint "user_attributes_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."user_attributes" validate constraint "user_attributes_team_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.user_attributes (id)
  values (new.id);
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$function$
;

create policy "Profiles are viewable by users who created them and others in t"
on "public"."profiles"
as permissive
for select
to public
using (((auth.uid() = id) OR (( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = user_attributes.id)) = ( SELECT user_attributes.team_id
   FROM user_attributes
  WHERE (user_attributes.id = auth.uid())))));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));



