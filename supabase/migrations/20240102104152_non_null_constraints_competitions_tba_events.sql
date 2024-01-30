alter table "public"."competitions" drop constraint "competitions_tba_event_fkey";

alter table "public"."competitions" alter column "tba_event_id" set not null;

alter table "public"."tba_events" alter column "teams" set not null;

alter table "public"."competitions" add constraint "competitions_tba_event_id_fkey" FOREIGN KEY (tba_event_id) REFERENCES tba_events(id) not valid;

alter table "public"."competitions" validate constraint "competitions_tba_event_id_fkey";


