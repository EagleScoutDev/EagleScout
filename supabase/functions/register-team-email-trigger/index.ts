// Check out README.md for how to set up this function with Supabase
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const client = new SMTPClient({
  connection: {
    hostname: "smtp.gmail.com",
    port: 465,
    tls: true,
    auth: {
      username: Deno.env.get("SMTP_USERNAME")!,
      password: Deno.env.get("SMTP_PASSWORD")!,
    }
  }
})

const emails = Deno.env.get("EMAILS")!.split(",")

console.log(emails)

Deno.serve(async (req) => {
  const {record} = await req.json();
  await client.send({
    from: "eaglescoutapp@gmail.com",
    to: emails,
    subject: "Eaglescout Team Registration Notification",
    content: `A new team has requested to register with the following details:
    Team: ${record.team}
    Email: ${record.email}
    `,
  })
  return new Response(
    JSON.stringify({ message: "Email sent" }),
    { headers: { "Content-Type": "application/json" } },
  )
})
