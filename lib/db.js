import { createClient } from "@supabase/supabase-js";

let supabase = null;

function getSupabase() {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error("Supabase credentials not configured");
    }
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }
  return supabase;
}

export async function saveDealAlert({ email, minProfit, model }) {
  const client = getSupabase();
  const { data, error } = await client
    .from("alerts")
    .insert([{ email, min_profit: minProfit, model }]);

  if (error) throw error;
  return data;
}

export async function getDealAlerts(email) {
  const client = getSupabase();
  const { data, error } = await client
    .from("alerts")
    .select("*")
    .eq("email", email);

  if (error) throw error;
  return data;
}

export async function deleteDealAlert(id) {
  const client = getSupabase();
  const { error } = await client.from("alerts").delete().eq("id", id);

  if (error) throw error;
  return true;
}
