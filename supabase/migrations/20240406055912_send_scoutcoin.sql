alter table "public"."scoutcoin_ledger" drop constraint "scoutcoin_ledger_dest_user_fkey";

alter table "public"."scoutcoin_ledger" drop constraint "scoutcoin_ledger_src_user_fkey";

alter table "public"."scoutcoin_ledger" add constraint "scoutcoin_ledger_dest_user_fkey" FOREIGN KEY (dest_user) REFERENCES profiles(id) not valid;

alter table "public"."scoutcoin_ledger" validate constraint "scoutcoin_ledger_dest_user_fkey";

alter table "public"."scoutcoin_ledger" add constraint "scoutcoin_ledger_src_user_fkey" FOREIGN KEY (src_user) REFERENCES profiles(id) not valid;

alter table "public"."scoutcoin_ledger" validate constraint "scoutcoin_ledger_src_user_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.change_scoutcoin_by(src_user_id uuid, dest_user_id uuid, amount bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
       IF auth.role() <> 'service_role' THEN
         RAISE EXCEPTION 'Unauthorized access';
       END IF;
    update profiles set scoutcoins = scoutcoins - amount where id = src_user_id;
    update profiles set scoutcoins = scoutcoins + amount where id = dest_user_id;
end;
$function$
;


