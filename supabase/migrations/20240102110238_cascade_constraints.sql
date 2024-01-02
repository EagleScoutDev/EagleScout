alter table "public"."scout_reports_edits" drop constraint "scout_reports_edits_scout_report_id_fkey";

alter table "public"."tba_matches" drop constraint "tba_matches_event_id_fkey";

alter table "public"."scout_reports_edits" add constraint "scout_reports_edits_scout_report_id_fkey" FOREIGN KEY (scout_report_id) REFERENCES scout_reports(id) ON DELETE CASCADE not valid;

alter table "public"."scout_reports_edits" validate constraint "scout_reports_edits_scout_report_id_fkey";

alter table "public"."tba_matches" add constraint "tba_matches_event_id_fkey" FOREIGN KEY (event_id) REFERENCES tba_events(id) ON DELETE CASCADE not valid;

alter table "public"."tba_matches" validate constraint "tba_matches_event_id_fkey";


