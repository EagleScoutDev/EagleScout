// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const fetchTeamPage = async (page) =>
  await fetch(`https://www.thebluealliance.com/api/v3/teams/${page}/simple`, {
    headers: {
      "X-TBA-Auth-Key": Deno.env.get("TBA_API_KEY"),
    },
  });

Deno.serve(async (req) => {
  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const teams = [];
  let page = 0;
  let emptyPage = false;

  while (!emptyPage) {
    const response = await fetchTeamPage(page);
    const data = await response.json();

    if (data.length === 0) {
      emptyPage = true;
    } else {
      teams.push(
        ...data.map((team) => ({
          number: team.team_number,
          name: team.nickname,
        }))
      );
    }
    page++;
  }

  await adminSupabase.from("tba_teams").upsert(teams);

  return new Response("true", {
    headers: { "Content-Type": "application/json" },
  });
});
