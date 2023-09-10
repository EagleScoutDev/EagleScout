-- NOTE: This migration was created manually as migra didn't recognize the handle_new_user trigger.

CREATE TRIGGER handle_new_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();