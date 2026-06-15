import type { VercelRequest, VercelResponse } from "@vercel/node";
import { searchPlaces } from "../lib/placesSearch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "query required" });
  }

  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ?? process.env.VITE_GOOGLE_MAPS_API_KEY;
  const data = await searchPlaces(query, apiKey);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");
  return res.status(200).json(data);
}
