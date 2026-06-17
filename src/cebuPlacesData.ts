import { MACTAN_MASSAGE_ITEMS } from "./mactanMassageData";
import type { MassageQuality, MassageRecommend, MassageZone } from "./massageFilters";
 
export { googleMapsQueryUrl, googleMapsSearchUrl } from "./mapCoords";
 
// ----------------------------------------------------------------
// 타입 정의
// ----------------------------------------------------------------
 
export type CebuGuideItem = {
  id: string;
  title: string;
  description: string;
  mapsQuery?: string;
  googleMapsUrl?: string;
  mapPopupLink?: { url: string; label: string };
  reservationUrl?: string;
  mapPin?: { lat: number; lng: number };
  address?: string;
  rating?: string;       // 예: "⭐ 4.3"
  openingHours?: string;
  tourPins?: { id: string; title: string; lat: number; lng: number }[];
  subActions?: {
    id: string;
    icon: string;
    label: string;
    url?: string;
    description?: string;
  }[];
  companyList?: CebuGuideCompany[];
  companyGroups?: {
    groupTitle: string;
    companies: CebuGuideCompany[];
  }[];
  faqItems?: { id: string; question: string; answer: string }[];
  quality?: MassageQuality;
  zones?: MassageZone[];
  recommends?: MassageRecommend[];
};

export type CebuGuideCompany = {
  id: string;
  icon: string;
  label: string;
  url: string;
  description: string;
  recommend: string;
};

/** Google Places API (New) Text Search 결과 */
export type PlaceInfo = {
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  openingHours?: string[];
  placeId?: string;
};
 
export type CebuGuideGroup = {
  id: string;
  label: string;
  items: CebuGuideItem[];
};
 
export type CebuGuideZoneSplit = {
  kind: "split";
  id: string;
  title: string;
  groups: CebuGuideGroup[];
};
 
export type CebuGuideZoneFlat = {
  kind: "flat";
  id: string;
  title: string;
  items: CebuGuideItem[];
};
 
export type CebuGuideZone = CebuGuideZoneSplit | CebuGuideZoneFlat;
 
/** 세부영상 탭 클릭 시 네이버 블로그로 이동 */
export const CEBU_VIDEO_BLOG_URL = "https://m.blog.naver.com/aalove0902?tab=2";
 
/** 통합 지도(Leaflet)를 띄우는 탭 여부 */
export function zoneHasClusterMap(zone: CebuGuideZone): boolean {
  if (zone.kind === "flat") return false;
  return (
    zone.id === "cebu-city" ||
    zone.id === "mactan" ||
    zone.id === "outskirts" ||
    zone.id === "bohol"
  );
}
 
/** 아코디언 openKey에서 선택된 장소 id 추출 */
export function selectedGuideItemId(
  openKey: string | null,
  zone: CebuGuideZone,
  groupId: string,
): string | null {
  if (!openKey) return null;
  if (zone.kind === "flat") {
    const prefix = `${zone.id}:`;
    if (!openKey.startsWith(prefix)) return null;
    return openKey.slice(prefix.length);
  }
  const prefix = `${zone.id}:${groupId}:`;
  if (!openKey.startsWith(prefix)) return null;
  return openKey.slice(prefix.length);
}
 
/** 선택된 장소를 목록 맨 앞으로 */
export function sortGuideItemsWithSelectedFirst<T extends { id: string }>(
  items: T[],
  selectedId: string | null,
): T[] {
  if (!selectedId) return items;
  const index = items.findIndex((item) => item.id === selectedId);
  if (index <= 0) return items;
  const selected = items[index]!;
  return [selected, ...items.slice(0, index), ...items.slice(index + 1)];
}
 
// ----------------------------------------------------------------
// 세부 시티
// ----------------------------------------------------------------
 
