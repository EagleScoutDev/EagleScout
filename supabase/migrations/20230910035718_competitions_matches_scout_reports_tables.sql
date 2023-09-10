create table "public"."competitions" (
    "id" integer generated always as identity not null,
    "team_id" integer not null,
    "name" text not null,
    "start_time" timestamp without time zone not null,
    "end_time" timestamp without time zone not null
);


create table "public"."matches" (
    "id" integer generated always as identity not null,
    "competition_id" integer not null,
    "number" integer not null
);


create table "public"."scout_reports" (
    "match_id" integer not null,
    "user_id" uuid not null,
    "data" json not null
);


CREATE UNIQUE INDEX competitions_pkey ON public.competitions USING btree (id);

CREATE UNIQUE INDEX matches_pkey ON public.matches USING btree (id);

alter table "public"."competitions" add constraint "competitions_pkey" PRIMARY KEY using index "competitions_pkey";

alter table "public"."matches" add constraint "matches_pkey" PRIMARY KEY using index "matches_pkey";

alter table "public"."competitions" add constraint "competitions_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."competitions" validate constraint "competitions_team_id_fkey";

alter table "public"."matches" add constraint "matches_competition_id_fkey" FOREIGN KEY (competition_id) REFERENCES competitions(id) not valid;

alter table "public"."matches" validate constraint "matches_competition_id_fkey";

alter table "public"."scout_reports" add constraint "scout_reports_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) not valid;

alter table "public"."scout_reports" validate constraint "scout_reports_match_id_fkey";

alter table "public"."scout_reports" add constraint "scout_reports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."scout_reports" validate constraint "scout_reports_user_id_fkey";


