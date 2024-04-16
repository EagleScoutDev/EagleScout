import { createClient } from "https://esm.sh/@supabase/supabase-js";

Deno.serve(async (req) => {
  const {
    matchId,
    result,
  }: {
    matchId: number;
    result: "red" | "tie" | "blue";
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
    const { data: attrs, error: attrsError } = await authedSupabase
      .from("user_attributes")
      .select("*")
      .eq("id", user.id)
      .single();
    if (!attrs || attrsError || !attrs.admin) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { data: bets, error: betsError } = await authedSupabase
      .from("match_bets")
      .select("*")
      .eq("match_id", matchId);
    if (betsError) {
      throw betsError;
    }
    if (result === "tie") {
      await adminSupabase.rpc("match_tie", { match_id: matchId });
      return;
    }
    const redBets = bets.filter((bet) => bet.alliance === "red");
    const blueBets = bets.filter((bet) => bet.alliance === "blue");
    const redBetSum = redBets.reduce((acc, bet) => acc + bet.amount, 0);
    const blueBetSum = blueBets.reduce((acc, bet) => acc + bet.amount, 0);

    const winnerBets = result === "red" ? redBets : blueBets;
    const winnerSum = result === "red" ? redBetSum : blueBetSum;

    const loserBets = result === "red" ? blueBets : redBets;
    const loserSumSplit =
      result === "red"
        ? blueBetSum / redBets.length
        : redBetSum / blueBets.length;

    console.log(redBets, blueBets, redBetSum, blueBetSum);
    console.log(winnerBets, loserBets, winnerSum, loserSumSplit);

    const changeAmounts: { id: number; amount: number }[] = [
      ...loserBets.map((bet) => ({ id: bet.user_id, amount: -bet.amount })),
      ...winnerBets.map((bet) => ({
        id: bet.user_id,
        amount:
          bet.amount + Math.floor(bet.amount * (loserSumSplit / winnerSum)),
      })),
    ];
    console.log(changeAmounts);
    await adminSupabase.rpc("match_winner", {
      match_id: matchId,
      winner: result,
      change_amounts: changeAmounts,
    });
    return new Response("Success", { status: 200 });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
