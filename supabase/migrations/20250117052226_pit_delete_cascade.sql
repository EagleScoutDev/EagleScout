alter table "public"."pit_scout_reports" drop constraint "pit_scout_reports_competition_id_fkey";

alter table "public"."pit_scout_reports" add constraint "pit_scout_reports_competition_id_fkey" FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE not valid;

alter table "public"."pit_scout_reports" validate constraint "pit_scout_reports_competition_id_fkey";


