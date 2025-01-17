import { createClient } from "https://esm.sh/@supabase/supabase-js";

const items = {
  "emoji-change": {
    amount: 5,
    name: "Emoji Change",
  },
  "theme-change": {
    amount: 8,
    name: "Theme Change",
  },
  "icon-change": {
    amount: 20,
    name: "Icon Change",
  },
};

Deno.serve(async (req) => {
  const {
    itemName,
  }: {
    itemName: string;
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
    const { data, error } = await adminSupabase
      .from("profiles")
      .select("scoutcoins")
      .eq("id", user.id);
    if (error) {
      throw error;
    }
    const scoutcoins = data[0].scoutcoins;
    const item = items[itemName];
    if (!item) {
      return new Response("Item not found", { status: 400 });
    }
    if (scoutcoins < item.amount) {
      return new Response(
        `Insufficient scoutcoins. You need ${item.amount - scoutcoins} more`,
        { status: 200 }
      );
    }
    await adminSupabase.from("scoutcoin_ledger").insert([
      {
        description: `Bought item: ${item.name}`,
        src_user: user.id,
        dest_user: null,
        amount_change: -item.amount,
      },
    ]);
    await adminSupabase
      .from("profiles")
      .update({ scoutcoins: scoutcoins - item.amount })
      .eq("id", user.id);
    return new Response("Success", { status: 200 });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
