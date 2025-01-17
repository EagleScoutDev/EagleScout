drop function if exists "public"."add_offline_scout_report"(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, created_at_arg timestamp with time zone);

drop function if exists "public"."add_offline_scout_report"(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, created_at_arg timestamp with time zone, timeline_data jsonb);

drop function if exists "public"."add_online_scout_report"(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb);

drop function if exists "public"."add_online_scout_report"(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, timeline_data jsonb);

create table "public"."match_bets" (
    "id" bigint generated by default as identity not null,
    "user_id" uuid not null,
    "alliance" text not null,
    "amount" integer not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "match_id" integer not null
);


alter table "public"."profiles" add column "emoji" text not null default '😎'::text;

alter table "public"."profiles" add column "scoutcoins" integer not null default 0;

CREATE UNIQUE INDEX match_bets_pkey ON public.match_bets USING btree (id);

alter table "public"."match_bets" add constraint "match_bets_pkey" PRIMARY KEY using index "match_bets_pkey";

alter table "public"."match_bets" add constraint "match_bets_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) not valid;

alter table "public"."match_bets" validate constraint "match_bets_match_id_fkey";

alter table "public"."match_bets" add constraint "match_bets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."match_bets" validate constraint "match_bets_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_offline_scout_report(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, created_at_arg timestamp with time zone, timeline_data jsonb, auto_path jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  match_id_var integer;
begin
  SELECT id INTO match_id_var
    FROM matches
    WHERE number = match_number_arg
        AND competition_id = competition_id_arg;

    IF match_id_var IS NULL THEN
        INSERT INTO matches (number, competition_id)
        VALUES (match_number_arg, competition_id_arg)
        RETURNING id INTO match_id_var;
    END IF;

    insert into scout_reports (match_id, user_id, data, team, created_at, online, timeline_data, auto_path)
    values (match_id_var, auth.uid(), data_arg, team_number_arg, created_at_arg, false, timeline_data, auto_path);

    update profiles
    set scoutcoins = scoutcoins + 10
    where id = auth.uid();
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_online_scout_report(competition_id_arg integer, match_number_arg integer, team_number_arg integer, data_arg jsonb, timeline_data jsonb, auto_path jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  match_id_var integer;
begin
  SELECT id INTO match_id_var
    FROM matches
    WHERE number = match_number_arg
        AND competition_id = competition_id_arg;

    IF match_id_var IS NULL THEN
        INSERT INTO matches (number, competition_id)
        VALUES (match_number_arg, competition_id_arg)
        RETURNING id INTO match_id_var;
    END IF;

    insert into scout_reports (match_id, user_id, data, team, online, timeline_data, auto_path)
    values (match_id_var, auth.uid(), data_arg, team_number_arg, true, timeline_data, auto_path);

    update profiles
    set scoutcoins = scoutcoins + 10
    where id = auth.uid();
end;
$function$
;
