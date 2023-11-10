import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
)


export default supabaseClient;