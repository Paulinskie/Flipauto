import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function saveDealAlert({ email, minProfit, model }) {
  const { data, error } = await supabase
    .from("alerts")
    .insert([{ email, min_profit: minProfit, model }]);

  if (error) throw error;
  return data;
}

export async function getDealAlerts(email) {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("email", email);

  if (error) throw error;
  return data;
}

export async function deleteDealAlert(id) {
  const { error } = await supabase.from("alerts").delete().eq("id", id);

  if (error) throw error;
  return true;
}
