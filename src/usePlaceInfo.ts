import { useEffect, useState } from "react";

export type PlaceInfo = {
  name?: string;
  address?: string;
  rating?: number;
  userRatingCount?: number;
  isOpenNow?: boolean;
  weekdayDescriptions?: string[];
  priceLevel?: string;
  businessStatus?: string;
};

const PRICE_LEVEL_MAP: Record<string, string> = {
  PRICE_LEVEL_FREE: "무료",
  PRICE_LEVEL_INEXPENSIVE: "₱",
  PRICE_LEVEL_MODERATE: "₱₱",
  PRICE_LEVEL_EXPENSIVE: "₱₱₱",
  PRICE_LEVEL_VERY_EXPENSIVE: "₱₱₱₱",
};

export function usePlaceInfo(query: string | undefined, enabled: boolean) {
  const [info, setInfo] = useState<PlaceInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !query) {
      setInfo(null);
      setLoading(false);
      return;
    }

    const cacheKey = `place-info:${query}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as PlaceInfo;
        console.log("Places API cache hit:", query, parsed);
        setInfo(parsed);
        setLoading(false);
        return;
      }
    } catch {}

    setLoading(true);
    setInfo(null);

    fetch(`/api/places?query=${encodeURIComponent(query)}`)
      .then((r) => {
        console.log("Places API status:", r.status, "query:", query);
        return r.json();
      })
      .then((data) => {
        console.log("Places API response:", data);
        if (data?.error) {
          console.error("Places API error response:", data.error);
          return;
        }
        const place = data?.places?.[0];
        if (!place) {
          console.log("No place found for query:", query);
          return;
        }

        const result: PlaceInfo = {
          name: place.displayName?.text,
          address: place.formattedAddress,
          rating: place.rating,
          userRatingCount: place.userRatingCount,
          isOpenNow: place.currentOpeningHours?.openNow,
          weekdayDescriptions:
            place.currentOpeningHours?.weekdayDescriptions ??
            place.regularOpeningHours?.weekdayDescriptions,
          priceLevel: place.priceLevel
            ? (PRICE_LEVEL_MAP[place.priceLevel] ?? place.priceLevel)
            : undefined,
          businessStatus: place.businessStatus,
        };

        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        } catch {}

        setInfo(result);
      })
      .catch((err) => console.error("Places API error:", err))
      .finally(() => setLoading(false));
  }, [query, enabled]);

  return { info, loading };
}
