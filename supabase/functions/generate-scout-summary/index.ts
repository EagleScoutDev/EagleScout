// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { header, comments } = await req.json();

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer ' + Deno.env.get('OPENAI_API_KEY'),
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'The following data is a collection of scouting comments from a FIRST robotics match.',
        },
        {
          role: 'system',
          content:
            'You will summarize the comments in a concise manner, without add any filler text',
        },
        {
          role: 'user',
          content: 'The question that was asked was: ' + header,
        },
        {
          role: 'user',
          content: 'Here is the data: ' + comments,
        },
      ],
    }),
  });

  if (res.status !== 200) {
    return new Response(
      JSON.stringify({
        message: 'OpenAI API error',
      }), { 
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }

  return new Response(
    JSON.stringify(await res.json()),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
