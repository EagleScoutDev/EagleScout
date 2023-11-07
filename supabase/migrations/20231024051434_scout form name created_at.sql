alter table "public"."competitions" alter column "end_time" set data type timestamp with time zone using "end_time"::timestamp with time zone;

alter table "public"."competitions" alter column "start_time" set data type timestamp with time zone using "start_time"::timestamp with time zone;

alter table "public"."forms" add column "created_at" timestamp with time zone default now();

alter table "public"."forms" add column "name" text not null default ''::text;
