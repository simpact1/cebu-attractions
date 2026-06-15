const PLACES_FIELD_MASK = [
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.currentOpeningHours",
  "places.regularOpeningHours",
  "places.priceLevel",
  "places.businessStatus",
].join(",");

type PlacesSearchResult = {
  places: unknown[];
};

export async function searchPlaces(
  query: string,
  apiKey: string | undefined,
): Promise<PlacesSearchResult> {
  if (!apiKey) {
    return { places: [] };
  }

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": PLACES_FIELD_MASK,
        },
        body: JSON.stringify({ textQuery: query }),
      },
    );

    const data = await response.json();
    if (!response.ok || data.error || !Array.isArray(data.places)) {
      return { places: [] };
    }

    return { places: data.places };
  } catch {
    return { places: [] };
  }
}
