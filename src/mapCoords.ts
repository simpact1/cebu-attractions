/** 세부·막탄 일대 WGS84 좌표 정규화 (위도·경도 뒤바뀜 방지) */
export function normalizeCebuLatLng(
  lat: number,
  lng: number,
): { lat: number; lng: number } {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) {
    return { lat: 10.31, lng: 124.01 };
  }
  const latLooksLikeLng = la > 50 && ln < 50;
  const lngLooksLikeLat = ln < 50 && la > 50;
  if (latLooksLikeLng || lngLooksLikeLat) {
    return { lat: ln, lng: la };
  }
  return { lat: la, lng: ln };
}

/** Leaflet / react-leaflet용 [위도, 경도] 튜플 */
export function latLngTuple(lat: number, lng: number): [number, number] {
  const c = normalizeCebuLatLng(lat, lng);
  return [c.lat, c.lng];
}

/** Google Maps 좌표 검색 URL (위도,경도 순서 고정) */
export function googleMapsCoordUrl(lat: number, lng: number): string {
  const c = normalizeCebuLatLng(lat, lng);
  return `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;
}

/** 상호명에서 한글명 추출 (괄호 안 영문명 제거) */
export function parseShopDisplayName(shopName: string): string {
  return shopName.replace(/\s*\([^)]*\)\s*$/, "").trim() || shopName.trim();
}

/** 매장 상호명 기반 Google Maps 검색 URL (다른 마사지샵과 동일 포맷) */
export function googleMapsSearchUrl(name: string): string {
  const query = encodeURIComponent(`세부 ${name}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Place ID + 검색어 기반 Google Maps URL (장황한 /place/ 파라미터 없음) */
export function googleMapsPlaceSearchUrl(query: string, placeId: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&query_place_id=${encodeURIComponent(placeId)}`;
}

/** 완성된 검색어(영문 지명 등)용 — '세부' 접두사 없음 */
export function googleMapsQueryUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** 마커 목록의 중심 좌표 */
export function markersCenter(
  markers: { lat: number; lng: number }[],
): [number, number] {
  if (markers.length === 0) return [10.31, 124.01];
  const valid = markers.filter(
    (m) => Number.isFinite(m.lat) && Number.isFinite(m.lng),
  );
  if (valid.length === 0) return [10.31, 124.01];
  const { lat, lng } = normalizeCebuLatLng(
    valid.reduce((sum, m) => sum + m.lat, 0) / valid.length,
    valid.reduce((sum, m) => sum + m.lng, 0) / valid.length,
  );
  return [lat, lng];
}
