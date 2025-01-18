drop trigger if exists "validate_form_trigger" on "public"."forms";

CREATE TRIGGER validate_form_trigger BEFORE INSERT ON public.forms FOR EACH ROW EXECUTE FUNCTION validate_form();


