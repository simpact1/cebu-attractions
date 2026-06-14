import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "query required" });
  }

  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": [
          "places.displayName",
          "places.formattedAddress",
          "places.rating",
          "places.userRatingCount",
          "places.currentOpeningHours",
          "places.regularOpeningHours",
          "places.priceLevel",
          "places.businessStatus",
        ].join(","),
      },
      body: JSON.stringify({ textQuery: query }),
    },
  );

  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");
  return res.status(200).json(data);
}
