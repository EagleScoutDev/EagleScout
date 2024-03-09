drop trigger if exists "set_created_by_notes" on "public"."notes";

CREATE TRIGGER set_created_by_notes BEFORE INSERT ON public.notes FOR EACH ROW EXECUTE FUNCTION note_before_insert_tasks();
