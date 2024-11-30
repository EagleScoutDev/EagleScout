// Check out README.md for how to set up this function with Supabase
import {SMTPClient} from "https://deno.land/x/denomailer/mod.ts";
import {createClient} from 'https://esm.sh/@supabase/supabase-js'

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
    try {
        const {record} = await req.json();
        if (record.organization_id == null) {
            return new Response(
                JSON.stringify({message: "No organization id"}),
                {headers: {"Content-Type": "application/json"}},
            )
        }
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {global: {headers: {Authorization: req.headers.get('Authorization')!}}}
        )
        const {data, error} = await supabase
            .rpc('does_org_lack_admin', {org_id_arg: record.organization_id});
        if (error) {
            throw error
        }
        if (data) {
            await client.send({
                from: "eaglescoutapp@gmail.com",
                to: emails,
                subject: "Eaglescout Organization Registration Notification",
                content: `A user on the organization with id ${record.organization_id} has requested to register.`,
            })
            return new Response(
                JSON.stringify({message: "Email sent"}),
                {headers: {"Content-Type": "application/json"}},
            )
        } else {
            return new Response(
                JSON.stringify({message: "Organization already has an admin"}),
                {headers: {"Content-Type": "application/json"}},
            )
        }
    } catch (e) {
        return new Response(
            JSON.stringify({message: "Error: " + e}),
            {headers: {"Content-Type": "application/json"}},
        )
    }
})
