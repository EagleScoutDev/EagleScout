drop trigger if exists "validate_form_trigger" on "public"."forms";

create table "public"."notes" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "title" text,
    "content" text,
    "team_number" integer,
    "match_id" integer,
    "created_by" uuid
);


CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."notes" add constraint "notes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."notes" validate constraint "notes_created_by_fkey";

alter table "public"."notes" add constraint "notes_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) not valid;

alter table "public"."notes" validate constraint "notes_match_id_fkey";

CREATE TRIGGER validate_form_trigger BEFORE INSERT ON public.forms FOR EACH ROW EXECUTE FUNCTION validate_form();
ALTER TABLE "public"."forms" DISABLE TRIGGER "validate_form_trigger";


