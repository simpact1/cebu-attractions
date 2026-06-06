import type { CebuGuideItem } from "./cebuPlacesData";
import { googleMapsSearchUrl, normalizeCebuLatLng, parseShopDisplayName } from "./mapCoords";

/** 막탄 마사지샵 공통 데이터 규격 */
export type MactanMassageShop = {
  name: string;
  lat: number;
  lng: number;
  desc: string;
};

const MASSAGE_IDS_PART1 = [
  "massage-oasis-spa",
  "massage-cielo-spa",
  "massage-kakao-tree",
  "massage-baan-newtown",
  "massage-sen-spa",
  "massage-lugari",
  "massage-eco-spa",
  "massage-nuathai-mactan",
  "massage-phytoncide",
  "massage-nu-spa",
  "massage-kt-cebu",
  "massage-funwe",
  "massage-nature-wellness",
  "massage-hua-villa",
  "massage-king-spa",
  "massage-cebu-glory",
  "massage-soleil",
  "massage-top-spa-nail",
  "massage-raon-square",
  "massage-raum",
] as const;

const MASSAGE_IDS_PART2 = [
  "massage-mir",
  "massage-nuathai-maribago",
  "massage-yuri-maribago",
  "massage-spa-world",
  "massage-baan-maribago-savemore",
  "massage-baan-maribago",
  "massage-flower-tree",
  "massage-siwon",
  "massage-cebu-spa-in",
  "massage-the-thai",
  "massage-lara",
  "massage-again",
  "massage-goldmoon",
  "massage-green",
  "massage-nuathai-marigondon",
  "massage-iah",
  "massage-cient-thai",
  "massage-thai-boran",
  "massage-thai-nature-garden",
  "massage-banyan-lounge",
  "massage-l-spa",
  "massage-kannawa",
] as const;

/** 마사지샵 데이터 1부 (1~20번) */
export const MACTAN_MASSAGE_SHOPS_PART1: MactanMassageShop[] = [
  {
    name: "오아시스 스파 (Oasis Spa)",
    lat: 10.311342290288357,
    lng: 124.01857160021163,
    desc: "깔끔한 시설과 안정적인 실력의 스파",
  },
  {
    name: "치엘로 스파 (Cielo Spa)",
    lat: 10.311848956789763,
    lng: 124.02297042297324,
    desc: "고급스러운 분위기에서 힐링하기 좋은 곳",
  },
  {
    name: "카카오트리스파 (Cacao Tree Spa)",
    lat: 10.31085673405128,
    lng: 124.02224086215053,
    desc: "한국인 여행객들에게 인지도 높은 웰메이드 스파",
  },
  {
    name: "바안스파 앤 네일 뉴타운점 (Baan Spa & Nail Newtown)",
    lat: 10.308043859005956,
    lng: 124.01365042412483,
    desc: "막탄 뉴타운 위치, 마사지와 네일 동시 해결",
  },
  {
    name: "쎈스파",
    lat: 10.307716,
    lng: 124.009916,
    desc: "가성비 좋고 시원한 압으로 입소문 난 곳",
  },
  {
    name: "루가리 마사지",
    lat: 10.307304,
    lng: 124.009476,
    desc: "로컬 감성과 합리적인 가격이 장점인 마사지",
  },
  {
    name: "에코스파",
    lat: 10.310102,
    lng: 123.999563,
    desc: "자연 친화적인 분위기 속 편안한 케어",
  },
  {
    name: "누앗타이 막탄",
    lat: 10.306977,
    lng: 124.010045,
    desc: "필리핀 대표 로컬 마사지 브랜드의 막탄 지점",
  },
  {
    name: "피톤치드",
    lat: 10.306497,
    lng: 124.009195,
    desc: "상쾌한 향과 깔끔한 인테리어의 쾌적한 테라피",
  },
  {
    name: "누스파",
    lat: 10.306837,
    lng: 124.008571,
    desc: "아늑한 공간에서 피로를 풀기 좋은 스파",
  },
  {
    name: "KT세부스파",
    lat: 10.305914,
    lng: 124.009426,
    desc: "자유여행객들이 편하게 들르기 좋은 접근성",
  },
  {
    name: "펀웨 스파",
    lat: 10.30576,
    lng: 124.009136,
    desc: "부담 없는 가격에 시원한 마사지를 제공하는 곳",
  },
  {
    name: "네이처 웰니스 마사지앤스파",
    lat: 10.304324,
    lng: 124.007634,
    desc: "웰니스를 모티브로 한 힐링 테라피 스파",
  },
  {
    name: "후아스파& 빌라",
    lat: 10.299594,
    lng: 124.003345,
    desc: "빌라 스타일의 프라이빗하고 고급스러운 마사지",
  },
  {
    name: "킹스파",
    lat: 10.295222,
    lng: 123.998835,
    desc: "대형 규모와 체계적인 서비스로 유명한 인기 스파",
  },
  {
    name: "세부글로리스파",
    lat: 10.295221,
    lng: 123.998418,
    desc: "여행의 시작이나 마무리에 들르기 좋은 쾌적한 샵",
  },
  {
    name: "솔레일 스파",
    lat: 10.292576,
    lng: 123.998223,
    desc: "정성스러운 케어로 여행자 피로 회복에 제격",
  },
  {
    name: "탑스파&탑네일",
    lat: 10.301338,
    lng: 124.011306,
    desc: "마사지와 고품질 네일 아트를 한 번에 즐기는 곳",
  },
  {
    name: "라온스퀘어",
    lat: 10.300467,
    lng: 124.008734,
    desc: "스파와 문화 공간이 어우러진 대형 프리미엄 시설",
  },
  {
    name: "라움스파",
    lat: 10.290078,
    lng: 123.997239,
    desc: "감성적인 인테리어와 디테일한 케어가 돋보이는 곳",
  },
];

