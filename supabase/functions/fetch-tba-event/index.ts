// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import moment from "https://esm.sh/moment-timezone";
import supabaseClient from '../_shared/supabaseAdmin.ts';

function getResponse(valid: boolean, message: string) {
  return new Response(
    JSON.stringify({
      message
    }),
    { 
      headers: { 
        'Content-Type': 'application/json'
      },
      status: valid ? 200 : 400
    }
  );
}

serve(async (req: Request) => {
  const { tbakey: eventKey } = await req.json();
  const tbaAuthKey = 'YRbY8TXxQFiB9LY5NQDfCQkNEQje9pjPV7dZyGdN8idR1vcVtOyPj6diGXE5Nbik';

  const eventRes = await fetch(
    'https://www.thebluealliance.com/api/v3/event/' + eventKey, {
      headers: {
        'X-TBA-Auth-Key': tbaAuthKey
      }
    });
  if (eventRes.status !== 200) {
    return getResponse(false, 'Invalid competition key');
  }
  const event = await eventRes.json();

  const matchesRes = await fetch(
    'https://www.thebluealliance.com/api/v3/event/' + eventKey + '/matches/simple', {
      headers: {
        'X-TBA-Auth-Key': tbaAuthKey
      }
    });
  if (matchesRes.status !== 200) {
    return getResponse(false, 'Unable to get competition matches');
  }
  const matches = await matchesRes.json();

  if (matches.length == 0 ) {
    return getResponse(false, 'Matches not available for this competition yet');
  } else {
    const matches_db_function: {
      team_red_1: number | null; team_red_2: number | null; team_red_3: number | null
      team_blue_1: number | null; team_blue_2: number | null; team_blue_3
      : number | null; match_number: any; predicted_time: Date | null
    }[] = [];
    matches.forEach((elem: { alliances: { red: { team_keys: string[] }; blue: { team_keys: string[] } }; match_number: any; predicted_time: string | number | Date }) => {
      if (!elem.alliances) {
        return getResponse(false, 'Matches not available for this competition yet');
      }
      matches_db_function.push({
        team_red_2: elem.alliances.red.team_keys[1],
        team_red_3: elem.alliances.red.team_keys[2],
        team_red_1: elem.alliances.red.team_keys[0],
        team_blue_1: elem.alliances.blue.team_keys[0],
        team_blue_2: elem.alliances.blue.team_keys[1],
        team_blue_3: elem.alliances.blue.team_keys[2],
        match_number: elem.match_number,
        predicted_time: elem.predicted_time ? new Date(elem.predicted_time) : null,
        comp_level: elem.comp_level
      });
      if (elem.match_number == 1 && elem.comp_level == 'qm') {
        console.log('team_red_1: ' + elem.alliances.red.team_keys[0]);
        console.log('team_red_2: ' + elem.alliances.red.team_keys[1]);
        console.log('team_red_3: ' + elem.alliances.red.team_keys[2]);
        console.log('team_blue_1: ' + elem.alliances.blue.team_keys[0]);
        console.log('team_blue_2: ' + elem.alliances.blue.team_keys[1]);
        console.log('team_blue_3: ' + elem.alliances.blue.team_keys[2]);
      }
    });
    const {error} = await supabaseClient.rpc('add_tba_event', {
      event_key_arg: eventKey,
      start_date_arg: moment.tz(event.start_date.toString(), event.timezone).utc().format(),
      end_date_arg: moment.tz(event.end_date.toString(), event.timezone).utc().format(),
      matches: matches_db_function
    });
    if (error) {
      console.log('error adding tba event');
      console.log(error);
      return getResponse(false, 'Error adding TBA event');
    } else {
      console.log('OK');
      return getResponse(true, 'OK');
    }
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
