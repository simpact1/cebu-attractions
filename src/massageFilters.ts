export type MassageQuality = "고급" | "중저가";
export type MassageZone = "샹그릴라 주변" | "뉴타운 주변" | "마리바고 주변" | "공항 주변" | "기타";
export type MassageRecommend =
  | "도착 첫날"
  | "출국 전"
  | "호핑 후"
  | "커플"
  | "부모님"
  | "픽업드랍";

export type MassageFilterState = {
  quality: MassageQuality | null;
  zone: MassageZone | null;
  recommend: MassageRecommend | null;
};

export type MassageFilterable = {
  quality?: MassageQuality;
  zones?: MassageZone[];
  recommends?: MassageRecommend[];
};

export const EMPTY_MASSAGE_FILTER: MassageFilterState = {
  quality: null,
  zone: null,
  recommend: null,
};

export const MASSAGE_QUALITY_OPTIONS: MassageQuality[] = ["고급", "중저가"];

export const MASSAGE_ZONE_OPTIONS: MassageZone[] = [
  "샹그릴라 주변",
  "뉴타운 주변",
  "마리바고 주변",
  "공항 주변",
  "기타",
];

export const MASSAGE_RECOMMEND_OPTIONS: MassageRecommend[] = [
  "도착 첫날",
  "출국 전",
  "호핑 후",
  "커플",
  "부모님",
  "픽업드랍",
];

export function matchesMassageFilter(
  item: MassageFilterable,
  filter: MassageFilterState,
): boolean {
  if (filter.quality && item.quality !== filter.quality) {
    return false;
  }
  if (filter.zone && !item.zones?.includes(filter.zone)) {
    return false;
  }
  if (filter.recommend && !item.recommends?.includes(filter.recommend)) {
    return false;
  }
  return true;
}

export function hasActiveMassageFilter(filter: MassageFilterState): boolean {
  return filter.quality !== null || filter.zone !== null || filter.recommend !== null;
}
