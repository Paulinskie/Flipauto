import { saveDealAlert } from "@/lib/db";

export async function POST(req) {
  const body = await req.json();
  const { email, minProfit, model } = body;

  try {
    await saveDealAlert({ email, minProfit, model });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
