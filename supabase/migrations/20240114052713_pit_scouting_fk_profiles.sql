alter table "public"."pit_scout_reports" drop constraint "pit_scout_reports_user_id_fkey";

alter table "public"."pit_scout_reports" add constraint "pit_scout_reports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."pit_scout_reports" validate constraint "pit_scout_reports_user_id_fkey";
