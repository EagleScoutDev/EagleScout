create table "public"."deletion_requests" (
    "user_id" uuid not null,
    "reason" text,
    "processed" boolean not null,
    "requested_at" timestamp with time zone not null default now()
);


alter table "public"."deletion_requests" enable row level security;

CREATE UNIQUE INDEX deletion_requests_pkey ON public.deletion_requests USING btree (user_id);

alter table "public"."deletion_requests" add constraint "deletion_requests_pkey" PRIMARY KEY using index "deletion_requests_pkey";

create policy "Enable insert for authenticated users only"
on "public"."deletion_requests"
as permissive
for insert
to authenticated
with check (true);
