import { createClient } from "https://esm.sh/@supabase/supabase-js";

Deno.serve(async (req) => {
  const {
    targetUserId,
    amount,
    description,
  }: {
    targetUserId: string;
    amount: number;
    description: string;
  } = await req.json();
  try {
    const authedSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const {
      data: { user },
    } = await authedSupabase.auth.getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
    await adminSupabase.from("scoutcoin_ledger").insert([
      {
        description,
        src_user: user.id,
        dest_user: targetUserId,
        amount_change: amount,
      },
    ]);
    const { error } = await adminSupabase.rpc("change_scoutcoin_by", {
      src_user_id: user.id,
      dest_user_id: targetUserId,
      amount,
    });
    if (error) {
      throw error;
    }
    return new Response("Success", { status: 200 });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
