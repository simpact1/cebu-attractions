/** 세부·막탄 일대 WGS84 좌표 정규화 (위도·경도 뒤바뀜 방지) */
export function normalizeCebuLatLng(
  lat: number,
  lng: number,
): { lat: number; lng: number } {
  // 세부·막탄: 위도 ~9–11, 경도 ~123–125
  const latLooksLikeLng = lat > 50 && lng < 50;
  const lngLooksLikeLat = lng < 50 && lat > 50;
  if (latLooksLikeLng || lngLooksLikeLat) {
    return { lat: lng, lng: lat };
  }
  return { lat, lng };
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

/** 매장 상호명 기반 Google Maps 검색 URL (좌표는 선택적 힌트) */
export function googleMapsSearchUrl(name: string, lat?: number, lng?: number): string {
  const query = encodeURIComponent(`세부 ${name}`);
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
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
  const { lat, lng } = normalizeCebuLatLng(
    markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
    markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
  );
  return [lat, lng];
}
