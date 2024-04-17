// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { endpoint } = await req.json();
  if (!endpoint.startsWith('/')) {
    return new Response(
      JSON.stringify({
        message: 'Invalid endpoint'
      }), { 
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }

  const response = await fetch(
    `https://www.thebluealliance.com/api/v3${endpoint}`,
    {
      headers: {
        'X-TBA-Auth-Key': Deno.env.get('TBA_API_KEY'),
      },
    },
  );

  if (response.status !== 200) {
    return new Response(
      JSON.stringify({
        message: 'TBA API error',
        tbaCode: response.status,
      }), { 
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }

  const data = await response.json();

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
