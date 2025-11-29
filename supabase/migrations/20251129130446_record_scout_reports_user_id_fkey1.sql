alter table "public"."scout_reports" drop constraint if exists "scout_reports_user_id_fkey1";

alter table "public"."scout_reports" add constraint "scout_reports_user_id_fkey1" foreign key ("user_id") references "public"."profiles"("id");
