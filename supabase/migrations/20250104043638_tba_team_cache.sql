create table "public"."tba_teams"
(
    "number" bigint not null,
    "name"   text   not null
);

CREATE UNIQUE INDEX tba_teams_number_key ON public.tba_teams USING btree (number);

CREATE UNIQUE INDEX tba_teams_pkey ON public.tba_teams USING btree (number);

alter table "public"."tba_teams"
    add constraint "tba_teams_pkey" PRIMARY KEY using index "tba_teams_pkey";

alter table "public"."tba_teams"
    add constraint "tba_teams_number_key" UNIQUE using index "tba_teams_number_key";

create extension pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select cron.schedule(
               'cache-tba-teams',
               '0 0 * * 1',
               $$
               select net.http_post(
                   url := 'https://ltbaymxtkftdtqyjjuoi.supabase.co/functions/v1/cache-tba-teams',
                   headers := jsonb_build_object('Content-Type', 'application/json'),
                   body := jsonb_build_object('time', now()),
                   timeout_milliseconds := 5000
                ) as request_id;
                $$
       );