const CEBU_CITY_SIGHTS: CebuGuideItem[] = [
  {
    id: "sto-nino-magellan",
    title: "(유적지) 산토니뇨 성당 & 마젤란 십자가",
    mapsQuery: "Basilica Minore del Santo Niño de Cebu and Magellan's Cross, Cebu City",
    mapPin: { lat: 10.2942, lng: 123.9012 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223350366225", label: "자세히 보기" },
    description:
      "세부를 대표하는 16세기 성당과 마젤란이 세운 십자가가 있는 광장입니다. 세부 역사·문화 여행의 출발점으로, 필리핀 최초 기독교 유적지로 알려져 있습니다. 순례·행사 일정에 따라 매우 붐빌 수 있으니 단정한 복장을 권장합니다.",
    address: "Osmena Blvd, Cebu City (마젤란 십자가: 성당 맞은편 예배당)",
    rating: "⭐ 4.3",
    openingHours: "매일 06:00 - 19:00 / 미사 시간 방문 시 복장 단정 필수",
  },
  {
    id: "fort-san-pedro",
    title: "(유적지) 산 페드로 요새",
    mapsQuery: "Fort San Pedro, Cebu City",
    mapPin: { lat: 10.2923, lng: 123.9056 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223415023988", label: "자세히 보기" },
    description:
      "스페인 식민 시대에 세워진 필리핀 최초의 삼각형 요새입니다. 세부 시티 중심에 있어 마젤란 십자가·산토니뇨 성당과 한 동선으로 묶기 좋습니다. 우천 시 계단·야외 구간이 미끄러울 수 있으니 주의하세요.",
    address: "A. Pigafetta St, Plaza Independencia, Cebu City",
    rating: "⭐ 3.8",
    openingHours: "매일 08:00 - 19:00 / 입장료: 외국인 ₱50, 내국인 ₱30",
  },
  {
    id: "tops-hill",
    title: "(전망대) 탑스힐",
    mapsQuery: "Tops Lookout, Cebu City",
    mapPin: { lat: 10.3335, lng: 123.8703 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223606554053", label: "자세히 보기" },
    description:
      "세부 시내와 바다가 한눈에 내려다보이는 전망대입니다. 세부 야경 명소로도 유명하며, 해 질 무렵 노을과 야경을 함께 감상할 수 있습니다. 주말·저녁에는 차량과 인파가 몰릴 수 있으니 안전 운행에 유의하세요.",
    address: "Tops Rd, Busay, Cebu City",
    rating: "⭐ 4.1",
    openingHours: "매일 09:00 - 22:00 / 입장료: ₱60",
  },
  {
    id: "la-parisienne-sky",
    title: "(전망대) 라 파리지엔 스카이",
    mapsQuery: "La Parisienne Sky Tops Road Busay Cebu City",
    mapPin: { lat: 10.37267, lng: 123.87085 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223133686404", label: "자세히 보기" },
    description:
      "부사이 언덕에 있는 전망·다이닝 스팟입니다. 세부 시내를 내려다보며 식사·음료를 즐길 수 있어 세부 데이트 코스·특별한 식사 장소로 인기 있습니다. 예약·드레스 코드는 업체 안내를 확인하세요.",
    address: "Tops Rd, Busay, Cebu City",
    rating: "⭐ 4.2",
    openingHours: "매일 10:00 - 22:00",
  },
  {
    id: "temple-leah",
    title: "(사진 명소) 레아 신전",
    mapsQuery: "Temple of Leah, Cebu City",
    mapPin: { lat: 10.4027, lng: 123.8675 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/222868484748", label: "자세히 보기" },
    description:
      "부사이 언덕에 있는 그리스 신전 스타일 건축물로, 세부 인생샷 명소로 유명합니다. 아내를 향한 사랑으로 지어진 곳으로 알려져 있으며, 세부 시내와 바다를 함께 조망할 수 있습니다. 입장료·운영 시간은 변동될 수 있어 방문 전 확인을 권장합니다.",
    address: "Cebu Transcentral Hwy, Busay, Cebu City",
    rating: "⭐ 4.5",
    openingHours: "매일 07:00 - 18:00 / 입장료: 평일 ₱120, 주말 ₱150",
  },
  {
    id: "sirao-little-kyoto",
    title: "(사진 명소) 리틀 교토",
    mapsQuery: "Sirao Little Kyoto, Cebu City",
    mapPin: { lat: 10.409, lng: 123.8614 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223213748142", label: "자세히 보기" },
    description:
      "시라오 언덕에 조성된 일본풍 포토 스팟입니다. 붉은 도리이·정원이 어우러져 세부에서 일본 감성 사진을 찍을 수 있는 이색 명소입니다. 산길·날씨를 감안해 이동 시간을 넉넉히 잡고, 해 질 무렵에는 사람이 몰릴 수 있습니다.",
    address: "Babag II, Busay, Cebu City (Sachiko's Little Kyoto)",
    rating: "⭐ 4.4",
    openingHours: "매일 08:00 - 17:00",
  },
  {
    id: "sirao-garden",
    title: "(사진 명소) 시라오 가든",
    mapsQuery: "Sirao Garden, Cebu City",
    mapPin: { lat: 10.4052, lng: 123.8628 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/222859519275", label: "자세히 보기" },
    description:
      "시라오 언덕의 꽃 정원·조형물 촬영지입니다. 세부 SNS 인증샷 명소로, 형형색색 꽃밭을 배경으로 사진을 남기기 좋습니다. 리틀 교토와 같은 동선으로 묶어 방문하는 경우가 많습니다.",
    address: "Sirao, Busay, Cebu City",
    rating: "⭐ 3.9",
    openingHours: "매일 07:00 - 17:00",
  },
  {
    id: "taoist-temple",
    title: "(사진 명소) 도교 사원",
    mapsQuery: "Cebu Taoist Temple, Beverly Hills, Cebu City",
    mapPin: { lat: 10.333, lng: 123.8863 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223265191275", label: "자세히 보기" },
    description:
      "비버리힐스 언덕에 있는 화려한 중국식 도교 사원입니다. 붉은 계단·용 조각·전망대가 어우러져 세부 이색 포토 스팟으로 인기 있습니다. 사원 예절·촬영 제한이 있을 수 있으니 현장 안내를 따르세요.",
    address: "Beverly Hills Subdivision, Cebu City",
    rating: "⭐ 4.1",
    openingHours: "매일 06:00 - 18:00 / 무료 입장",
  },
  {
    id: "vivace-art-cafe",
    title: "(사진명소) 비바체 아트카페",
    mapsQuery: "Vivace Art Cafe Cebu City",
    mapPin: { lat: 10.281230464678377, lng: 123.87850411125076 },
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/224305604355",
      label: "자세히 보기",
    },
    address: "SM Seaside Complex 오션파크 건물 내, Cebu City",
    rating: "⭐ 4.5",
    openingHours: "매일 10:00 - 22:00 (방문 전 확인 권장)",
    description:
      "세부 감성 카페 인생샷 명소로 유명한 비바체 아트카페입니다. 화려한 아트 인테리어와 포토 스팟이 가득해 세부 여행 중 SNS 인증샷을 남기기 좋은 곳입니다. 음료와 함께 예술적인 공간을 즐길 수 있어 세부 카페 투어 필수 코스로 추천합니다.",
  },
  {
    id: "la-parisienne-cafe",
    title: "(카페) 라 파리지엔",
    mapsQuery: "La Parisienne Cebu French cafe Busay",
    mapPin: { lat: 10.37235, lng: 123.87115 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223959637117", label: "자세히 보기" },
    description:
      "부사이 언덕의 프렌치 무드 카페·레스토랑입니다. 세부에서 이국적인 분위기를 즐길 수 있는 감성 카페로, 스카이 전망 코스와 동선을 묶어 방문하는 경우가 많습니다. 주말·일몰 시간대는 웨이팅이 길어질 수 있습니다.",
    address: "Tops Rd, Busay, Cebu City",
    rating: "⭐ 4.3",
    openingHours: "매일 10:00 - 21:00",
  },
  {
    id: "verified-rooftop",
    title: "(루프탑) Verified",
    mapsQuery: "Verified Rooftop Bar Lounge Avenir Archbishop Reyes Avenue Cebu City",
    mapPin: { lat: 10.3164, lng: 123.8976 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223480996763", label: "자세히 보기" },
    description:
      "아베니어 빌딩 상층의 루프탑 바·라운지입니다. 세부 시내 야경을 감상하며 칵테일을 즐길 수 있는 세부 핫플레이스입니다. 야간 영업·연령·드레스 코드는 시즌별로 달라질 수 있으니 예약·공지를 확인하세요.",
    address: "Avenir Bldg, Archbishop Reyes Ave, Cebu City",
    rating: "⭐ 4.2",
    openingHours: "매일 17:00 - 02:00",
  },
  {
    id: "sugbo-mercado",
    title: "(야시장) 수그보 메르카도",
    mapsQuery: "Sugbo Mercado, Cebu IT Park, Cebu City",
    mapPin: { lat: 10.3185, lng: 123.9048 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/221280887833", label: "자세히 보기" },
    description:
      "IT Park 인근에서 매주 열리는 세부 대표 야시장입니다. 현지 길거리 음식·수공예품·라이브 공연을 한곳에서 즐길 수 있어 세부 여행 저녁 코스로 강력 추천합니다. 현금·간편결제 가능 여부는 매장별로 다릅니다.",
    address: "Cebu IT Park, Lahug, Cebu City",
    rating: "⭐ 4.4",
    openingHours: "목-일 17:00 - 23:00 (운영 요일 현장 확인 권장)",
  },
  {
    id: "puso-village",
    title: "(야시장) 푸소 빌리지",
    mapsQuery: "Puso Village, Cebu City near Carbon Market",
    mapPin: { lat: 10.2905, lng: 123.903 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/224281436285", label: "자세히 보기" },
    description:
      "카본 마켓 인근의 대형 푸드·야시장 단지입니다. 현지인들이 즐겨 찾는 로컬 분위기의 야시장으로, 저렴한 세부 길거리 음식을 맛보기 좋습니다. 카본 마켓·성당 일대 동선과 묶어 보기 좋습니다.",
    address: "Carbon Market 인근, Cebu City",
    openingHours: "매일 17:00 - 24:00",
  },
  {
    id: "rcx-cafe",
    title: "(체험) RCX 카페",
    mapsQuery: "RCX Cafe The Persimmon Plus MJ Cuenco Avenue Cebu City",
    mapPin: { lat: 10.3121, lng: 123.91145 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/224163912590", label: "자세히 보기" },
    description:
      "RC카 트랙과 카페를 함께 즐길 수 있는 이색 체험 공간입니다. 세부에서 색다른 실내 액티비티를 찾는 여행자에게 추천하며, 어른·아이 모두 즐길 수 있습니다. 세션 요금·예약은 방문 전 확인하세요.",
    address: "The Persimmon Plus, MJ Cuenco Ave, Cebu City",
    rating: "⭐ 4.3",
    openingHours: "매일 11:00 - 21:00",
  },
  {
    id: "cebu-fun-park",
    title: "(놀이공원) 세부 펀 파크",
    mapsQuery: "Cebu Fun Park SM Seaside City Cebu",
    mapPin: { lat: 10.28015, lng: 123.87955 },
    description:
      "SM 씨사이드·오션파크와 인접한 야외 놀이 단지입니다. 어트랙션·키즈 존이 모여 있어 아이를 동반한 세부 여행자에게 인기 있는 스팟입니다. 시즌·이벤트에 따라 입장료·운영 시간이 달라질 수 있으니 방문 전 공지를 확인하세요.",
    address: "SM Seaside Complex, Mambaling, Cebu City",
    openingHours: "매일 10:00 - 21:00",
  },
  {
    id: "cebu-ocean-park",
    title: "(수족관) 세부 오션파크",
    mapsQuery: "Cebu Ocean Park SM Seaside City Cebu",
    mapPin: { lat: 10.28105, lng: 123.87834 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223779418243", label: "자세히 보기" },
    description:
      "SM 씨사이드 인근 대형 수족관·체험 시설입니다. 세부 가족 여행 필수 코스로, 상어·가오리 터치풀, 버드쇼 등 다양한 프로그램을 운영합니다. 공연·먹이 주기 시간대는 혼잡할 수 있으니 티켓은 사전 예매를 추천합니다.",
    address: "SM Seaside Complex, F. Vestil St, Mambaling, Cebu City",
    rating: "⭐ 4.5",
    openingHours: "매일 10:00 - 18:00 (마지막 입장 17:00)",
  },
  {
    id: "plaza-bazaar",
    title: "(쇼핑) 더 플라자 바자르",
    mapsQuery: "The Plaza Bazaar Parkmall Mandaue Cebu",
    mapPin: { lat: 10.32517, lng: 123.93461 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223791827925", label: "자세히 보기" },
    description:
      "파크몰 내 바자르 형태의 쇼핑 단지입니다. 세부 기념품·잡화·의류 등을 저렴하게 구입할 수 있는 곳으로 알려져 있습니다. 매장·품목·가격은 개별 확인이 필요하며, 영수증·교환 규정을 챙겨 두면 좋습니다.",
    address: "Parkmall, Ouano Ave, Mandaue City",
    openingHours: "매일 10:00 - 21:00",
  },
];

const CEBU_CITY_ACTIVITIES: CebuGuideItem[] = [
  {
    id: "kartzone",
    title: "(카트) 카트존",
    mapsQuery: "Kartzone Cebu F Cabahug Street",
    mapPin: { lat: 10.32469, lng: 123.91856 },
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/223291372206",
      label: "자세히 보기",
    },
    address: "F. Cabahug St, Mabolo, Cebu City",
    rating: "⭐ 4.3",
    openingHours: "월-목 14:00 - 22:00 / 금-일 10:00 - 22:00",
    description:
      "실내·야외 고카트 트랙 체험 시설입니다. 세부에서 스릴 있는 드라이빙 체험을 원하는 여행자에게 추천합니다. 신장·신발·연령 제한과 랩 요금은 현장 기준을 따르세요.",
  },
  {
    id: "cebu-last-day-tour",
    title: "마지막날 투어",
    mapPin: { lat: 10.3335, lng: 123.8703 },
    description:
      "세부 여행 마지막 날을 알차게 보내는 추천 코스입니다. 탑스힐 → 시라오 가든 → 레아 신전 → 아얄라몰 → 마젤란 십자가 → 산토니뇨 성당 → 산 페드로 요새 → 오이스터 베이 → 엘스파 → 공항 순서로 돌아보는 세부 마지막 날 알짜 일정입니다.",
    address: "세부 시티 전역",
    openingHours: "새벽 일찍 출발 권장 (공항 이동 고려)",
    mapPopupLink: {
      url: "https://m.cafe.naver.com/cebutravelplanner/144626",
      label: "자세히 보기",
    },
    reservationUrl:
      "https://pf.kakao.com/_xcjmfj/chat?utm_source=cebu-places-app&utm_medium=activity&utm_campaign=last-day-tour",
    tourPins: [
      { id: "tops-hill", title: "탑스힐", lat: 10.3335, lng: 123.8703 },
      { id: "sirao-garden", title: "시라오 가든", lat: 10.4052, lng: 123.8628 },
      { id: "temple-leah", title: "레아 신전", lat: 10.4027, lng: 123.8675 },
      { id: "ayala-center", title: "아얄라몰", lat: 10.3167, lng: 123.9052 },
      { id: "magellan-cross", title: "마젤란 십자가", lat: 10.2942, lng: 123.9012 },
      { id: "sto-nino", title: "산토니뇨 성당", lat: 10.2942, lng: 123.9012 },
      { id: "fort-san-pedro", title: "산 페드로 요새", lat: 10.2923, lng: 123.9056 },
      { id: "oyster-bay", title: "오이스터 베이", lat: 10.2856, lng: 123.8812 },
      { id: "el-spa", title: "엘스파", lat: 10.315, lng: 123.905 },
      { id: "airport", title: "막탄 세부 국제공항", lat: 10.3074, lng: 123.9787 },
    ],
  },
  {
    id: "cebu-city-tour",
    title: "세부 시티투어",
    mapPin: { lat: 10.2942, lng: 123.9012 },
    description:
      "세부 시티투어는 원하는 장소만 골라 가이드·기사와 함께 다니는 맞춤형 프라이빗 투어입니다. 동선과 교통까지 알아서 계획해 드리니 편하게 즐기기만 하시면 됩니다! 방문지와 소요 시간에 따라 비용이 달라지니, 가볼만한 곳·쇼핑몰 목록을 보고 원하는 곳을 정해 문의해 주세요 😊",
    subActions: [
      {
        id: "city-tour-normal",
        icon: "🗺️",
        label: "일반코스",
        url: "",
        description:
          "세부 시티투어 일반 코스는 산토니뇨 성당 & 마젤란 십자가 → 산 페드로 요새 → 탑스힐 (점심) → 시라오 가든 → 레아 신전 → 아얄라몰 또는 SM 씨사이드 쇼핑몰 → 숙소 복귀 순서로 진행됩니다.\n\n숙소 위치와 방문하고 싶은 장소에 따라 동선 순서는 유연하게 조정되니 원하시는 코스를 말씀해 주시면 최적의 일정으로 안내해 드리겠습니다.",
      },
      {
        id: "city-tour-kids",
        icon: "👨‍👩‍👧",
        label: "아이와함께",
        url: "",
        description:
          "아이와 함께하는 시티투어 코스는 SM 씨사이드몰 → 비바체 아트카페 (또는 세부 오션파크) → 탑스힐 → 시라오 가든 → 레아 신전 순서로 다녀오는 것을 추천드립니다.\n\n숙소 위치와 방문하고 싶은 장소에 따라 동선 순서는 유연하게 조정되니 원하시는 코스를 말씀해 주시면 최적의 일정으로 안내해 드리겠습니다.",
      },
      {
        id: "city-tour-photo",
        icon: "📸",
        label: "사진위주",
        url: "",
        description:
          "세부에서 인생샷을 남기고 싶은 분들을 위한 사진 특화 코스입니다.\n\n탑스힐 → 시라오 가든 → 리틀 교토 → 레아 신전 → 도교 사원 → 비바체 아트카페 순서로 돌아보면 다양한 분위기의 포토 스팟을 하루에 모두 담을 수 있습니다. 점심은 탑스힐 인근 식당이나 SM 씨사이드몰에서 여유롭게 즐기시길 추천드립니다.\n\n방문하고 싶은 스팟과 숙소 위치에 따라 동선은 얼마든지 조정 가능하니 원하시는 코스를 말씀해 주시면 최적의 일정으로 안내해 드리겠습니다.",
      },
      {
        id: "city-tour-inquiry",
        icon: "💬",
        label: "문의하기",
        url: "https://pf.kakao.com/_xcjmfj/chat?utm_source=cebu-places-app&utm_medium=activity&utm_campaign=city-tour",
      },
    ],
  },
  {
    id: "cebu-night-tour",
    title: "나이트투어",
    mapsQuery: "Cebu City night tour",
    mapPin: { lat: 10.3185, lng: 123.9048 },
    description:
      "세부의 밤을 제대로 즐기고 싶은 분들을 위한 맞춤형 프라이빗 야간 투어입니다.\n\n탑스힐 야경, 루프탑 바, 야시장, 맛집 등 원하는 곳을 자유롭게 골라 나만의 특별한 세부 나이트 코스를 만들어보세요. 전담 가이드와 기사가 동행하여 동선·교통·안전까지 책임지기 때문에 낯선 밤길도 걱정 없이 편안하게 즐길 수 있습니다.\n\n가볼만한곳 목록에서 원하시는 곳을 골라 문의해 주세요!",
    subActions: [
      {
        id: "night-tour-regular",
        icon: "🌙",
        label: "일반코스",
        url: "",
        description:
          "나이트투어 일반 코스는 수그보 야시장 → 탑스힐 → 레아 신전 → 루프탑 → 카지노 → 만송이 장미 카페 순서로 진행됩니다.\n\n저녁 식사는 수그보 야시장이나 탑스힐 인근에서 즐기시길 추천드립니다.\n\n출발 시간·숙소 위치·원하시는 스팟에 따라 동선은 유연하게 조정될 수 있습니다.",
      },
      {
        id: "night-tour-kids",
        icon: "👨‍👩‍👧",
        label: "아이와함께",
        url: "",
        description:
          "아이와 함께하는 나이트투어 코스는 탑스힐 → 레아 신전 → 수그보 야시장 → 만송이 장미 카페 순서로 진행됩니다.\n\n저녁 식사는 탑스힐 인근 식당이나 수그보 야시장에서 즐기시길 추천드립니다.\n\n출발 시간·숙소 위치·원하시는 스팟에 따라 동선은 유연하게 조정됩니다.",
      },
      {
        id: "night-tour-photo",
        icon: "📸",
        label: "사진위주",
        url: "",
        description:
          "나이트투어 사진 특화 코스는 아얄라몰 → 탑스힐 → 레아 신전 → 수그보 야시장 → 루프탑 → 만송이 장미 카페 순서로 진행됩니다.\n\n저녁 식사는 아얄라몰, 탑스힐 인근 식당 또는 수그보 야시장에서 즐기시길 추천드립니다.\n\n출발 시간·숙소 위치·원하시는 스팟에 따라 동선은 유연하게 조정됩니다.",
      },
      {
        id: "night-tour-inquiry",
        icon: "💬",
        label: "문의하기",
        url: "https://pf.kakao.com/_xcjmfj/chat?utm_source=cebu-places-app&utm_medium=activity&utm_campaign=night-tour",
      },
    ],
  },
];

const CEBU_CITY_MALLS: CebuGuideItem[] = [
  {
    id: "sm-seaside",
    title: "(쇼핑몰) SM 씨사이드",
    mapsQuery: "SM Seaside City Cebu",
    mapPin: { lat: 10.280278, lng: 123.881944 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/220565427817", label: "자세히 보기" },
    description:
      "세부 남부 해안가에 있는 대형 복합 쇼핑몰입니다. 세부 오션파크·펀파크와 인접해 있어 쇼핑·식사·놀이를 하루에 즐기기 좋습니다. 세부 여행 쇼핑 코스로 가장 많이 추천되는 몰 중 하나입니다.",
  },
  {
    id: "sm-city",
    title: "(쇼핑몰) SM 시티",
    mapsQuery: "SM City Cebu, North Reclamation Area",
    mapPin: { lat: 10.31179, lng: 123.91805 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/221141549495", label: "자세히 보기" },
    description:
      "세부 시내에 있는 대형 쇼핑몰로 마트·패션·식당이 한곳에 모여 있습니다. 세부 시티 중심부에 위치해 접근성이 좋으며, 세부 여행 중 쇼핑과 식사를 함께 해결하기 좋습니다.",
  },
  {
    id: "sm-jmall",
    title: "(쇼핑몰) SM J몰",
    mapsQuery: "SM J Mall Mandaue Cebu",
    mapPin: { lat: 10.3352, lng: 123.9338 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223811604527", label: "자세히 보기" },
    description:
      "만다웨 일대에 있는 SM 계열 쇼핑몰입니다. 막탄·공항 동선과 가까워 세부 입출국 전후 쇼핑 코스로 자주 묶습니다.",
  },
  {
    id: "ayala-center",
    title: "(쇼핑몰) 아얄라 센터",
    mapsQuery: "Ayala Center Cebu",
    mapPin: { lat: 10.3167, lng: 123.9052 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/80197480360", label: "자세히 보기" },
    description:
      "야외 산책로와 카페·브랜드 매장이 어우러진 세부 대표 쇼핑몰입니다. 세부 여행 중 여유로운 쇼핑과 식사를 즐기기 좋은 곳으로, 세부 시티 중심에 위치해 접근성도 좋습니다.",
  },
  {
    id: "ayala-central-bloc",
    title: "(쇼핑몰) 아얄라 센트럴 블록",
    mapsQuery: "Ayala Malls Central Bloc Cebu IT Park",
    mapPin: { lat: 10.330556, lng: 123.907222 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223384265378", label: "자세히 보기" },
    description:
      "세부 IT Park 내 아얄라 계열 쇼핑몰입니다. 트렌디한 카페·식당·서점이 모여 있어 세부 여행 중 감성 쇼핑 코스로 인기 있습니다. 저녁 시간대가 붐빌 수 있습니다.",
  },
];
 
const CEBU_CITY_GOLF: CebuGuideItem[] = [
  {
    id: "ccc",
    title: "세부 컨트리 클럽 (CCC)",
    mapsQuery: "Cebu Country Club, Cebu City",
    mapPin: { lat: 10.354167, lng: 123.908333 },
    description:
      "세부 시티 인근 프라이빗 성격의 골프장입니다. 세부 골프 여행지 중 역사가 깊은 곳으로 알려져 있으며, 예약·게스트 정책은 시즌별로 다를 수 있습니다. 라운딩 전 드레스 코드를 업체에 확인하세요.",
    reservationUrl: "https://pf.kakao.com/_xcjmfj/chat",
  },
  {
    id: "alta",
    title: "알타비스타 골프 앤 컨트리 클럽",
    mapsQuery: "Alta Vista Golf and Country Club, Cebu City",
    mapPin: { lat: 10.28417, lng: 123.84902 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223747253043", label: "자세히 보기" },
    description:
      "언덕과 시티뷰가 어우러진 세부 골프장입니다. 세부 골프 여행자들에게 코스 경관이 아름답기로 유명하며, 교통·캐디·장비 렌탈 여부는 사전 문의를 권장합니다.",
    reservationUrl: "https://pf.kakao.com/_xcjmfj/chat",
  },
  {
    id: "liloan-golf",
    title: "릴로안 골프클럽",
    mapsQuery: "Liloan Golf and Leisure Estate, Liloan Cebu",
    mapPin: { lat: 10.432934, lng: 123.953541 },
    description:
      "릴로안에 있는 골프·레저 단지입니다. 세부 북부 골프 코스로, 시내에서 차로 이동 시간이 걸리므로 당일 일정은 넉넉히 잡는 편이 좋습니다. 예약·드레스 코드는 업체에 미리 확인하세요.",
    reservationUrl: "https://pf.kakao.com/_xcjmfj/chat",
  },
  {
    id: "club-filipino",
    title: "클럽 필리피노",
    mapsQuery: "Club Filipino Cebu Golf",
    mapPin: { lat: 10.507816902651863, lng: 124.01212153834916 },
    description:
      "세부 북부에 위치한 골프 클럽입니다. 아름다운 자연 경관 속에서 라운딩을 즐길 수 있으며, 예약·게스트 정책은 시즌별로 다를 수 있습니다.",
    reservationUrl: "https://pf.kakao.com/_xcjmfj/chat",
  },
];
 
// ----------------------------------------------------------------
// 막탄
// ----------------------------------------------------------------
 
const MACTAN_SIGHTS: CebuGuideItem[] = [
  {
    id: "mactan-newtown",
    title: "막탄 뉴타운",
    mapsQuery: "The Mactan Newtown Lapu-Lapu Cebu",
    mapPin: { lat: 10.3077, lng: 124.0185 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223804486767", label: "자세히 보기" },
    description:
      "막탄 뉴타운 블러바드 일대의 복합 개발 단지입니다. 해변 산책로·식당·숙소·쇼핑몰이 모여 있어 막탄 여행의 거점으로 삼기 좋습니다. 막탄 리조트 투숙객이라면 저녁 산책 코스로 강력 추천합니다.",
  },
  {
    id: "lg-garden-walk",
    title: "(아케이드) LG 가든워크",
    mapsQuery: "LG Garden Walk Mactan Lapu-Lapu",
    mapPin: { lat: 10.3073, lng: 124.0096 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223084515746", label: "자세히 보기" },
    description:
      "막탄 순환로 인근 상업 시설로 식당·키즈 아케이드·마트가 있습니다. 막탄 여행 중 가족과 함께 방문하기 좋은 실내 코스이며, 영업·입점 매장은 시기별로 바뀔 수 있습니다.",
  },
  {
    id: "mactan-shrine",
    title: "(역사) 막탄 슈라인",
    mapsQuery: "Lapu-Lapu Shrine Mactan Cebu",
    mapPin: { lat: 10.31035, lng: 123.94915 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223489405224", label: "자세히 보기" },
    description:
      "라푸라푸·마젤란 기념비가 있는 막탄 역사 관광지입니다. 필리핀 영웅 라푸라푸의 승전을 기리는 공원으로, 막탄 여행 중 역사적 의미를 되새기기 좋은 코스입니다.",
  },
  {
    id: "alegre-guitar",
    title: "(체험) 알레그레 기타 팩토리",
    mapsQuery: "Alegre Guitar Factory Pajac Maribago Lapu-Lapu",
    mapPin: { lat: 10.2938, lng: 123.9875 },
    mapPopupLink: { url: "https://cafe.naver.com/cebutravelplanner/12994", label: "자세히 보기" },
    description:
      "막탄 대표 기타·우쿨렐레 제작 공장 겸 쇼룸입니다. 세부 기타 산업의 중심지로, 기타 제작 과정을 직접 견학하고 기념품으로 구입할 수 있습니다. 막탄 여행 이색 체험 코스로 추천합니다.",
  },
  {
    id: "amazing-show",
    title: "(공연) 어메이징 쇼",
    mapsQuery: "Amazing Show Mactan Lapu-Lapu Cebu",
    mapPin: { lat: 10.2952, lng: 123.9997 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223850979659", label: "자세히 보기" },
    description:
      "막탄에서 운영하는 저녁 공연 쇼입니다. 세부 여행 중 저녁 시간을 알차게 보낼 수 있는 공연으로, 리조트 투숙객에게 인기 있습니다. 회차·티켓·픽업 옵션은 시즌마다 다를 수 있어 방문 전 예약을 권장합니다.",
  },
  {
    id: "mansongi-rose-cafe",
    title: "(카페) 만송이 장미 카페",
    mapsQuery: "10000 Roses Cafe Day-as Cordova Cebu",
    mapPin: { lat: 10.2567, lng: 123.9323 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/224011234131", label: "자세히 보기" },
    description:
      "코르도바 데이아스에 있는 LED 장미 조명 카페로 막탄 야간 인생샷 명소입니다. 수만 송이 LED 장미가 밤에 빛나는 이색 포토 스팟으로, 막탄 리조트에서 그랩으로 이동할 수 있습니다. 점등 시간·입장 요금은 현장 기준을 확인하세요.",
  },
  {
    id: "mercato-mactan",
    title: "(야시장) 막탄 메르카토",
    mapsQuery: "Mercato de Mactan Lapu-Lapu",
    mapPin: { lat: 10.3049, lng: 124.0078 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223451364466", label: "자세히 보기" },
    description:
      "막탄 저녁 야시장·푸드파크입니다. 세부 현지 음식을 저렴하게 맛볼 수 있는 막탄 여행 저녁 코스로 추천합니다. 푸드 스톨·라이브 공연 등이 있을 수 있어 영업 시간을 미리 확인하세요.",
  },
  {
    id: "food-camp-mactan",
    title: "(야시장) 푸드캠프",
    mapsQuery: "The Food Camp Lapu-Lapu Mactan Cebu",
    mapPin: { lat: 10.3032, lng: 124.0064 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223311111355", label: "자세히 보기" },
    description:
      "막탄 뉴타운 인근 야간 먹거리 스팟입니다. 다양한 세부·현지 음식을 한곳에서 즐길 수 있으며, 막탄 여행 저녁 식사 코스로 인기 있습니다. 매장 구성·운영 여부는 자주 바뀌므로 최근 후기를 함께 확인하세요.",
  },
  {
    id: "scape-skydeck",
    title: "(루프탑) 스카이덱",
    mapsQuery: "Scape Skydeck Lapu-Lapu Mactan",
    mapPin: { lat: 10.3234, lng: 123.9729 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223125719683", label: "자세히 보기" },
    description:
      "막탄 고층 루프탑 레스토랑으로 탁 트인 전망이 일품입니다. 막탄 야경을 바라보며 식사할 수 있는 세부 여행 특별 코스로, 예약·드레스 코드는 매장별로 다릅니다.",
  },
  {
    id: "grand-golden-hotel",
    title: "(루프탑) 그랜드 골든호텔",
    mapsQuery: "Grand Golden Hotel Lapu-Lapu Mactan Cebu",
    mapPin: { lat: 10.3196, lng: 123.9734 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223931903674", label: "자세히 보기" },
    description:
      "막탄 루프탑 수영장·야경을 즐길 수 있는 호텔입니다. 막탄 여행 중 특별한 저녁을 보내고 싶은 분께 추천하는 뷰 맛집입니다. 시설명·층수는 호텔 공지를 확인하세요.",
  },
  // 막탄 골프 포함
  {
    id: "mactan-island-golf-club",
    title: "(골프) 막탄 골프 에어베이스",
    mapsQuery: "Mactan Island Golf Club Lapu-Lapu Cebu",
    mapPin: { lat: 10.310273, lng: 123.968317 },
    description:
      "막탄 공항 공군기지 내 18홀 골프장으로 접근성이 뛰어납니다. 평탄한 평지형 코스로 초보자부터 시니어까지 부담 없이 라운딩하기 좋으며, 막탄 가성비 골프 코스로 현지 교민과 여행객 모두에게 사랑받는 곳입니다.",
  },
  {
    id: "hilutungan-island",
    title: "(섬) 힐룽둥안 아일랜드",
    mapsQuery: "Hilutungan Island Gilutungan Cordova Cebu",
    mapPin: { lat: 10.2082, lng: 123.9853 },
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/220396604461",
      label: "자세히 보기",
    },
    description:
      "막탄 앞바다 섬 호핑 코스에 자주 포함되는 섬입니다. 산호초 스노클링·선상 휴식 위주이며, 세부 여행 중 에메랄드빛 바다를 가까이서 즐길 수 있습니다.",
  },
  {
    id: "nalusuan-island",
    title: "(섬) 난루수안 아일랜드",
    mapsQuery: "Nalusuan Island Cebu",
    mapPin: { lat: 10.1904, lng: 124.0006 },
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/223356443287",
      label: "자세히 보기",
    },
    description:
      "막탄·코르도바 앞바다의 해양 보호구역 섬입니다. 해상 스노클링과 해변 휴식으로 유명하며, 막탄 섬 호핑 투어의 대표 포함 코스입니다.",
  },
  {
    id: "sulpa-island",
    title: "(섬) 술파 아일랜드",
    mapsQuery: "Sulpa Islet Lapu-Lapu Cebu",
    mapPin: { lat: 10.2373, lng: 124.0109 },
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/80209237578",
      label: "자세히 보기",
    },
    description:
      "막탄 출발 섬 투어에 자주 포함되는 작은 섬입니다. 세부 바다 한가운데에서 스노클링과 수영을 즐길 수 있는 포인트로 인기 있습니다.",
  },
  {
    id: "kawagan-island",
    title: "(섬) 카와간 아일랜드",
    mapsQuery: "Caohagan Island Lapu-Lapu Cebu",
    mapPin: { lat: 10.2029, lng: 124.0192 },
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/222873063819",
      label: "자세히 보기",
    },
    description:
      "카오하간으로도 불리는 막탄 섬 투어 포인트입니다. 짚라인·포토 스팟이 있는 이색 투어지로, 막탄에서 배로 이동합니다.",
  },
];
 
const MACTAN_ACTIVITIES: CebuGuideItem[] = [
  {
    id: "mactan-island-hopping",
    title: "호핑투어",
    mapsQuery: "island hopping Mactan Cebu Hilutungan Nalusuan",
    mapPin: { lat: 10.2082, lng: 123.9853 },
    description: "",
    subActions: [
      {
        id: "hopping-info",
        icon: "💡",
        label: "알면\n좋은정보",
        url: "https://m.blog.naver.com/aalove0902/221059505089",
      },
      {
        id: "hopping-islands",
        icon: "🏝️",
        label: "호핑섬\n총정리",
        url: "https://m.blog.naver.com/aalove0902/220397286614",
      },
      {
        id: "hopping-company-guide",
        icon: "🚢",
        label: "호핑업체\n선택방법",
        url: "https://m.blog.naver.com/aalove0902/224242513073",
      },
      {
        id: "hopping-companies",
        icon: "📋",
        label: "세부호핑\n업체모음",
        url: "",
      },
    ],
    companyList: [
      {
        id: "company-우리",
        icon: "🏆",
        label: "단독호핑",
        url: "https://myrealt.rip/blirf7",
        description:
          "세부여행플래너 단독호핑\n⭐ 마이리얼트립 우수업체 선정\n🎯 프라이빗 단독 투어\n✅ 한국인 직영 운영\n💬 카톡 1:1 밀착 케어",
        recommend: "👨‍👩‍👧 가족·신혼·프라이빗 원하는 분",
      },
      {
        id: "company-hanbada",
        icon: "🚢",
        label: "한바다호핑",
        url: "https://myrealt.rip/bljY03",
        description:
          "리얼후기 No.1\n🚤 초특급 요트형 방카\n🎿 제트스키 무료 포함\n✅ 현장 추가비용 없음",
        recommend: "💰 가성비 + 프리미엄 둘 다 원하는 분",
      },
      {
        id: "company-gold",
        icon: "🥇",
        label: "골드호핑",
        url: "https://myrealt.rip/bljNba",
        description:
          "만족도 No.1\n🎷 색소폰·DJ 선상 공연\n🚤 초대형 45인승 방카\n🎉 럼콕파티·워터파티 포함",
        recommend: "🎉 신나는 분위기 원하는 분",
      },
      {
        id: "company-club",
        icon: "🎉",
        label: "클럽세부",
        url: "https://myrealt.rip/blkE2c",
        description:
          "SNS 입소문 1위\n🎵 선상 클럽 파티\n🔁 재방문율 최고\n💃 MZ세대 강력 추천",
        recommend: "🕺 파티·선상클럽 원하는 MZ세대",
      },
      {
        id: "company-themark",
        icon: "🛥️",
        label: "더마크요트",
        url: "https://myrealt.rip/blk9ee",
        description:
          "프리미엄 요트 투어\n🛁 자쿠지 보유\n🍖 점심 포함\n🎿 제트스키 무료 탑승",
        recommend: "✨ 프리미엄·특별한 날 원하는 분",
      },
      {
        id: "company-pirate",
        icon: "🏴‍☠️",
        label: "해적호핑",
        url: "https://myrealt.rip/blk2ff",
        description:
          "단독호핑 강자\n🏴‍☠️ 해적 콘셉트 투어\n🎣 낚시·선상라면 포함\n👨‍👩‍👧 가족·커플 특화",
        recommend: "👨‍👩‍👧 가족·커플·콘셉트 투어 원하는 분",
      },
    ],
    faqItems: [
      {
        id: "faq-price",
        question: "세부 호핑투어 가격은 얼마인가요?",
        answer:
          "호핑투어 가격은 업체와 코스에 따라 다르지만 보통 1인 기준 1,500~3,500페소(약 3~7만원) 수준입니다. 점심·스노클링 장비·입도료가 포함된 패키지 기준이며, 클룩·마이리얼트립 예약 시 할인 혜택을 받을 수 있습니다.",
      },
      {
        id: "faq-duration",
        question: "호핑투어는 몇 시간 걸리나요?",
        answer:
          "보통 오전 8~9시에 출발해 오후 3~4시에 돌아오는 약 6~7시간 코스입니다. 방문 섬 수·날씨·업체에 따라 다를 수 있으며, 반나절(4시간) 코스도 일부 업체에서 운영합니다.",
      },
      {
        id: "faq-swim",
        question: "수영을 못해도 호핑투어에 참여할 수 있나요?",
        answer:
          "네, 수영을 못해도 참여 가능합니다. 구명조끼가 기본 제공되며, 스노클링도 구명조끼를 착용한 채로 즐길 수 있습니다. 단, 깊은 바다에서의 자유 수영은 주의가 필요합니다.",
      },
      {
        id: "faq-kids",
        question: "아이와 함께 호핑투어에 참여할 수 있나요?",
        answer:
          "네, 가족 단위 참여가 많은 투어입니다. 대부분 업체에서 어린이 요금을 별도로 적용하며, 구명조끼 착용 후 안전하게 즐길 수 있습니다. 다만 영유아(만 3세 미만)는 업체별로 탑승 제한이 있을 수 있으니 사전 확인을 권장합니다.",
      },
      {
        id: "faq-islands",
        question: "호핑투어에서 어떤 섬을 가나요?",
        answer:
          "업체에 따라 다르지만 힐룽둥안·난루수안·술파·카와간 아일랜드 중 2~3곳을 돌아보는 코스가 일반적입니다. 각 섬마다 스노클링·휴식·점심 시간이 배정됩니다.",
      },
      {
        id: "faq-lunch",
        question: "호핑투어에 점심이 포함되나요?",
        answer:
          "대부분의 패키지에 점심 도시락이 포함되어 있습니다. 보통 섬 위 또는 배 위에서 간단한 필리핀식 도시락을 먹습니다. 예약 시 점심 포함 여부를 반드시 확인하세요.",
      },
      {
        id: "faq-snorkel-gear",
        question: "스노클링 장비는 제공되나요?",
        answer:
          "네, 마스크·스노클·오리발 등 기본 스노클링 장비는 대부분 포함됩니다. 위생이 걱정되신다면 개인 마스크를 지참하시는 것도 좋습니다.",
      },
      {
        id: "faq-departure",
        question: "호핑투어는 막탄에서 출발하나요, 세부에서 출발하나요?",
        answer:
          "대부분 막탄 섬 내 선착장(마리바고·수비·코르도바 일대)에서 출발합니다. 세부 시티 호텔에서 출발하는 경우 픽업 서비스가 포함된 패키지를 이용하면 편리합니다.",
      },
      {
        id: "faq-departure-time",
        question: "호핑투어 출발 시간은 언제인가요?",
        answer:
          "보통 오전 8시~9시 사이에 출발합니다. 오전 일찍 출발할수록 파도가 잔잔하고 다른 투어객이 적어 쾌적하게 즐길 수 있습니다.",
      },
      {
        id: "faq-seasick",
        question: "멀미가 심한데 호핑투어에 참여해도 될까요?",
        answer:
          "막탄 앞바다는 비교적 파도가 잔잔한 편이지만, 멀미가 심하신 분은 출발 30분~1시간 전에 멀미약을 복용하시길 권장합니다. 특히 우기(6~11월)에는 파도가 높아질 수 있으니 주의하세요.",
      },
      {
        id: "faq-rainy-season",
        question: "우기에도 호핑투어가 가능한가요?",
        answer:
          "우기(6~11월)에도 운영하지만 날씨·파도 상황에 따라 당일 취소될 수 있습니다. 태풍 시즌(7~9월)에는 특히 변동이 잦으므로 여행 일정에 여유를 두는 것이 좋습니다.",
      },
      {
        id: "faq-cancel",
        question: "호핑투어 취소·환불 정책은 어떻게 되나요?",
        answer:
          "클룩·마이리얼트립 등 예약 플랫폼 기준으로 보통 24~48시간 전 취소 시 전액 환불이 가능합니다. 날씨로 인한 운영사 취소의 경우 전액 환불이 원칙입니다.",
      },
      {
        id: "faq-individual-vs-package",
        question: "개인 예약과 패키지 예약의 차이는 무엇인가요?",
        answer:
          "개인 예약(프라이빗)은 우리 일행만 보트를 전세내는 방식으로 자유도가 높지만 비용이 높습니다. 패키지(조인 투어)는 다른 여행객과 함께 탑승하는 방식으로 가성비가 좋습니다.",
      },
      {
        id: "faq-vs-oslob",
        question: "호핑투어와 오슬롭 투어 중 어떤 것이 더 좋을까요?",
        answer:
          "호핑투어는 막탄 출발로 이동 시간이 짧고 여러 섬을 돌아보는 코스라 부담이 적습니다. 오슬롭 투어는 새벽 이동이 필요하지만 고래상어를 만나는 특별한 경험을 할 수 있습니다. 체력·일정에 여유가 있다면 두 가지 모두 강력 추천합니다.",
      },
      {
        id: "faq-what-to-bring",
        question: "호핑투어에 무엇을 챙겨야 하나요?",
        answer:
          "수영복(미리 착용 권장)·수건·선크림·방수 케이스·여벌 옷·현금(입도료·추가 음료 등)을 준비하시면 됩니다. 물에 젖어도 되는 샌들이나 아쿠아슈즈도 유용합니다.",
      },
      {
        id: "faq-sunscreen",
        question: "선크림은 꼭 필요한가요?",
        answer:
          "세부 바다는 직사광선이 매우 강하므로 선크림은 필수입니다. 산호초 보호를 위해 '리프 세이프(Reef Safe)' 또는 미네랄 선크림 사용을 권장합니다.",
      },
      {
        id: "faq-photo",
        question: "호핑투어에서 수중 사진 촬영 서비스가 있나요?",
        answer:
          "일부 업체에서 수중 카메라 촬영 서비스를 유료로 제공합니다. 개인 방수 카메라나 핸드폰 방수 케이스를 준비하시면 직접 촬영도 가능합니다.",
      },
      {
        id: "faq-shoes",
        question: "어떤 신발을 신고 가야 하나요?",
        answer:
          "물에 젖어도 되는 샌들이나 아쿠아슈즈를 추천합니다. 선착장·섬 바닥이 미끄럽거나 산호 조각이 있을 수 있어 맨발보다는 아쿠아슈즈가 훨씬 편리합니다.",
      },
      {
        id: "faq-hotel-pickup",
        question: "호텔 픽업 서비스가 있나요?",
        answer:
          "클룩·마이리얼트립 패키지 중 픽업 포함 상품이 있습니다. 막탄 리조트 투숙객은 대부분 픽업이 가능하며, 세부 시티 호텔도 추가 요금 또는 포함으로 픽업하는 상품이 있습니다.",
      },
      {
        id: "faq-best-time",
        question: "세부 호핑투어는 몇 월이 가장 좋은가요?",
        answer:
          "건기인 11월~5월이 최적 시즌입니다. 특히 12월~4월은 파도가 잔잔하고 시야가 맑아 스노클링 조건이 가장 좋습니다. 성수기에는 예약이 빨리 차므로 미리 예약하는 것을 권장합니다.",
      },
    ],
  },
  {
    id: "mactan-diving",
    title: "스쿠버\n다이빙",
    mapsQuery: "scuba diving Mactan Cebu dive shop Maribago",
    mapPin: { lat: 10.2785, lng: 123.9812 },
    description: "",
    subActions: [
      {
        id: "diving-caution",
        icon: "⚠️",
        label: "주의사항",
        url: "",
      },
      {
        id: "diving-experience",
        icon: "🤿",
        label: "체험다이빙",
        url: "",
      },
      {
        id: "diving-license",
        icon: "🪪",
        label: "라이센스강습",
        url: "",
      },
      {
        id: "diving-fun",
        icon: "🌊",
        label: "펀다이빙",
        url: "",
      },
    ],
  },
  {
    id: "mactan-seawalk",
    title: "씨워크",
    mapsQuery: "Hadsan Beach Lapu-Lapu Cebu",
    mapPin: { lat: 10.278576025868905, lng: 123.99611401606288 },
    description:
      "헬멧을 쓰고 바닷속을 걷는 체험 액티비티입니다. 수영을 못해도 즐길 수 있어 세부 여행 중 老人·어린이도 참여 가능한 인기 체험입니다.",
    address: "막탄 핫산비치 앞바다, Lapu-Lapu City",
    openingHours: "매일 09:00 - 15:00",
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/223248904481",
      label: "자세히 보기",
    },
    subActions: [
      {
        id: "seawalk-reservation",
        icon: "💬",
        label: "예약하기",
        url: "https://pf.kakao.com/_xcjmfj/chat?utm_source=cebu-places-app&utm_medium=activity&utm_campaign=seawalk",
      },
    ],
  },
  {
    id: "mactan-parasailing",
    title: "파라세일링",
    description:
      "막탄 하늘 위에서 세부 바다를 내려다보는 파라세일링입니다. 리조트 앞 바다에서 출발하며 짜릿한 하늘 위 경험을 선사합니다.",
    address: "막탄 바다",
    openingHours: "매일 09:00 - 15:00",
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/220936895090",
      label: "자세히 보기",
    },
    subActions: [
      {
        id: "parasailing-reservation",
        icon: "💬",
        label: "예약하기",
        url: "https://pf.kakao.com/_xcjmfj/chat?utm_source=cebu-places-app&utm_medium=activity&utm_campaign=parasailing",
      },
    ],
  },
  {
    id: "mactan-shooting",
    title: "실탄사격",
    mapsQuery: "Hotshot Shooting Range Mactan Cebu J Park",
    mapPin: { lat: 10.275623819542906, lng: 123.9878151382377 },
    mapPopupLink: {
      url: "https://m.blog.naver.com/aalove0902/222757614419",
      label: "자세히 보기",
    },
    description:
      "막탄에 있는 실탄 사격 체험 시설입니다. 세부 여행 이색 액티비티로 인기 있으며, 다양한 종류의 총기를 체험할 수 있습니다.",
    address: "막탄 제이파크 인근, Lapu-Lapu City",
    openingHours: "매일 09:00 - 16:00",
    subActions: [
      {
        id: "shooting-reservation",
        icon: "📞",
        label: "예약하기",
        url: "https://pf.kakao.com/_xcjmfj/chat?utm_source=cebu-places-app&utm_medium=activity&utm_campaign=shooting",
      },
    ],
  },
];
 
// ----------------------------------------------------------------
// 세부외곽 (split으로 변환)
// ----------------------------------------------------------------
 
const OUTSKIRTS_SIGHTS: CebuGuideItem[] = [
  {
    id: "moalboal-turtle-sardines",
    title: "(모알보알) 바다거북·정어리 떼 스노클링",
    mapsQuery: "Panagsama Beach sardine run sea turtles Moalboal",
    mapPin: { lat: 9.944, lng: 123.3839 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/222827690573", label: "자세히 보기" },
    description:
      "모알보알 파나그사마 비치 앞바다는 세부 스노클링 명소 중 단연 손꼽히는 곳입니다. 수백만 마리의 정어리 떼와 야생 바다거북을 해변 바로 앞에서 스노클링으로 만날 수 있습니다. 세부에서 당일 모알보알 투어로 이용하거나 현지 숙박 후 방문하는 것이 일반적입니다.",
  },
  {
    id: "moalboal-white-beach",
    title: "(모알보알) 화이트 비치",
    mapsQuery: "Basdaku White Beach Moalboal Cebu",
    mapPin: { lat: 9.9856, lng: 123.3843 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223070023937", label: "자세히 보기" },
    description:
      "바스다쿠(화이트 비치)로 불리는 모알보알 대표 백사장입니다. 세부 남부 해변 여행지로 인기 있으며, 해변을 따라 숙소·식당이 늘어서 있어 1박 이상 머물기 좋습니다.",
  },
  {
    id: "mantayupan-falls",
    title: "(모알보알) 만타유판 폭포",
    mapsQuery: "Mantayupan Falls Barili Cebu",
    mapPin: { lat: 10.1009, lng: 123.5358 },
    description:
      "바릴리에 있는 세부 외곽 폭포 트래킹 명소입니다. 높은 낙폭으로 알려져 있으며, 모알보알에서 북쪽으로 이어 붙이는 일정이 많습니다.",
  },
  {
    id: "moalboal-day-tour",
    title: "(모알보알) 당일 투어",
    mapsQuery: "Moalboal day tour Cebu snorkeling canyoneering",
    mapPin: { lat: 9.944, lng: 123.3839 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/222827690573", label: "자세히 보기" },
    description:
      "세부에서 출발하는 모알보알 당일 투어 패키지입니다. 정어리 떼 스노클링·바다거북 만나기·가와산 캐녀닝·화이트 비치를 하루에 즐길 수 있습니다. 클룩이나 현지 투어사를 통해 예약하면 픽업·드롭 서비스가 포함됩니다.",
  },
  {
    id: "moalboal-canyoneering",
    title: "(모알보알) 캐녀닝",
    mapsQuery: "Kawasan Falls canyoneering Badian Cebu",
    mapPin: { lat: 9.802, lng: 123.374 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223731391176", label: "자세히 보기" },
    description:
      "세부 캐녀닝은 바디안 가와산 계곡에서 즐기는 세부 최고 인기 액티비티 중 하나입니다. 계곡 트래킹·다이빙·클리프 점프·튜빙을 하며 가와산 폭포까지 내려오는 코스로, 스릴과 자연을 동시에 경험할 수 있습니다. 모알보알 숙소 또는 세부 시티에서 당일 투어로 이용 가능합니다. 안전·장비·폐쇄 구간은 현지 통제를 확인하세요.",
  },
  {
    id: "moalboal-aguinid-falls",
    title: "(모알보알) 아귀니드 폭포 트래킹",
    mapsQuery: "Aguinid Falls Samboan Cebu",
    mapPin: { lat: 9.5066, lng: 123.3022 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223185814212", label: "자세히 보기" },
    description:
      "삼보안의 단계식 폭포를 오르는 세부 트래킹 액티비티입니다. 총 7단계의 폭포를 암벽 타기·로프 등반으로 오르는 이색 체험으로, 세부 여행 중 도전적인 액티비티를 원하는 분께 추천합니다. 가이드 동반 필수이며 현장 안내를 따르세요.",
  },
  {
    id: "moalboal-dao-falls",
    title: "(모알보알) 다오 폭포 트래킹",
    mapsQuery: "Dao Falls Samboan Cebu",
    mapPin: { lat: 9.5433, lng: 123.3168 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/222886304001", label: "자세히 보기" },
    description:
      "삼보안에 있는 세부 폭포 트래킹 명소입니다. 아귀니드 폭포와 같은 날 동선으로 묶는 경우가 많으며, 세부 자연 액티비티를 좋아하는 여행자에게 추천합니다.",
  },
  {
    id: "oslob-whale-shark",
    title: "(오슬롭) 고래상어 투어",
    mapsQuery: "Oslob whale shark watching Tan-awan Cebu",
    mapPin: { lat: 9.4621, lng: 123.3786 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223103304119", label: "자세히 보기" },
    description:
      "세부 오슬롭 고래상어 투어는 세부 여행 버킷리스트 1순위입니다. 탄아완 해변에서 새벽부터 진행되며, 세계 최대 어류인 고래상어를 바로 눈앞에서 만날 수 있습니다. 세부에서 출발 시 새벽 3~4시 출발이 일반적이며, 수밀론 섬·투말록 폭포와 함께 패키지로 이용하면 편리합니다. 규제·시간대·거리 유지 등 지침은 수시로 바뀌므로 현지 안내를 따르세요.",
  },
  {
    id: "oslob-day-tour",
    title: "(오슬롭) 남부 일일 투어",
    mapsQuery: "Oslob day tour Cebu whale shark Sumilon Tumalog",
    mapPin: { lat: 9.4621, lng: 123.3786 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223103304119", label: "자세히 보기" },
    description:
      "세부에서 가장 인기 있는 당일 투어 코스입니다. 고래상어 수영 → 투말록 폭포 → 수밀론 아일랜드 스노클링을 하루에 즐기는 세부 남부 패키지로, 클룩·현지 투어사를 통해 예약할 수 있습니다. 새벽 출발이므로 전날 충분한 수면을 권장합니다.",
  },
  {
    id: "oslob-sumilon",
    title: "(오슬롭) 수밀론 아일랜드",
    mapsQuery: "Sumilon Island Oslob Cebu",
    mapPin: { lat: 9.4317, lng: 123.3896 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/220178145424", label: "자세히 보기" },
    description:
      "오슬롭 앞바다의 수밀론 섬으로, 에메랄드빛 백사장과 스노클링으로 유명합니다. 세부 남부 일일 투어에 고래상어·투말록 폭포와 함께 묶는 경우가 많습니다.",
  },
  {
    id: "oslob-tumalog-falls",
    title: "(오슬롭) 투말록 폭포",
    mapsQuery: "Tumalog Falls Oslob Cebu",
    mapPin: { lat: 9.4859, lng: 123.3694 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223448422116", label: "자세히 보기" },
    description:
      "오슬롭 시가에서 가까운 낙수 폭포입니다. 세부 남부 투어 코스에 자주 포함되며, 우기에는 수량이 풍부해집니다. 입장료·셔틀·계단 동선은 현장 기준입니다.",
  },
  {
    id: "oslob-monkey-village",
    title: "(오슬롭) 원숭이 마을",
    mapsQuery: "Monkey viewing Oslob Alcoy Cebu tour",
    mapPin: { lat: 9.62, lng: 123.455 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223159345141", label: "자세히 보기" },
    description:
      "세부 남부 투어에 포함되는 원숭이 관망·체험 코스입니다. 야생 원숭이를 가까이서 볼 수 있는 이색 체험 장소로, 패키지·현지 안내에 따라 동선이 다를 수 있습니다.",
  },
  {
    id: "oslob-tingko-beach",
    title: "(오슬롭) 팅코 비치",
    mapsQuery: "Tingko Beach Alcoy Cebu",
    mapPin: { lat: 9.6703, lng: 123.4996 },
    mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/223117420941", label: "자세히 보기" },
    description:
      "알코이에 있는 세부 남부 백사장 해변입니다. 세부 오슬롭·남부 일일 코스에 자주 포함되는 숨겨진 해변 명소로, 간조·만조에 따라 모래톱 넓이가 달라집니다.",
  },
  {
    id: "camotes-tour",
    title: "(카모테스) 섬 투어",
    mapsQuery: "Camotes Island tour Cebu ferry Danao",
    mapPin: { lat: 10.65, lng: 124.36 },
    description:
      "세부 다나오항에서 페리로 약 2시간 거리의 카모테스 섬 투어입니다. 어메이징 케이브·티무보 케이브·산티아고 베이·다나오 레이크 등 자연 명소를 하루에 돌아볼 수 있습니다. 세부 외곽 섬 여행지 중 비교적 저렴하게 즐길 수 있어 인기 있습니다.",
  },
  {
    id: "camotes-amazing-cave",
    title: "(카모테스) 어메이징 케이브",
    mapsQuery: "Amazing Cave Camotes Island Cebu",
    mapPin: { lat: 10.598, lng: 124.365 },
    description:
      "카모테스 섬의 종유동·지하 호수 관광지입니다. 세부 외곽 자연 탐험 코스로, 보트·동선은 현지 투어 안내를 따르세요.",
  },
  {
    id: "camotes-timubo-cave",
    title: "(카모테스) 티무보 케이브",
    mapsQuery: "Timubo Cave San Francisco Camotes Cebu",
    mapPin: { lat: 10.6986, lng: 124.3377 },
    description:
      "카모테스 산프란시스코의 천연 동굴입니다. 수영 가능한 천연 동굴 풀로 유명하며, 세부 이색 액티비티 명소 중 하나입니다. 개방 시간·요금은 현장 기준을 확인하세요.",
  },
  {
    id: "camotes-buho-rock",
    title: "(카모테스) 부호락 클리프 다이빙",
    mapsQuery: "Buho Rock Tudela Camotes Cebu",
    mapPin: { lat: 10.6285, lng: 124.4013 },
    description:
      "카모테스 튜델라의 바위 절벽·클리프 다이빙 포인트입니다. 스릴을 즐기는 세부 여행자에게 인기 있는 이색 액티비티 명소입니다. 안전 펜스·입장 규정을 지키고 수영 실력에 맞게 이용하세요.",
  },
  {
    id: "camotes-mangodlong-rock-beach",
    title: "(카모테스) 망고들롱 락비치",
    mapsQuery: "Mangodlong Rock Beach San Francisco Camotes",
    mapPin: { lat: 10.6175, lng: 124.2834 },
    description:
      "카모테스 섬의 리조트·바위 해안이 어우러진 해변입니다. 세부에서 배로 들어가는 카모테스 여행의 대표 해변 코스입니다.",
  },
  {
    id: "camotes-santiago-bay",
    title: "(카모테스) 산티아고 베이",
    mapsQuery: "Santiago Bay San Francisco Camotes Cebu",
    mapPin: { lat: 10.5878, lng: 124.3057 },
    description:
      "얕고 잔잔한 가족 해수욕 명소입니다. 카모테스 섬 여행 중 수영·해변 휴식을 즐기기 좋으며, 날씨에 따라 수색이 달라질 수 있습니다.",
  },
  {
    id: "camotes-danao-lake",
    title: "(카모테스) 다나오 레이크",
    mapsQuery: "Lake Danao Camotes Islands San Francisco",
    mapPin: { lat: 10.6711, lng: 124.3389 },
    description:
      "카모테스의 대표 호수로 카약·보트·산책로가 있습니다. 세부 외곽 자연 여행지로, 렌탈·요금은 현지 업체 기준입니다.",
  },
  {
    id: "malapascua-island",
    title: "말라파스쿠아 아일랜드",
    mapsQuery: "Malapascua Island Daanbantayan Cebu",
    mapPin: { lat: 11.3272, lng: 124.1124 },
    description:
      "세부 북부 다안반타얀에서 배로 들어가는 작은 섬입니다. 세계적인 다이빙 명소로, 환도상어를 볼 수 있는 드문 포인트로 유명합니다. 배편·날씨에 따라 결항이 생길 수 있어 여유 일정이 필요합니다.",
  },
  {
    id: "bantayan",
    title: "반타얀 아일랜드",
    mapsQuery: "Santa Fe Bantayan Island Cebu",
    mapPin: { lat: 11.2186, lng: 123.7285 },
    description:
      "산타페 등 해변 마을이 있는 세부 북부 반타얀 섬입니다. 새하얀 모래와 맑은 바다로 세부 섬 여행지 중 손꼽히는 곳입니다. 페리로 들어가며, 바람·날씨에 따라 결항이 생길 수 있어 여유 일정이 필요합니다.",
  },
];
 
const OUTSKIRTS_ACTIVITIES: CebuGuideItem[] = [
  {
    id: "outskirts-moalboal",
    title: "모알보알",
    mapsQuery: "Moalboal Cebu",
    mapPin: { lat: 9.944, lng: 123.3839 },
    description:
      "세부에서 약 2시간 거리의 모알보알은 정어리 떼와 야생 바다거북을 스노클링으로 바로 눈앞에서 만날 수 있는 세계적인 해양 명소입니다. 캐녀닝·폭포·화이트비치까지 하루에 즐길 수 있어 세부 여행 필수 코스로 손꼽힙니다.",
    subActions: [
      {
        id: "moalboal-info",
        icon: "💡",
        label: "알면\n좋은정보",
        url: "https://m.blog.naver.com/aalove0902/222928111302",
      },
      {
        id: "moalboal-detail",
        icon: "🔍",
        label: "자세히\n보기",
        url: "https://m.cafe.naver.com/cebutravelplanner/143382",
      },
      {
        id: "moalboal-inquiry",
        icon: "💬",
        label: "문의하기",
        url: "https://pf.kakao.com/_xcjmfj/chat?utm_source=cebu-places-app&utm_medium=activity&utm_campaign=moalboal-inquiry",
      },
      {
        id: "moalboal-reservation",
        icon: "📅",
        label: "예약하기",
        url: "https://myrealt.rip/btU37d",
      },
    ],
  },
  {
    id: "outskirts-oslob",
    title: "오슬롭",
    mapsQuery: "Oslob Cebu whale shark",
    mapPin: { lat: 9.4621, lng: 123.3786 },
    description:
      "세부 남부에 위치한 오슬롭은 야생 고래상어를 바로 눈앞에서 만날 수 있는 세계적인 버킷리스트 명소입니다. 수밀론 아일랜드 스노클링·투말록 폭포와 함께 즐기는 남부 투어로 인기가 높습니다.\n\n📌 코스 표기 안내: 오 = 오슬롭 / 모 = 모알보알 / 캐 = 캐녀닝",
    subActions: [
      {
        id: "oslob-total",
        icon: "🦈",
        label: "오슬롭\n총정리",
        url: "https://m.blog.naver.com/aalove0902/223103304119",
      },
      {
        id: "oslob-tour",
        icon: "🌊",
        label: "오슬롭투어",
        url: "",
      },
      {
        id: "oslob-mo-tour",
        icon: "🐢",
        label: "오모투어",
        url: "",
      },
      {
        id: "oslob-canyoneering-tour",
        icon: "🏊",
        label: "오캐투어",
        url: "",
      },
      {
        id: "oslob-canyoneering-mo-tour",
        icon: "🗺️",
        label: "오캐모투어",
        url: "",
      },
    ],
  },
  {
    id: "outskirts-canyoneering",
    title: "캐녀닝",
    mapsQuery: "Kawasan Falls canyoneering Badian Cebu",
    mapPin: { lat: 9.802, lng: 123.374 },
    description:
      "세부 캐녀닝은 바디안 가와산 계곡에서 즐기는 세부 최고 인기 액티비티 중 하나입니다. 계곡 트래킹·다이빙·클리프 점프·튜빙을 하며 에메랄드빛 가와산 폭포까지 내려오는 짜릿한 코스로, 세부 여행의 하이라이트로 손꼽힙니다.\n\n📌 코스 표기 안내: 오 = 오슬롭 / 모 = 모알보알 / 캐 = 캐녀닝",
    subActions: [
      {
        id: "canyoneering-info",
        icon: "💡",
        label: "알면\n좋은정보",
        url: "https://m.blog.naver.com/aalove0902/223049713127",
      },
      {
        id: "canyoneering-tour",
        icon: "🏊",
        label: "캐녀닝투어",
        url: "",
      },
      {
        id: "canyoneering-mo-tour",
        icon: "🗺️",
        label: "모캐투어",
        url: "https://m.cafe.naver.com/cebutravelplanner/145892",
      },
      {
        id: "canyoneering-inquiry",
        icon: "💬",
        label: "문의하기",
        url: "https://pf.kakao.com/_xcjmfj/chat",
      },
    ],
  },
  {
    id: "outskirts-camotes",
    title: "카모테스",
    mapsQuery: "Camotes Island Cebu",
    mapPin: { lat: 10.65, lng: 124.36 },
    description:
      "세부 다나오항에서 페리로 약 2시간 거리에 위치한 카모테스 섬은 어메이징 케이브·티무보 케이브·산티아고 베이 등 자연 명소가 가득한 보석 같은 섬입니다. 세부 외곽 섬 여행지 중 비교적 한적하고 비용도 저렴해 인기 있는 당일 또는 1박 코스입니다.",
    subActions: [
      {
        id: "camotes-detail",
        icon: "🔍",
        label: "자세히보기",
        url: "https://m.cafe.naver.com/cebutravelplanner/78311",
      },
      {
        id: "camotes-inquiry",
        icon: "💬",
        label: "문의하기",
        url: "https://pf.kakao.com/_xcjmfj/chat?utm_source=cebu-places-app&utm_medium=activity&utm_campaign=camotes-inquiry",
      },
      {
        id: "camotes-reservation",
        icon: "📅",
        label: "예약하기",
        url: "https://myrealt.rip/byOOaf",
      },
    ],
  },
];
 
// ----------------------------------------------------------------
// 보홀
// ----------------------------------------------------------------
 
const BOHOL_SIGHTS: CebuGuideItem[] = [
  {
    id: "bohol-chocolate-hills",
    title: "초콜릿 힐",
    mapsQuery: "Chocolate Hills Complex Carmen Bohol Philippines",
    mapPin: { lat: 9.8297, lng: 124.111 },
    description:
      "보홀 여행 대표 명소로 콘 모양 언덕 1,200여 개가 펼쳐지는 장관입니다. 건기에는 갈색으로 변해 초콜릿처럼 보여 '초콜릿 힐'이라는 이름이 붙었습니다. 보홀 여행 중 반드시 방문해야 할 세계적 명소입니다.",
  },
  {
    id: "bohol-tarsier",
    title: "타르시어 보호구역",
    mapsQuery: "Philippine Tarsier Sanctuary Corella Bohol",
    mapPin: { lat: 9.6018, lng: 123.95 },
    description:
      "보홀 고유 동물 타르시어를 보호하는 생태 보호구역입니다. 세계에서 가장 작은 원숭이의 일종인 타르시어를 가까이서 볼 수 있어 보홀 여행 필수 코스입니다. 촬영 플래시·소음 제한이 있으니 안내를 따르세요.",
  },
  {
    id: "bohol-alona",
    title: "알로나 비치·팡라오",
    mapsQuery: "Alona Beach Panglao Bohol Philippines",
    mapPin: { lat: 9.5434, lng: 123.7712 },
    description:
      "보홀 팡라오 섬의 대표 해변입니다. 숙소·식사·다이빙 상점이 해변을 따라 늘어서 있어 보홀 여행의 베이스캠프로 삼기 좋습니다. 세부에서 배로 이동하거나 보홀 공항을 통해 접근할 수 있습니다.",
  },
  {
    id: "bohol-hinagdanan",
    title: "히낙다난 케이브",
    mapsQuery: "Hinagdanan Cave Panglao Bohol",
    mapPin: { lat: 9.5791, lng: 123.7657 },
    description:
      "팡라오 섬에 있는 보홀 천연 석회 동굴입니다. 동굴 내 신비로운 지하 연못에서 수영을 즐길 수 있어 보홀 이색 체험 명소로 인기 있습니다. 좁은 통로·계단이 있어 편한 신발을 준비하세요.",
  },
  {
    id: "bohol-loboc",
    title: "로복 강 크루즈",
    mapsQuery: "Loboc River Cruise Bohol Philippines",
    mapPin: { lat: 9.503, lng: 123.982 },
    description:
      "강변 절경을 감상하며 식사·공연을 즐기는 보홀 대표 크루즈입니다. 초록 정글 사이 강을 유람하는 보홀 여행 낭만 코스로, 점심 식사가 포함된 패키지가 일반적입니다.",
  },
  {
    id: "bohol-baclayon",
    title: "바클라온 성당",
    mapsQuery: "Baclayon Church Bohol Philippines",
    mapPin: { lat: 9.6028, lng: 123.9315 },
    description:
      "1595년에 지어진 보홀 역사 성당으로 필리핀에서 가장 오래된 석조 성당 중 하나입니다. 보홀 역사·문화 여행 코스에 빠지지 않는 유적지입니다.",
  },
  {
    id: "bohol-napaling",
    title: "나팔링 포인트",
    mapsQuery: "Napaling Point Panglao Bohol",
    mapPin: { lat: 9.5429, lng: 123.7781 },
    description:
      "팡라오 동쪽 절벽·스노클링 포인트입니다. 보홀 다이빙·스노클링 명소 중 하나로, 알로나 비치에서 가까워 접근이 편리합니다.",
  },
  {
    id: "bohol-virgin-island",
    title: "버진 아일랜드",
    mapsQuery: "Virgin Island Panglao Bohol tour",
    mapPin: { lat: 9.516, lng: 123.7 },
    description:
      "팡라오에서 배로 가는 보홀 모래톱 섬입니다. 새하얀 모래톱이 드러나는 보홀 인생샷 명소로, 보홀 섬 호핑 투어에 자주 포함됩니다.",
  },
];

const BOHOL_MASSAGE: CebuGuideItem[] = [
  {
    id: "bohol-massage-the-thai",
    title: "보홀 더타이스파",
    description: "보홀 팡라오 지역의 타이 마사지 전문 스파입니다.",
    mapsQuery: "The Thai Spa Bohol Panglao",
    mapPin: { lat: 9.559913532635205, lng: 123.77447984145888 },
    rating: "⭐ 4.5",
    address: "Panglao, Bohol",
    openingHours: "매일 11:00 - 00:00",
    reservationUrl: "https://myrealt.rip/bu1T08",
  },
  {
    id: "bohol-massage-kori",
    title: "코리스파",
    description: "보홀 팡라오 지역의 인기 마사지샵입니다.",
    mapsQuery: "Kori Spa Panglao Bohol",
    mapPin: { lat: 9.55398056165698, lng: 123.76325268632525 },
    rating: "⭐ 4.8",
    address: "Purok 5, Barangay Danao, Panglao, Bohol",
    openingHours: "매일 09:00 - 22:30",
    reservationUrl: "https://myrealt.rip/bu2Q96",
  },
  {
    id: "bohol-massage-kai",
    title: "카이스파",
    description: "보홀 팡라오 지역의 마사지샵입니다.",
    mapsQuery: "Kai Spa Panglao Bohol",
    mapPin: { lat: 9.549494311980622, lng: 123.77396629615778 },
    rating: "⭐ 3.9",
    openingHours: "매일 13:00 - 22:00",
    reservationUrl: "https://myrealt.rip/bu3P02",
  },
  {
    id: "bohol-massage-gung",
    title: "보홀 궁스파",
    description: "보홀 팡라오 지역의 프리미엄 스파입니다.",
    mapsQuery: "Gung Spa Panglao Bohol",
    mapPin: { lat: 9.550489504786485, lng: 123.77078306634486 },
    rating: "⭐ 4.5",
    address: "Panglao, Bohol",
    openingHours: "매일 11:00 - 23:30",
    reservationUrl: "https://myrealt.rip/bu3b98",
  },
  {
    id: "bohol-massage-hilot",
    title: "힐롯스파",
    description: "전통 필리핀 힐롯 마사지를 즐길 수 있는 스파입니다.",
    mapsQuery: "Hilot Spa Panglao Bohol",
    mapPin: { lat: 9.553677970701143, lng: 123.77334692499419 },
    rating: "⭐ 4.8",
    address: "Purok 7, Barangay Panglao, Bohol",
    openingHours: "매일 13:00 - 23:30",
    reservationUrl: "https://myrealt.rip/bu4U8e",
  },
  {
    id: "bohol-massage-helios",
    title: "더스톤 헬리오스스파",
    description: "보홀 지역의 마사지샵입니다.",
    mapsQuery: "Helios Spa Bohol",
    mapPin: { lat: 9.552379988193552, lng: 123.7737652573647 },
    rating: "⭐ 4.6",
    address: "Tawala, Panglao, Bohol",
    openingHours: "매일 11:00 - 23:00",
    reservationUrl: "https://myrealt.rip/bu4b39",
  },
  {
    id: "bohol-massage-hera",
    title: "헤라스파",
    description: "보홀 지역의 높은 평점을 자랑하는 스파입니다.",
    mapsQuery: "Hera Spa Bohol",
    mapPin: { lat: 9.576876428410694, lng: 123.82099633834177 },
    rating: "⭐ 4.9",
    address: "Purok 2 Dao, Dauis, Bohol",
    openingHours: "매일 10:00 - 23:00",
    reservationUrl: "https://myrealt.rip/bu8I3a",
  },
  {
    id: "bohol-massage-su",
    title: "수스파",
    description: "보홀 팡라오 지역의 인기 마사지샵입니다.",
    mapsQuery: "Su Spa Panglao Bohol",
    mapPin: { lat: 9.555372899904334, lng: 123.76064931340204 },
    rating: "⭐ 4.8",
    address: "P5 Danao, Panglao, Bohol",
    openingHours: "매일 10:00 - 23:00",
    reservationUrl: "https://myrealt.rip/bu9Sfa",
  },
  {
    id: "bohol-massage-kawa",
    title: "카와스파",
    description: "보홀 최고 평점의 스파입니다.",
    mapsQuery: "Kawa Spa Panglao Bohol",
    mapPin: { lat: 9.557693426018917, lng: 123.78172014474687 },
    rating: "⭐ 5.0",
    address: "Panglao, Bohol",
    openingHours: "매일 12:00 - 00:00",
    reservationUrl: "https://myrealt.rip/buAQdb",
  },
  {
    id: "bohol-massage-dodo",
    title: "도도스파",
    description: "보홀 팡라오 지역의 마사지샵입니다.",
    mapsQuery: "Dodo Spa Panglao Bohol",
    mapPin: { lat: 9.559286010635219, lng: 123.77534635368562 },
    rating: "⭐ 4.7",
    address: "2F Purok 3, Tawala, Panglao, Bohol",
    openingHours: "매일 10:00 - 00:00",
    reservationUrl: "https://myrealt.rip/buBX9d",
  },
  {
    id: "bohol-massage-wi",
    title: "위스파",
    description: "보홀 팡라오 지역의 높은 평점 스파입니다.",
    mapsQuery: "Wi Spa Panglao Bohol",
    mapPin: { lat: 9.5528435104411, lng: 123.76417010950567 },
    rating: "⭐ 4.9",
    address: "Panglao, Bohol",
    openingHours: "매일 13:00 - 22:00",
    reservationUrl: "https://myrealt.rip/buBe04",
  },
  {
    id: "bohol-massage-seatree",
    title: "씨트리스파",
    description: "보홀 팡라오 아모리타 리조트 내에 위치한 고급 스파입니다.",
    mapsQuery: "Sea Tree Spa Panglao Bohol",
    mapPin: { lat: 9.550143369934586, lng: 123.77728909601352 },
    rating: "⭐ 4.9",
    address: "Amorita Resort, 1 Ester A. Lim Drive, Tawala, Panglao, Bohol",
    openingHours: "매일 10:00 - 21:00",
    reservationUrl: "https://myrealt.rip/bu1Gd2",
  },
  {
    id: "bohol-massage-joy",
    title: "보홀 조이스파",
    description: "보홀 지역의 마사지샵입니다.",
    mapsQuery: "Joy Spa Bohol",
    mapPin: { lat: 9.561979038991009, lng: 123.80013515867601 },
    rating: "⭐ 4.6",
  },
  {
    id: "bohol-massage-nini",
    title: "니니스파",
    description: "보홀 지역의 인기 마사지샵입니다.",
    mapsQuery: "Nini Spa Bohol",
    mapPin: { lat: 9.568453799544773, lng: 123.80597164548836 },
    rating: "⭐ 4.8",
  },
  {
    id: "bohol-massage-footloose",
    title: "풋루스마사앤스파",
    description: "보홀 지역의 마사지샵입니다.",
    mapsQuery: "Footloose Massage Spa Bohol",
    mapPin: { lat: 9.582460865747604, lng: 123.82039120113052 },
    rating: "⭐ 4.7",
  },
  {
    id: "bohol-massage-thestone",
    title: "더스톤마사지스파",
    description: "보홀 팡라오 지역의 스톤 마사지 전문 스파입니다.",
    mapsQuery: "The Stone Massage Spa Panglao Bohol",
    mapPin: { lat: 9.552393627967204, lng: 123.77374222205653 },
    rating: "⭐ 4.9",
  },
  {
    id: "bohol-massage-jp-thai",
    title: "JP타이 네이쳐마사지스파",
    description: "보홀 팡라오 지역의 타이 마사지샵입니다.",
    mapsQuery: "JP Thai Nature Massage Spa Panglao Bohol",
    mapPin: { lat: 9.550490416527243, lng: 123.77090211955439 },
    rating: "⭐ 4.0",
  },
  {
    id: "bohol-massage-luna-tiger",
    title: "루나 타이거 스파마사지",
    description: "보홀 팡라오 지역의 마사지샵입니다.",
    mapsQuery: "Luna Tiger Spa Massage Panglao Bohol",
    mapPin: { lat: 9.551373856383979, lng: 123.76976486294282 },
    rating: "⭐ 4.8",
  },
  {
    id: "bohol-massage-nuat-thai",
    title: "Nuat Thai - Danao Panglao",
    description: "보홀 팡라오 다나오 지역의 누앗타이 마사지샵입니다.",
    mapsQuery: "Nuat Thai Danao Panglao Bohol",
    mapPin: { lat: 9.551178124392504, lng: 123.76940008250858 },
    rating: "⭐ 4.0",
  },
  {
    id: "bohol-massage-the-spa",
    title: "더스파",
    description: "보홀 팡라오 지역의 인기 스파입니다.",
    mapsQuery: "The Spa Panglao Bohol",
    mapPin: { lat: 9.551384436500946, lng: 123.76771565525345 },
    rating: "⭐ 4.8",
  },
  {
    id: "bohol-massage-yeon",
    title: "보홀 연스파",
    description: "보홀 팡라오 지역의 마사지샵입니다.",
    mapsQuery: "Yeon Spa Panglao Bohol",
    mapPin: { lat: 9.55295028829058, lng: 123.76466866581 },
    rating: "⭐ 4.3",
  },
  {
    id: "bohol-massage-ole",
    title: "올레스파",
    description: "보홀 팡라오 지역의 높은 평점 스파입니다.",
    mapsQuery: "Ole Spa Panglao Bohol",
    mapPin: { lat: 9.555690511593438, lng: 123.7605273351302 },
    rating: "⭐ 4.8",
  },
  {
    id: "bohol-massage-fullmoon",
    title: "풀문 스파",
    description: "보홀 지역의 최고 평점 스파 중 하나입니다.",
    mapsQuery: "Full Moon Spa Bohol",
    mapPin: { lat: 9.587534730892047, lng: 123.73069044194797 },
    rating: "⭐ 4.9",
  },
];

const BOHOL_ACTIVITIES: CebuGuideItem[] = [
  {
    id: "bohol-hopping",
    title: "호핑투어",
    mapsQuery: "Bohol island hopping tour Panglao",
    mapPin: { lat: 9.5434, lng: 123.7712 },
    description:
      "팡라오 섬에서 출발하는 보홀 대표 해양 액티비티입니다. 발리카삭 섬·버진 아일랜드 등을 배로 돌아보며 스노클링과 돌고래 관찰을 즐길 수 있습니다.\n\n업체마다 보트 스타일과 분위기가 다양하니 본인의 여행 스타일에 맞는 업체를 선택해서 다녀오시는 것을 추천드립니다.",
    companyList: [
      {
        id: "bohol-company-hanbada",
        icon: "🚢",
        label: "한바다호핑",
        url: "https://myrealt.rip/bwSbbf",
        description:
          "대형 요트형 보트로 진행되는 호핑투어입니다.\n선상 파티·제트스키 등 다양한 즐길거리가 포함되어 있어 활기찬 분위기를 원하는 분께 추천합니다.",
        recommend: "🎉 신나는 분위기·그룹 여행을 원하는 분",
      },
      {
        id: "bohol-company-deepree",
        icon: "💰",
        label: "디프리호핑",
        url: "https://myrealt.rip/bwSh08",
        description:
          "합리적인 가격으로 핵심 코스만 알차게 즐기는 가성비 호핑투어입니다.\n불필요한 옵션 없이 실속 있게 다녀올 수 있습니다.",
        recommend: "💵 가성비를 중요하게 생각하는 분",
      },
      {
        id: "bohol-company-monkey",
        icon: "👨‍👩‍👧",
        label: "몽키호핑",
        url: "https://myrealt.rip/bwSp7f",
        description:
          "가족·커플 단위에 맞춘 프라이빗 호핑투어입니다.\n소규모로 진행되어 여유롭고 편안하게 즐길 수 있습니다.",
        recommend: "👨‍👩‍👧 가족·커플 프라이빗 투어를 원하는 분",
      },
      {
        id: "bohol-company-boholtravel",
        icon: "🧭",
        label: "보홀트래블",
        url: "https://myrealt.rip/bwSwa2",
        description:
          "현지 전문 가이드가 동행하는 보홀트래블 호핑투어입니다.\n섬과 해양 생태에 대한 자세한 설명을 들으며 알차게 즐길 수 있습니다.",
        recommend: "🗺️ 가이드 설명과 알찬 정보를 원하는 분",
      },
    ],
  },
  {
    id: "bohol-freediving",
    title: "나팔링투어",
    mapsQuery: "Napaling Point Panglao Bohol",
    mapPin: { lat: 9.5429, lng: 123.7781 },
    description:
      "나팔링은 팡라오 동쪽의 절벽 아래 수많은 정어리 떼가 군집을 이루는 보홀 숨은 명소입니다. 스노클링으로 가볍게 구경할 수도 있고, 프리다이빙으로 더 깊이 들어가면 빛이 비치는 정어리 떼 사이로 환상적인 인생샷을 남길 수 있습니다.\n\n가볍게 스노클링 위주로 즐기고 싶다면 호핑투어를, 깊이 들어가 인생샷을 남기고 싶다면 프리다이빙을 선택해 주세요!",
    companyGroups: [
      {
        groupTitle: "🚤 호핑투어로 가기",
        companies: [
          {
            id: "napaling-local-page",
            icon: "🏖️",
            label: "로컬페이지",
            url: "https://myrealt.rip/bwYY49",
            description:
              "나팔링 포인트로 가는 호핑투어 상품입니다.\n스노클링으로 가볍게 정어리 떼를 구경할 수 있습니다.",
            recommend: "🤿 가볍게 스노클링을 즐기고 싶은 분",
          },
          {
            id: "napaling-bohol-travel",
            icon: "🧭",
            label: "보홀트래블",
            url: "https://myrealt.rip/bwZfff",
            description:
              "현지 전문 가이드가 동행하는 나팔링 호핑투어입니다.\n안전하게 스노클링을 즐길 수 있습니다.",
            recommend: "🗺️ 가이드 동반 투어를 원하는 분",
          },
        ],
      },
      {
        groupTitle: "🤿 프리다이빙으로 가기",
        companies: [
          {
            id: "napaling-freediving",
            icon: "🌊",
            label: "프리다이빙",
            url: "https://myrealt.rip/bwab40",
            description:
              "나팔링 포인트에서 진행하는 프리다이빙 전문 투어입니다.\n정어리 떼 사이로 인생샷을 남길 수 있습니다.",
            recommend: "📸 인생샷·다이빙 경험을 원하는 분",
          },
          {
            id: "napaling-oraborra",
            icon: "✨",
            label: "오라보라",
            url: "https://myrealt.rip/bwatf4",
            description:
              "오라보라에서 진행하는 나팔링 프리다이빙 투어입니다.\n전문 강사와 함께 안전하게 즐길 수 있습니다.",
            recommend: "🎯 전문 강사와 안전하게 즐기고 싶은 분",
          },
        ],
      },
    ],
  },
  {
    id: "bohol-firefly",
    title: "반딧불투어",
    mapsQuery: "Bohol firefly tour Abatan River",
    mapPin: { lat: 9.8617, lng: 124.0894 },
    description:
      "아바탄 강에서 진행하는 보홀 야간 반딧불이 투어입니다. 해가 진 후 수천 마리의 반딧불이가 강변 나무를 환상적으로 수놓는 모습을 보트 위에서 감상할 수 있는 보홀 대표 야간 액티비티입니다.\n\n업체마다 포함 사항과 이동 수단·코스가 다르니 비교해 보시고 본인에게 맞는 업체를 선택하세요.",
    companyList: [
      {
        id: "firefly-letsgo-bohol",
        icon: "🚤",
        label: "레츠고보홀",
        url: "https://myrealt.rip/bxeVa5",
        description:
          "대형 보트로 진행되는 레츠고보홀 반딧불이 투어입니다. 안정적인 보트에서 편안하게 반딧불이 군무를 감상할 수 있어 가족·단체 여행객에게 인기 있는 코스입니다.",
        recommend: "👨‍👩‍👧 가족·단체 여행객",
      },
      {
        id: "firefly-bamboo-bridge",
        icon: "🎋",
        label: "밤부브릿지",
        url: "https://myrealt.rip/bxfAd3",
        description:
          "노스젠 밤부브릿지 코스가 포함된 반딧불이투어입니다. 해질 무렵 맹그로브 숲을 따라 바다로 이어지는 대나무 다리를 걸어본 후, 어두워지면 보트에 탑승해 반딧불이 군무를 감상합니다. 노을부터 반딧불이까지 한번에 즐길 수 있는 코스입니다.",
        recommend: "🌅 노을과 반딧불이를 함께 즐기고 싶은 분",
      },
      {
        id: "firefly-kayak",
        icon: "🛶",
        label: "카약",
        url: "https://myrealt.rip/bxg49c",
        description:
          "아바탄 강을 직접 카약으로 저어가며 즐기는 반딧불이 투어입니다. 엔진 소음 없이 조용하게 이동하기 때문에 반딧불이를 더욱 가까이서 생생하게 감상할 수 있는 이색 코스입니다.",
        recommend: "🛶 조용하고 생생한 체험을 원하는 분",
      },
      {
        id: "firefly-motorboat",
        icon: "🚣",
        label: "모터보트",
        url: "https://myrealt.rip/bxhQ92",
        description:
          "모터보트를 이용해 빠르고 편안하게 이동하는 반딧불이투어입니다. 이동 시간이 짧아 효율적으로 즐길 수 있으며, 안정적인 보트에서 반딧불이 군무를 감상할 수 있습니다.",
        recommend: "⏱️ 빠르고 편안하게 즐기고 싶은 분",
      },
    ],
  },
  {
    id: "bohol-land-tour",
    title: "육상투어",
    mapsQuery: "Bohol countryside land tour Chocolate Hills",
    mapPin: { lat: 9.8297, lng: 124.111 },
    description:
      "초콜릿 힐·타르시어 보호구역·로복 강 크루즈 등 보홀 대표 자연 명소를 하루에 돌아보는 보홀 육상투어입니다. 보홀 여행 중 가장 기본이 되는 코스로, 보홀 자연과 문화를 폭넓게 경험할 수 있습니다.\n\n저녁 시간대 반딧불이투어와 묶어서 진행하는 업체도 있으니 일정에 맞게 선택해 주세요.",
    companyGroups: [
      {
        groupTitle: "🚐 육상투어만 진행",
        companies: [
          {
            id: "land-tour-stein",
            icon: "⛰️",
            label: "스타인",
            url: "https://myrealt.rip/byNC29",
            description:
              "보홀 대표 명소를 알차게 돌아보는 스타인 육상투어입니다.\n초콜릿 힐·타르시어·로복 강 크루즈 등 핵심 코스를 효율적으로 즐길 수 있습니다.",
            recommend: "🗺️ 보홀 핵심 명소를 알차게 보고 싶은 분",
          },
          {
            id: "land-tour-adventure",
            icon: "🌿",
            label: "보홀어드벤쳐",
            url: "https://myrealt.rip/byNN10",
            description:
              "보홀어드벤쳐에서 진행하는 자연 친화적 육상투어입니다.\n현지 가이드와 함께 보홀의 자연을 깊이 있게 체험할 수 있습니다.",
            recommend: "🌳 보홀 자연과 생태에 관심 있는 분",
          },
        ],
      },
      {
        groupTitle: "🌙 육상투어 + 반딧불투어",
        companies: [
          {
            id: "land-tour-local-page",
            icon: "🏖️",
            label: "로컬페이지",
            url: "https://myrealt.rip/byNVb2",
            description:
              "낮에는 육상투어, 밤에는 반딧불이투어까지 하루에 즐기는 로컬페이지 패키지입니다.\n보홀 여행을 알차게 보내고 싶은 분께 추천합니다.",
            recommend: "⏰ 하루를 알차게 보내고 싶은 분",
          },
          {
            id: "land-tour-letsgo-bohol",
            icon: "🚤",
            label: "렛츠고보홀",
            url: "https://myrealt.rip/byNW63",
            description:
              "육상투어와 반딧불이투어를 함께 진행하는 렛츠고보홀 패키지입니다.\n낮과 밤 모두 알찬 일정으로 보홀을 즐길 수 있습니다.",
            recommend: "🌅 낮 투어와 야간 투어를 한번에 원하는 분",
          },
        ],
      },
    ],
  },
  {
    id: "bohol-arrival-departure",
    title: "입국\n패키지",
    mapsQuery: "Bohol airport arrival package",
    mapPin: { lat: 9.5697, lng: 123.7517 },
    description:
      "보홀 도착 비행기가 늦은 시간에 도착하는 경우가 많아, 비싼 리조트에 곧바로 체크인하면 잠만 자고 숙박비를 낭비하기 쉽습니다. 입국패키지는 상대적으로 저렴한 숙소나 마사지샵에서 하룻밤을 보내고, 다음 날 본 리조트로 이동하는 알찬 방법입니다.",
    companyList: [
      {
        id: "arrival-bs-resort",
        icon: "🏨",
        label: "BS리조트",
        url: "https://myrealt.rip/byO7b6",
        description:
          "공항 인근에 위치한 합리적인 가격의 리조트입니다. 늦은 시간 도착 후 편안하게 하룻밤을 보낼 수 있습니다.",
        recommend: "✈️ 공항 인근에서 편안하게 쉬고 싶은 분",
      },
      {
        id: "arrival-kori-spa",
        icon: "💆",
        label: "코리스파",
        url: "https://myrealt.rip/byO80c",
        description:
          "마사지와 함께 숙박을 해결할 수 있는 코리스파 입국패키지입니다. 피로를 풀고 다음 날 가벼운 몸으로 이동할 수 있습니다.",
        recommend: "💆 마사지와 숙박을 함께 해결하고 싶은 분",
      },
      {
        id: "arrival-lamedi",
        icon: "🛏️",
        label: "라메디",
        url: "https://myrealt.rip/byO967",
        description: "가성비 좋은 라메디 입국패키지입니다. 도착 첫날 부담 없이 머물기 좋습니다.",
        recommend: "💵 가성비 좋은 첫날 숙소를 원하는 분",
      },
      {
        id: "arrival-leoux",
        icon: "🌙",
        label: "레욱스",
        url: "https://myrealt.rip/byOAac",
        description:
          "편안한 휴식을 제공하는 레욱스 입국패키지입니다. 다음 날 본 리조트 이동 전 하룻밤 머물기 좋습니다.",
        recommend: "🌙 편안한 휴식 후 리조트로 이동하는 분",
      },
    ],
  },
];
 
const BOHOL_MALLS: CebuGuideItem[] = [
  {
    id: "bohol-icm",
    title: "아일랜드 시티 몰 (ICM)",
    mapsQuery: "Island City Mall Tagbilaran Bohol",
    mapPin: { lat: 9.6555, lng: 123.8745 },
    description:
      "보홀 타그빌라란 시내 대형 복합몰입니다. 마트·패션·식당이 한곳에 모여 있어 보홀 여행 중 쇼핑과 식사를 한번에 해결하기 좋습니다.",
  },
  {
    id: "bohol-alturas",
    title: "알투라스 몰 타그빌라란",
    mapsQuery: "Alturas Mall Tagbilaran Bohol",
    mapPin: { lat: 9.654, lng: 123.878 },
    description:
      "타그빌라란 중심가에 있는 보홀 대표 쇼핑몰입니다. 현지 브랜드·식사 코너가 잘 갖춰져 있으며, ICM과 가까워 함께 묶어 방문하기 좋습니다.",
  },
  {
    id: "bohol-bq",
    title: "BQ 몰 타그빌라란",
    mapsQuery: "BQ Mall Tagbilaran Bohol",
    mapPin: { lat: 9.656, lng: 123.88 },
    description:
      "보홀 시내 중형 쇼핑몰로 생활·식사·잡화 매장이 모여 있습니다.",
  },
  {
    id: "bohol-island-central",
    title: "아일랜드 센트럴 스퀘어 (팡라오)",
    mapsQuery: "Island Central Panglao Bohol",
    mapPin: { lat: 9.549, lng: 123.77 },
    description:
      "팡라오 본섬에 있는 보홀 쇼핑 단지로 알로나 비치와 가깝습니다. 보홀 팡라오 여행 중 기념품·생필품을 구입하기 좋습니다.",
  },
];
 
// ----------------------------------------------------------------
// 전체 존 배열
// ----------------------------------------------------------------
 
export const CEBU_PLACES_ZONES: CebuGuideZone[] = [
  {
    kind: "split",
    id: "cebu-city",
    title: "세부시티",
    groups: [
      { id: "sights",     label: "가볼만한 곳", items: CEBU_CITY_SIGHTS },
      { id: "activities", label: "액티비티",    items: CEBU_CITY_ACTIVITIES },
      { id: "mall",       label: "쇼핑몰",      items: CEBU_CITY_MALLS },
      { id: "golf",       label: "골프",        items: CEBU_CITY_GOLF },
    ],
  },
  {
    kind: "split",
    id: "mactan",
    title: "막탄",
    groups: [
      { id: "sights",     label: "가볼만한 곳", items: MACTAN_SIGHTS },
      { id: "activities", label: "액티비티",    items: MACTAN_ACTIVITIES },
      { id: "massage",    label: "마사지",      items: MACTAN_MASSAGE_ITEMS },
      { id: "mall",       label: "쇼핑몰",      items: [
        {
          id: "gaisano-grand-mactan",
          title: "(쇼핑몰) 가이사노 그랜드몰",
          mapsQuery: "Gaisano Grand Mall Mactan Lapu-Lapu Cebu",
          mapPin: { lat: 10.2864, lng: 123.9703 },
          mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/221426098060", label: "자세히 보기" },
          description:
            "막탄 중심부 바삭·아구스 일대의 대형 쇼핑몰입니다. 대형 슈퍼마켓·백화점과 로컬 브랜드 매장이 모여 있어 막탄 여행 중 쇼핑과 생필품 구입에 편리합니다.",
        },
        {
          id: "gaisano-mactan-island-mall",
          title: "(쇼핑몰) 가이사노 막탄 아일랜드몰",
          mapsQuery: "Gaisano Mactan Island Mall Lapu-Lapu Cebu",
          mapPin: { lat: 10.3175, lng: 123.9633 },
          mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/80197930999", label: "자세히 보기" },
          description:
            "제1다리 인근 로컬형 쇼핑몰입니다. 막탄 공항·리조트 이동 전 잠깐 들르기 좋으며, 마트·식당·잡화 매장이 한곳에 모여 있습니다.",
        },
        {
          id: "marina-mall-mactan",
          title: "(쇼핑몰) 마리나몰",
          mapsQuery: "Marina Mall Mactan Lapu-Lapu Cebu",
          mapPin: { lat: 10.3258, lng: 123.9777 },
          mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/80198224343", label: "자세히 보기" },
          description:
            "막탄·세부 국제공항 인근 전통 쇼핑몰입니다. 기념품·식당·편의 매장이 모여 있어 공항 왕복 전후에 들르기 좋습니다.",
        },
        {
          id: "island-central-mactan",
          title: "(쇼핑몰) 아일랜드 센트럴",
          mapsQuery: "Island Central Mactan Lapu-Lapu Cebu",
          mapPin: { lat: 10.32627, lng: 123.97630 },
          mapPopupLink: { url: "https://m.blog.naver.com/aalove0902/221126658848", label: "자세히 보기" },
          description:
            "공항 인근 MEPZ 일대 현대식 쇼핑몰입니다. 로빈슨 슈퍼마켓·브랜드 매장·식당이 한곳에 있으며, 마리나몰과 함께 묶어 보기 좋습니다.",
        },
      ]},
    ],
  },
  {
    kind: "split",
    id: "outskirts",
    title: "세부외곽",
    groups: [
      { id: "sights",     label: "가볼만한 곳", items: OUTSKIRTS_SIGHTS },
      { id: "activities", label: "액티비티",    items: OUTSKIRTS_ACTIVITIES },
    ],
  },
  {
    kind: "split",
    id: "bohol",
    title: "보홀",
    groups: [
      { id: "sights",     label: "가볼만한 곳", items: BOHOL_SIGHTS },
      { id: "massage",    label: "마사지",      items: BOHOL_MASSAGE },
      { id: "activities", label: "액티비티",    items: BOHOL_ACTIVITIES },
      { id: "mall",       label: "쇼핑몰",      items: BOHOL_MALLS },
    ],
  },
];