import { useEffect, useState } from "react";
import type { PlaceInfo } from "./cebuPlacesData";
import { googleMapsPlaceSearchUrl, googleMapsQueryUrl } from "./mapCoords";

const CACHE_PREFIX = "cebu-place-info:v1:";

type PlacesApiPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: { weekdayDescriptions?: string[] };
};

type UsePlaceInfoResult = {
  place: PlaceInfo | null;
  loading: boolean;
  error: string | null;
};

function cacheKey(query: string): string {
  return `${CACHE_PREFIX}${query}`;
}

function readCache(query: string): PlaceInfo | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(query));
    if (!raw) return null;
    return JSON.parse(raw) as PlaceInfo;
  } catch {
    return null;
  }
}

function writeCache(query: string, place: PlaceInfo): void {
  try {
    sessionStorage.setItem(cacheKey(query), JSON.stringify(place));
  } catch {
    /* quota / private mode */
  }
}

function parsePlaceId(resourceId?: string): string | undefined {
  if (!resourceId) return undefined;
  const slash = resourceId.lastIndexOf("/");
  return slash >= 0 ? resourceId.slice(slash + 1) : resourceId;
}

function toPlaceInfo(raw: PlacesApiPlace): PlaceInfo | null {
  const name = raw.displayName?.text?.trim();
  const address = raw.formattedAddress?.trim();
  if (!name && !address) return null;

  return {
    name: name || address || "",
    address: address || "",
    rating: typeof raw.rating === "number" ? raw.rating : undefined,
    userRatingsTotal: typeof raw.userRatingCount === "number" ? raw.userRatingCount : undefined,
    openingHours: raw.currentOpeningHours?.weekdayDescriptions,
    placeId: parsePlaceId(raw.id),
  };
}

async function fetchPlaceInfo(mapsQuery: string): Promise<PlaceInfo | null> {
  const cached = readCache(mapsQuery);
  if (cached) return cached;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.currentOpeningHours",
    },
    body: JSON.stringify({ textQuery: mapsQuery }),
  });

  if (!res.ok) {
    throw new Error(`Places API ${res.status}`);
  }

  const data = (await res.json()) as { places?: PlacesApiPlace[] };
  const place = data.places?.[0] ? toPlaceInfo(data.places[0]) : null;
  if (place) writeCache(mapsQuery, place);
  return place;
}

export function googleMapsUrlForPlace(mapsQuery: string, place?: PlaceInfo | null): string {
  if (place?.placeId) {
    return googleMapsPlaceSearchUrl(mapsQuery, place.placeId);
  }
  return googleMapsQueryUrl(mapsQuery);
}

export function usePlaceInfo(mapsQuery: string | undefined, enabled: boolean): UsePlaceInfoResult {
  const [place, setPlace] = useState<PlaceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !mapsQuery) {
      setPlace(null);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = readCache(mapsQuery);
    if (cached) {
      setPlace(cached);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setPlace(null);

    fetchPlaceInfo(mapsQuery)
      .then((result) => {
        if (cancelled) return;
        setPlace(result);
      })
      .catch(() => {
        if (cancelled) return;
        setPlace(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mapsQuery, enabled]);

  return { place, loading, error };
}
