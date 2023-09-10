drop policy "Everyone can delete their own scout reports and admins can dele" on "public"."scout_reports";

drop policy "Everyone can update their own scout reports." on "public"."scout_reports";

drop policy "Everyone in a team can create scout reports." on "public"."scout_reports";

drop policy "Scout reports are viewable by those in the team." on "public"."scout_reports";

alter table "public"."scout_reports" drop constraint "scout_reports_match_id_fkey";

alter table "public"."scout_reports" drop constraint "scout_reports_user_id_fkey";

drop table "public"."scout_reports";


