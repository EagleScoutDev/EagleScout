alter table "public"."profiles" add column "name" text generated always as (
CASE
    WHEN (first_name IS NULL) THEN last_name
    WHEN (last_name IS NULL) THEN first_name
    ELSE ((first_name || ' '::text) || last_name)
END) stored;


