import { scrapeDoneDeal } from "@/lib/scraper";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  const data = await scrapeDoneDeal(query);

  return Response.json(data);
}
