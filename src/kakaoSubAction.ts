import type { CebuGuideItem } from "./cebuPlacesData";

export function isKakaoChannelUrl(url: string): boolean {
  return url.includes("pf.kakao.com");
}

export function getReservationAction(item: CebuGuideItem) {
  return item.subActions?.find(
    (action) => action.id.endsWith("-reservation") && isKakaoChannelUrl(action.url ?? ""),
  );
}

export function hasReservation(item: CebuGuideItem): boolean {
  return Boolean(getReservationAction(item));
}

export function handleKakaoChannelClick(url: string): void {
  if (url.includes("utm_source=cebu-places-app")) {
    sessionStorage.setItem("kakao-referrer", "cebu-places-app-shooting");
  }
}
