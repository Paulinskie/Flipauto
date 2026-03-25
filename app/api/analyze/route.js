import { calculatePrice } from "@/lib/pricing";

export async function POST(req) {
  const body = await req.json();

  const result = calculatePrice(body);

  return Response.json(result);
}