/** 마사지샵 데이터 2부 (21~42번) */
export const MACTAN_MASSAGE_SHOPS_PART2: MactanMassageShop[] = [
  {
    name: "미르스파",
    lat: 10.29013,
    lng: 123.998752,
    desc: "여행객들의 입소문을 타고 인기를 끄는 마사지샵",
  },
  {
    name: "누앗타이마리바고",
    lat: 10.289254,
    lng: 123.999235,
    desc: "마리바고 지역의 접근성 좋은 실속형 로컬 타이 마사지",
  },
  {
    name: "유리스파마리바고",
    lat: 10.287882,
    lng: 123.999149,
    desc: "마리바고 중심가에서 편하게 들를 수 있는 스파",
  },
  {
    name: "스파월드",
    lat: 10.287259,
    lng: 123.997862,
    desc: "넓은 시설과 다양한 마사지 코스를 보유한 곳",
  },
  {
    name: "바안스파 마리바고세이브모어",
    lat: 10.286467,
    lng: 123.997508,
    desc: "세이브모어 쇼핑 후 방문하기 딱 좋은 위치의 스파",
  },
  {
    name: "바안스파 마리바고",
    lat: 10.286098,
    lng: 123.998076,
    desc: "마리바고 리조트 구역 여행객들에게 꾸준히 사랑받는 곳",
  },
  {
    name: "플라워트리스파",
    lat: 10.286174,
    lng: 123.997914,
    desc: "아기자기한 분위기와 친절한 테라피스트가 있는 샵",
  },
  {
    name: "시원스파",
    lat: 10.286003,
    lng: 123.997036,
    desc: "뭉친 근육을 시원하게 풀어주는 가이드 추천 스파",
  },
  {
    name: "세부 스파인",
    lat: 10.284198,
    lng: 123.994868,
    desc: "체형과 척추 밸런스에 집중한 전문적인 테라피 샵",
  },
  {
    name: "더타이",
    lat: 10.283461,
    lng: 123.993757,
    desc: "전통 타이 마사지의 손맛을 제대로 느낄 수 있는 곳",
  },
  {
    name: "라라스파",
    lat: 10.283779,
    lng: 123.99368,
    desc: "가성비와 실력을 모두 잡아 부담 없이 방문하는 스파",
  },
  {
    name: "어게인스파",
    lat: 10.282961,
    lng: 123.993285,
    desc: "세부 여행 중 재방문율이 높은 아늑한 마사지샵",
  },
  {
    name: "골드문스파",
    lat: 10.282617,
    lng: 123.992936,
    desc: "인테리어와 픽드랍 서비스가 훌륭한 대형 스파",
  },
  {
    name: "그린스파",
    lat: 10.275357,
    lng: 123.97617,
    desc: "깔끔하고 쾌적한 환경에서 가볍게 피로 풀기 좋은 곳",
  },
  {
    name: "누앗타이 마리곤돈",
    lat: 10.273784,
    lng: 123.97623,
    desc: "마리곤돈 교차로 인근 실속파들을 위한 로컬 스파",
  },
  {
    name: "IAH마사지",
    lat: 10.27234,
    lng: 123.979255,
    desc: "현지 느낌 물씬 풍기는 숨은 마사지 맛집",
  },
  {
    name: "시엔트 타이 스파 마사지",
    lat: 10.274651,
    lng: 123.975237,
    desc: "태국 전통 스타일의 압을 선호하는 분들에게 추천",
  },
  {
    name: "타이보란",
    lat: 10.256736,
    lng: 123.959741,
    desc: "오랜 전통의 테라피 노하우를 가진 가성비 로컬 샵",
  },
  {
    name: "타이 네이쳐 가든",
    lat: 10.256965,
    lng: 123.955444,
    desc: "초록빛 정원 분위기 속에서 조용하게 즐기는 스파",
  },
  {
    name: "반얀 스파 & 라운지",
    lat: 10.317135,
    lng: 123.978157,
    desc: "고급 리조트 스파 감성의 인테리어와 라운지 시설 완비",
  },
  {
    name: "엘스파",
    lat: 10.324587,
    lng: 123.977363,
    desc: "공항 인근 위치, 출국 전후 스케줄 관리에 최적화",
  },
  {
    name: "칸나와 웰니스 스파",
    lat: 10.322222,
    lng: 123.97584,
    desc: "정교한 테라피 프로그램으로 몸을 제대로 리프레시",
  },
];

export const MACTAN_MASSAGE_SHOPS: MactanMassageShop[] = [
  ...MACTAN_MASSAGE_SHOPS_PART1,
  ...MACTAN_MASSAGE_SHOPS_PART2,
];

const MACTAN_MASSAGE_IDS = [...MASSAGE_IDS_PART1, ...MASSAGE_IDS_PART2];

function toGuideItem(shop: MactanMassageShop, id: string): CebuGuideItem {
  const { lat, lng } = normalizeCebuLatLng(shop.lat, shop.lng);
  return {
    id,
    title: shop.name,
    description: shop.desc,
    mapPin: { lat, lng },
    googleMapsUrl: googleMapsSearchUrl(parseShopDisplayName(shop.name), lat, lng),
  };
}

/** 막탄 마사지샵 전체 (42곳) */
export const MACTAN_MASSAGE_ITEMS: CebuGuideItem[] = MACTAN_MASSAGE_SHOPS.map((shop, i) =>
  toGuideItem(shop, MACTAN_MASSAGE_IDS[i]!),
);
