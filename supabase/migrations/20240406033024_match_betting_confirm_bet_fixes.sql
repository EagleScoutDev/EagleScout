set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.match_tie(match_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
     DECLARE
       bet_record record;
       match_number text;
       comp_name text;
       match_id_arg int;
     BEGIN
       match_id_arg = match_id;
       IF auth.role() <> 'service_role' THEN
         RAISE EXCEPTION 'Unauthorized access';
       END IF;
       INSERT INTO match_bets_results (match_id, result) VALUES (match_id, 'tie');
       FOR bet_record IN SELECT * FROM match_bets WHERE match_id = match_id LOOP
         IF match_number IS NULL THEN
           SELECT number INTO match_number FROM matches WHERE id = match_id;
         END IF;
         IF comp_name IS NULL THEN
           SELECT name INTO comp_name FROM competitions WHERE id = (SELECT competition_id FROM matches WHERE id = match_id);
         END IF;
         UPDATE profiles SET scoutcoins = scoutcoins + bet_record.amount WHERE id = bet_record.user_id;
         INSERT INTO scoutcoin_ledger (src_user, dest_user, amount_change, description) VALUES (NULL, bet_record.user_id, bet_record.amount, 'Bet Match ' || match_number || ' Tied (' || comp_name || ')');
       END LOOP;
       DELETE FROM match_bets WHERE match_bets.match_id = match_id_arg;
     END;
     $function$
;

CREATE OR REPLACE FUNCTION public.match_winner(match_id bigint, winner text, change_amounts jsonb[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
     declare
       match_number text;
       competition_name text;
       change_amount jsonb;
       match_id_arg int;
     begin
       match_id_arg = match_id;
       IF auth.role() <> 'service_role' THEN
         RAISE EXCEPTION 'Unauthorized access';
       END IF;
       INSERT INTO match_bets_results (match_id, result) VALUES (match_id, winner);
       foreach change_amount in array change_amounts loop
         if match_number is NULL then
           select number into match_number from matches where id = match_id;
           select name into competition_name from competitions where id = (select competition_id from matches where id = match_id);
         end if;
         update profiles set scoutcoins = scoutcoins + (change_amount->>'amount')::int where id = (change_amount->>'id')::uuid;
         INSERT INTO scoutcoin_ledger (src_user, dest_user, amount_change, description) VALUES (NULL, (change_amount->>'id')::uuid, (change_amount->>'amount')::int, 'Bet Match ' || match_number || ' ' ||
         CASE WHEN (change_amount->>'amount')::int < 0 THEN 'Lost' ELSE 'Won' END || ' (' || competition_name || ')');
       end loop;
       DELETE FROM match_bets WHERE match_bets.match_id = match_id_arg;
     end;
     $function$
;

create policy "Enable read access for all users"
on "public"."scoutcoin_ledger"
as permissive
for select
to public
using (true);



