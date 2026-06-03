/** 세부·막탄·세부외곽 가볼 만한 곳 (참고용, 내용은 필요 시 수정) */

export type CebuGuideItem = {
  id: string;
  title: string;
  description: string;
  /** Google 지도 앱에서 열 때 검색어(영문·지명 권장) */
  mapsQuery?: string;
  /** 마커 팝업 링크가 있으면 Google 지도 대신 이 주소를 사용합니다. */
  mapPopupLink?: { url: string; label: string };
  /** 지도에 표시할 좌표(WGS84). 통합 지도가 있는 지역 탭에서만 사용합니다. */
  mapPin?: { lat: number; lng: number };
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

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** 세부영상 탭 클릭 시 새 창으로 열 네이버 블로그 */
export const CEBU_VIDEO_BLOG_URL = "https://m.blog.naver.com/aalove0902?tab=2";

/** 통합 지도(Leaflet)를 띄우는 상단 지역 탭 */
export function zoneHasClusterMap(zone: CebuGuideZone): boolean {
  if (zone.kind === "flat") return zone.id === "outskirts";
  return zone.kind === "split" && (zone.id === "cebu-city" || zone.id === "mactan" || zone.id === "bohol");
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

/** 선택된 장소를 목록 맨 앞으로 (나머지 항목의 상대 순서는 유지) */
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

export const CEBU_PLACES_ZONES: CebuGuideZone[] = [
  {
    kind: "split",
    id: "cebu-city",
    title: "세부",
    groups: [
      {
        id: "sights",
        label: "가볼만한 곳",
        items: [
          {
            id: "cebu-ocean-park",
            title: "(수족관)세부오션파크",
            mapsQuery: "Cebu Ocean Park SM Seaside City Cebu",
            mapPin: { lat: 10.28105, lng: 123.87834 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223779418243",
              label: "자세히 보기",
            },

            description:
              "SM 세사이드 인근에 있는 대형 수족관·체험 시설입니다. 공연·급식 시간대는 혼잡할 수 있으니 티켓·입장 시간은 사전에 확인하는 편이 좋습니다.",
          },
          {
            id: "cebu-fun-park",
            title: "(놀이공원)세부 펀 파크",
            mapsQuery: "Cebu Fun Park SM Seaside City Cebu",
            mapPin: { lat: 10.28015, lng: 123.87955 },

            description:
              "세사이드·오션파크와 가까운 야외 놀이 단지로 알려져 있습니다. 시즌·이벤트에 따라 입장료·영업 시간이 달라질 수 있으니 당일 공지를 확인하세요.",
          },
          {
            id: "sto-nino-magellan",
            title: "(유적지)산토니뇨 성당 마젤란십자가",
            mapsQuery: "Basilica Minore del Santo Niño de Cebu and Magellan's Cross, Cebu City",
            mapPin: { lat: 10.2942, lng: 123.9012 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223350366225",
              label: "자세히 보기",
            },

            description:
              "세부를 대표하는 성당과 마젤란이 세운 십자가가 있는 광장 일대입니다. 순례·행사 일정에 따라 매우 붐빌 수 있으니 가방은 가볍게, 복장은 단정하게 맞추는 편이 좋습니다.",
          },
          {
            id: "fort-san-pedro",
            title: "(유적지)산 페드로 요새",
            mapsQuery: "Fort San Pedro, Cebu City",
            mapPin: { lat: 10.2923, lng: 123.9056 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223415023988",
              label: "자세히 보기",
            },

            description:
              "스페인 식민 시대 요새로 시티 중심에서 이동이 수월합니다. 계단·야외 구간이 있어 우천 시 미끄럼에 주의하세요.",
          },
          {
            id: "temple-leah",
            title: "(사진촬영)레아신전",
            mapsQuery: "Temple of Leah, Cebu City",
            mapPin: { lat: 10.4027, lng: 123.8675 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/222868484748",
              label: "자세히 보기",
            },

            description:
              "Temple of Leah(레아 신전)으로 불리는 전망·사진 명소입니다. 입장료·운영 시간은 변동될 수 있어 방문 전 공지를 확인하세요.",
          },
          {
            id: "sirao-little-kyoto",
            title: "(사진촬영)리틀교토",
            mapsQuery: "Sirao Little Kyoto, Cebu City",
            mapPin: { lat: 10.409, lng: 123.8614 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223213748142",
              label: "자세히 보기",
            },

            description:
              "시라오 일대에 조성된 일본풍 촬영 스팟입니다. 산길·날씨를 감안해 이동 시간을 넉넉히 잡고, 해 질 무렵 전후로 사람이 몰릴 수 있습니다.",
          },
          {
            id: "sirao-garden",
            title: "(사진촬영)시라오 가든",
            mapsQuery: "Sirao Garden, Cebu City",
            mapPin: { lat: 10.4052, lng: 123.8628 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/222859519275",
              label: "자세히 보기",
            },

            description:
              "시라오 언덕의 정원·조형물이 있는 인기 촬영지입니다. 택시·투어 동선이 많고 체감 기온 차가 클 수 있어 모자·수분을 챙기면 좋습니다.",
          },
          {
            id: "taoist-temple",
            title: "(사진촬영)도교사원",
            mapsQuery: "Cebu Taoist Temple, Beverly Hills, Cebu City",
            mapPin: { lat: 10.333, lng: 123.8863 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223265191275",
              label: "자세히 보기",
            },

            description:
              "비버리힐스 언덕에 있는 도교 사원으로 계단이 많습니다. 사원 예절·촬영 제한이 있을 수 있으니 현장 안내를 따르세요.",
          },
          {
            id: "sugbo-mercado",
            title: "(야시장)수그보 메르카도",
            mapsQuery: "Sugbo Mercado, Cebu IT Park, Cebu City",
            mapPin: { lat: 10.3185, lng: 123.9048 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/221280887833",
              label: "자세히 보기",
            },

            description:
              "IT Park 인근 야시장·푸드 마켓 형태로 저녁에 찾기 좋습니다. 현금·간편결제 가능 여부는 매장별로 다를 수 있습니다.",
          },
          {
            id: "puso-village",
            title: "(야시장)푸소 빌리지",
            mapsQuery: "Puso Village, Cebu City near Carbon Market",
            mapPin: { lat: 10.2905, lng: 123.903 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/224281436285",
              label: "자세히 보기",
            },

            description:
              "현지에서는 ‘푸소(Puso) 빌리지’로 불리는 대형 푸드·야시장 단지로 알려져 있습니다. 카본 마켓·성당 일대 동선과 묶어 보기 좋습니다.",
          },
          {
            id: "tops-hill",
            title: "(전망대)탑스힐",
            mapsQuery: "Tops Lookout, Cebu City",
            mapPin: { lat: 10.3335, lng: 123.8703 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223606554053",
              label: "자세히 보기",
            },

            description:
              "세부 시내와 바다가 내려다보이는 전망대입니다. 해 질 무렵·주말에는 차량과 인파가 몰릴 수 있으니 안전 운행에 유의하세요.",
          },
          {
            id: "la-parisienne-sky",
            title: "(전망대) 라 파리지엔 스카이",
            mapsQuery: "La Parisienne Sky Tops Road Busay Cebu City",
            mapPin: { lat: 10.37267, lng: 123.87085 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223133686404",
              label: "자세히 보기",
            },

            description:
              "부사이·탑스 일대 언덕에 있는 전망·다이닝 스팟으로 알려져 있습니다(‘라 비 인 더 스카이’ 등으로도 검색되는 경우가 있습니다). 산길·날씨를 감안해 이동을 잡고, 예약·드레스 코드는 업체 안내를 확인하세요.",
          },
          {
            id: "rcx-cafe",
            title: "(RC카)RCX카페",
            mapsQuery: "RCX Cafe The Persimmon Plus MJ Cuenco Avenue Cebu City",
            mapPin: { lat: 10.3121, lng: 123.91145 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/224163912590",
              label: "자세히 보기",
            },

            description:
              "RCX 카페로 알려진 RC카 트랙·음료를 함께 즐기는 공간입니다. 세션 요금·예약은 방문 전 확인하는 편이 좋습니다.",
          },
          {
            id: "la-parisienne-cafe",
            title: "(카페)세부 라 파리지엔",
            mapsQuery: "La Parisienne Cebu French cafe Busay",
            mapPin: { lat: 10.37235, lng: 123.87115 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223959637117",
              label: "자세히 보기",
            },

            description:
              "부사이 언덕 쪽 프렌치 무드 카페·식당으로 인기가 많은 곳입니다. 스카이 전망 코스와 동선을 묶는 경우가 많으며, 주말·일몰 시간대는 웨이팅이 길어질 수 있습니다.",
          },
          {
            id: "plaza-bazaar",
            title: "(짝퉁시장)더 플라자 바자르",
            mapsQuery: "The Plaza Bazaar Parkmall Mandaue Cebu",
            mapPin: { lat: 10.32517, lng: 123.93461 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223791827925",
              label: "자세히 보기",
            },

            description:
              "파크몰에 있는 바자르 형태의 매장 단지입니다. 매장·품목·가격은 개별 확인이 필요하고, 쇼핑 시 영수증·교환 규정을 챙겨 두면 좋습니다.",
          },
          {
            id: "verified-rooftop",
            title: "(루프탑)Verified",
            mapsQuery: "Verified Rooftop Bar Lounge Avenir Archbishop Reyes Avenue Cebu City",
            mapPin: { lat: 10.3164, lng: 123.8976 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223480996763",
              label: "자세히 보기",
            },

            description:
              "아베니어 빌딩 상층의 루프탑 바·라운지입니다. 야간 영업·연령·드레스 코드는 시즌별로 달라질 수 있으니 예약·공지를 확인하세요.",
          },
          {
            id: "kartzone",
            title: "(카트)카트존",
            mapsQuery: "Kartzone Cebu F Cabahug Street",
            mapPin: { lat: 10.32469, lng: 123.91856 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223291372206",
              label: "자세히 보기",
            },

            description:
              "고카트 트랙이 있는 실내·야외 시설로 알려져 있습니다. 신장·신발·연령 제한과 랩 요금은 현장 기준을 따르는 것이 안전합니다.",
          },
        ],
      },
      {
        id: "mall",
        label: "쇼핑몰",
        items: [
          {
            id: "sm-seaside",
            title: "(쇼핑몰)SM씨사이드",
            mapsQuery: "SM Seaside City Cebu",
            mapPin: { lat: 10.280278, lng: 123.881944 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/220565427817",
              label: "자세히 보기",
            },

            description:
              "해안가 대형 복합몰로 놀이·식사·쇼핑을 함께 즐기기 좋습니다. 주말·이벤트 시 주차와 교통이 복잡해질 수 있습니다.",
          },
          {
            id: "sm-city",
            title: "(쇼핑몰)SM시티",
            mapsQuery: "SM City Cebu, North Reclamation Area",
            mapPin: { lat: 10.31179, lng: 123.91805 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/221141549495",
              label: "자세히 보기",
            },

            description:
              "세부에서 오래된 대형 몰 중 하나로 마트·패션·식당이 한곳에 모여 있습니다.",
          },
          {
            id: "sm-jmall",
            title: "(쇼핑몰)SM J몰",
            mapsQuery: "SM J Mall Mandaue Cebu",
            mapPin: { lat: 10.3352, lng: 123.9338 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223811604527",
              label: "자세히 보기",
            },

            description:
              "만다웨 일대에 있는 SM 계열 몰입니다. 막탄·공항 동선과 가깝게 묶는 경우가 많습니다.",
          },
          {
            id: "ayala-center",
            title: "(쇼핑몰)아얄라센터",
            mapsQuery: "Ayala Center Cebu",
            mapPin: { lat: 10.3167, lng: 123.9052 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/80197480360",
              label: "자세히 보기",
            },

            description:
              "야외 산책로와 카페·브랜드 매장이 섞인 쇼핑·식사 코스로 인기가 많습니다.",
          },
          {
            id: "ayala-central-bloc",
            title: "(쇼핑몰)아얄라센트럴블록",
            mapsQuery: "Ayala Malls Central Bloc Cebu IT Park",
            mapPin: { lat: 10.330556, lng: 123.907222 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223384265378",
              label: "자세히 보기",
            },

            description:
              "IT Park에 있는 아얄라 몰로 카페·식사·서점 등이 모여 있습니다. 직장인·주말 방문객이 많아 저녁 시간대가 붐빌 수 있습니다.",
          },
        ],
      },
      {
        id: "golf",
        label: "골프",
        items: [
          {
            id: "ccc",
            title: "세부 컨트리 클럽",
            mapsQuery: "Cebu Country Club, Cebu City",
            mapPin: { lat: 10.354167, lng: 123.908333 },

            description:
              "세부 시티 인근 프라이빗 성격의 골프장으로, 예약·게스트 정책은 시즌별로 다를 수 있습니다. 라운딩 전 일정·드레스 코드를 업체에 확인하세요.",
          },
          {
            id: "alta",
            title: "알타비스타 골프 앤 컨트리 클럽",
            mapsQuery: "Alta Vista Golf and Country Club, Cebu City",
            mapPin: { lat: 10.28417, lng: 123.84902 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223747253043",
              label: "자세히 보기",
            },

            description:
              "언덕·시티뷰가 어우러진 코스로 알려져 있습니다. 교통·캐디·장비 렌탈 여부는 사전 문의가 좋습니다.",
          },
          {
            id: "liloan-golf",
            title: "릴로안 골프클럽",
            mapsQuery: "Liloan Golf and Leisure Estate, Liloan Cebu",
            mapPin: { lat: 10.432934, lng: 123.953541 },
            description:
              "릴로안에 있는 골프·레저 단지입니다. 세부 시티 중심에서는 차로 이동 시간이 꽤 걸릴 수 있으니 당일 일정은 넉넉히 잡는 편이 좋습니다. 예약·게스트·드레스 코드는 시즌별로 달라질 수 있어 업체에 미리 확인하세요.",
          },
        ],
      },
    ],
  },
  {
    kind: "split",
    id: "mactan",
    title: "막탄",
    groups: [
      {
        id: "sights",
        label: "가볼만한 곳",
        items: [
          {
            id: "mactan-newtown",
            title: "막탄뉴타운",
            mapsQuery: "The Mactan Newtown Lapu-Lapu Cebu",
            mapPin: { lat: 10.3077, lng: 124.0185 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223804486767",
              label: "자세히 보기",
            },

            description:
              "뉴타운 블러바드 일대의 복합 단지입니다. 해변 산책로·식당·숙소·몰이 모여 있어 하루 코스로 묶기 좋습니다.",
          },
          {
            id: "lg-garden-walk",
            title: "(아케이드몰)LG가든워크",
            mapsQuery: "LG Garden Walk Mactan Lapu-Lapu",
            mapPin: { lat: 10.3073, lng: 124.0096 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223084515746",
              label: "자세히 보기",
            },

            description:
              "막탄 순환로 인근의 상업 시설입니다. 식당·키즈 놀이(아케이드 등)·마트가 있어 가족 동반이 많습니다. 영업·입점 매장은 시기별로 바뀔 수 있습니다.",
          },
          {
            id: "mactan-shrine",
            title: "(공원)막탄슈라인",
            mapsQuery: "Lapu-Lapu Shrine Mactan Cebu",
            mapPin: { lat: 10.31035, lng: 123.94915 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223489405224",
              label: "자세히 보기",
            },

            description:
              "라푸라푸·마젤란 기념비가 있는 역사 관광지입니다. 공원·해안 산책로와 함께 짧게 둘러보기 좋습니다.",
          },
          {
            id: "alegre-guitar",
            title: "(기타공장) 알레그레 기타팩토리",
            mapsQuery: "Alegre Guitar Factory Pajac Maribago Lapu-Lapu",
            mapPin: { lat: 10.2938, lng: 123.9875 },
            mapPopupLink: {
              url: "https://cafe.naver.com/cebutravelplanner/12994",
              label: "자세히 보기",
            },

            description:
              "막탄에서도 손꼽히는 기타·우쿨렐레 제작 공장 겸 쇼룸입니다. 견학·시연은 현장 안내를 따르세요.",
          },
          {
            id: "hotshot-range",
            title: "(액티비티) 실탄사격장",
            mapsQuery: "Hotshot Shooting Range Subabasbas Lapu-Lapu",
            mapPin: { lat: 10.3225, lng: 123.9845 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/222757614419",
              label: "자세히 보기",
            },

            description:
              "막탄 일대에서 찾을 수 있는 실탄 사격 체험 시설입니다. 예약·연령·안전 교육 규정은 업체 공지를 확인하세요.",
          },
          {
            id: "amazing-show",
            title: "(공연) 어메이징쇼",
            mapsQuery: "Amazing Show Mactan Lapu-Lapu Cebu",
            mapPin: { lat: 10.2952, lng: 123.9997 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223850979659",
              label: "자세히 보기",
            },

            description:
              "저녁 공연 위주의 쇼장입니다. 회차·티켓·픽업 옵션은 시즌마다 다를 수 있어 방문 전 예약을 권장합니다.",
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
              "막탄 앞바다 쪽으로 나가는 섬 호핑 코스에 자주 포함됩니다. 스노클링·선상 휴식 위주이며, 출발 부두·요금은 선단·투어별로 다릅니다.",
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
              "막탄·코르도바 앞바다의 작은 섬으로, 해상 투어·스노클링으로 유명합니다. 입도료·시설 이용은 현지 안내를 확인하세요.",
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
              "작은 무인도에 가까운 섬으로, 막탄 출발 섬 투어에 자주 묶입니다. 입장료·시설은 변동될 수 있으니 당일 정보를 확인하세요.",
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
              "일명 카오하간(Caohagan)으로도 불리는 작은 섬입니다. 바닷길·짚라인 등 포토 스팟이 있는 투어지로 알려져 있습니다.",
          },
          {
            id: "mansongi-rose-cafe",
            title: "(카페) 만송이 장미 카페",
            mapsQuery: "10000 Roses Cafe Day-as Cordova Cebu",
            mapPin: { lat: 10.2567, lng: 123.9323 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/224011234131",
              label: "자세히 보기",
            },

            description:
              "코르도바 데이아스 일대의 LED 장미 조명이 유명한 카페입니다. 막탄에서 차·그랩으로 이동하는 동선이 됩니다. 점등 시간·입장 요금은 현장 기준을 확인하세요.",
          },
          {
            id: "mercato-mactan",
            title: "(야시장) 막탄 메르카토",
            mapsQuery: "Mercato de Mactan Lapu-Lapu",
            mapPin: { lat: 10.3049, lng: 124.0078 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223451364466",
              label: "자세히 보기",
            },

            description:
              "저녁부터 운영되는 야시장·푸드파크 형태입니다. 푸드 스톨·라이브 공연 등이 있을 수 있어 영업 시간을 미리 확인하는 것이 좋습니다.",
          },
          {
            id: "food-camp-mactan",
            title: "(야시장) 푸드캠프",
            mapsQuery: "The Food Camp Lapu-Lapu Mactan Cebu",
            mapPin: { lat: 10.3032, lng: 124.0064 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223311111355",
              label: "자세히 보기",
            },

            description:
              "막탄 뉴타운·숑 일대 야간 먹거리 스팟으로 알려진 푸드캠프입니다. 매장 구성·운영 여부는 자주 바뀌므로 최근 후기를 함께 보세요.",
          },
          {
            id: "scape-skydeck",
            title: "(루프탑) 스카이덱",
            mapsQuery: "Scape Skydeck Lapu-Lapu Mactan",
            mapPin: { lat: 10.3234, lng: 123.9729 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223125719683",
              label: "자세히 보기",
            },

            description:
              "M.L. 퀘존 대로 인근 고층 루프탑 레스토랑(스케이프 스카이덱 등)으로 알려진 전망 식사 코스입니다. 예약·드레스 코드는 매장별로 다릅니다.",
          },
          {
            id: "grand-golden-hotel",
            title: "(루프탑) 그랜드 골든호텔",
            mapsQuery: "Grand Golden Hotel Lapu-Lapu Mactan Cebu",
            mapPin: { lat: 10.3196, lng: 123.9734 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/223931903674",
              label: "자세히 보기",
            },

            description:
              "막탄 일대 호텔 루프탑·수영장·야경을 즐기려는 분들이 찾는 숙소·바 동선에 넣기 좋습니다. 시설명·층수는 호텔 공지를 확인하세요.",
          },
        ],
      },
      {
        id: "mall",
        label: "쇼핑몰",
        items: [
          {
            id: "gaisano-grand-mactan",
            title: "(쇼핑몰) 가이사노 그랜드몰",
            mapsQuery: "Gaisano Grand Mall Mactan Lapu-Lapu Cebu",
            mapPin: { lat: 10.2864, lng: 123.9703 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/221426098060",
              label: "자세히 보기",
            },
            description:
              "막탄 중심부(바삭·아구스 일대)에 있는 가이사노 그랜드몰입니다. 대형 슈퍼마켓·백화점과 로컬 브랜드 매장이 모여 있어 생필품·기념품 쇼핑에 적합합니다. 영업 시간은 매장·시즌별로 다를 수 있습니다.",
          },
          {
            id: "gaisano-mactan-island-mall",
            title: "(쇼핑몰) 가이사노 막탄 아일랜드몰",
            mapsQuery: "Gaisano Mactan Island Mall Lapu-Lapu Cebu",
            mapPin: { lat: 10.3175, lng: 123.9633 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/80197930999",
              label: "자세히 보기",
            },
            description:
              "제1다리(올드 브릿지) 인근 M.L. 퀘존 대로에 위치한 로컬형 몰입니다. 공항·리조트 이동 전 잠깐 들르기 좋고, 마트·식당·잡화 매장이 한곳에 모여 있습니다.",
          },
          {
            id: "marina-mall-mactan",
            title: "(쇼핑몰) 마리나몰",
            mapsQuery: "Marina Mall Mactan Lapu-Lapu Cebu",
            mapPin: { lat: 10.3258, lng: 123.9777 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/80198224343",
              label: "자세히 보기",
            },
            description:
              "막탄·세부 국제공항 인근에 있는 전통적인 마리나몰입니다. 기념품·식당·편의 매장이 모여 있어 공항 왕복 전후에 들르기 좋습니다. 영업 시간은 매장별로 다를 수 있습니다.",
          },
          {
            id: "island-central-mactan",
            title: "(쇼핑몰) 아일랜드 센트럴",
            mapsQuery: "Island Central Mactan Lapu-Lapu Cebu",
            mapPin: { lat: 10.32627674128991, lng: 123.9763094722816 },
            mapPopupLink: {
              url: "https://m.blog.naver.com/aalove0902/221126658848",
              label: "자세히 보기",
            },
            description:
              "공항 인근 MEPZ 일대의 현대식 쇼핑몰입니다. 로빈슨 슈퍼마켓·브랜드 매장·식당이 한곳에 모여 있으며, 맞은편 마리나몰과 함께 묶어 보기 좋습니다.",
          },
        ],
      },
      {
        id: "golf",
        label: "골프",
        items: [
          {
            id: "mactan-island-golf-club",
            title: "막탄 골프 에어베이스 (Mactan Island Golf Club)",
            mapsQuery: "Mactan Island Golf Club Lapu-Lapu Cebu",
            mapPin: { lat: 10.310273235010731, lng: 123.96831742442139 },
            description:
              "막탄 공항 공군기지(Airbase) 내에 위치하여 뛰어난 접근성을 자랑하는 18홀 규모의 골프장입니다. 평탄한 평지형 코스로 초보자부터 시니어까지 부담 없이 라운딩을 즐기기 좋으며, 가성비가 훌륭해 현지 교민들과 여행객들에게 두루 사랑받는 곳입니다.",
          },
        ],
      },
    ],
  },
  {
    kind: "flat",
    id: "outskirts",
    title: "세부외곽",
    items: [
      {
        id: "oslob-whale-shark",
        title: "(오슬롭)고래상어",
        mapsQuery: "Oslob whale shark watching Tan-awan Cebu",
        mapPin: { lat: 9.4621, lng: 123.3786 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/223103304119",
          label: "자세히 보기",
        },
        description:
          "탄아완 일대에서 운영되는 관찰 프로그램으로 유명합니다. 규제·시간대·거리 유지 등 지침은 수시로 바뀔 수 있으니 당일 현지 안내를 따르세요.",
      },
      {
        id: "oslob-tumalog-falls",
        title: "(오슬롭)투말록폭포",
        mapsQuery: "Tumalog Falls Oslob Cebu",
        mapPin: { lat: 9.4859, lng: 123.3694 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/223448422116",
          label: "자세히 보기",
        },
        description:
          "오슬롭 시가에서 가까운 낙수 폭포입니다. 입장료·셔틀·계단 동선은 현장 기준이며, 우기에는 수량이 많아질 수 있습니다.",
      },
      {
        id: "oslob-sumilon",
        title: "(오슬롭)수밀론 아일랜드",
        mapsQuery: "Sumilon Island Oslob Cebu",
        mapPin: { lat: 9.4317, lng: 123.3896 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/220178145424",
          label: "자세히 보기",
        },
        description:
          "오슬롭 앞바다의 작은 섬으로, 데이 투어·스노클링·모래톱 사진 스팟으로 묶는 경우가 많습니다. 선착장·요금은 시즌별로 확인하세요.",
      },
      {
        id: "oslob-monkey-village",
        title: "(오슬롭)원숭이 마을",
        mapsQuery: "Monkey viewing Oslob Alcoy Cebu tour",
        mapPin: { lat: 9.62, lng: 123.455 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/223159345141",
          label: "자세히 보기",
        },
        description:
          "남부 동선 투어에 포함되는 원숭이 관망·체험 코스로 알려진 곳입니다. 정확한 장소명·운영은 패키지·현지 안내에 따라 다를 수 있습니다.",
      },
      {
        id: "oslob-tingko-beach",
        title: "(오슬롭)팅코 비치",
        mapsQuery: "Tingko Beach Alcoy Cebu",
        mapPin: { lat: 9.6703, lng: 123.4996 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/223117420941",
          label: "자세히 보기",
        },
        description:
          "알코이에 있는 백사장 해변으로, 오슬롭·남부 일일 코스에 자주 섞입니다. 간조·만조에 따라 모래톱 넓이가 달라 보일 수 있습니다.",
      },
      {
        id: "moalboal-canyoneering",
        title: "(모알보알)캐녀닝",
        mapsQuery: "Kawasan Falls canyoneering Badian Cebu",
        mapPin: { lat: 9.802, lng: 123.374 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/223731391176",
          label: "자세히 보기",
        },
        description:
          "바디안 가와산 계곡 일대의 캐녀닝(계곡 하류)으로 유명합니다. 모알보알 숙소에서 당일 버스 투어로 묶는 경우가 많습니다. 안전·장비·폐쇄 구간은 현지 통제를 확인하세요.",
      },
      {
        id: "moalboal-aguinid-falls",
        title: "(모알보알)아귀니드 폭포",
        mapsQuery: "Aguinid Falls Samboan Cebu",
        mapPin: { lat: 9.5066, lng: 123.3022 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/223185814212",
          label: "자세히 보기",
        },
        description:
          "삼보안에 있는 단계식 폭포 트래킹 코스입니다. 가이드 동반·입장료 규정이 있을 수 있어 현장 안내를 따르세요. (모알보알·남서부 당일 동선에 자주 포함)",
      },
      {
        id: "moalboal-dao-falls",
        title: "(모알보알)다오폭포",
        mapsQuery: "Dao Falls Samboan Cebu",
        mapPin: { lat: 9.5433, lng: 123.3168 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/222886304001",
          label: "자세히 보기",
        },
        description:
          "삼보안의 또 다른 폭포 트레킹지로, 계단·진흙 구간이 있을 수 있습니다. 아귀니드와 같은 날 동선으로 잡는 경우가 많습니다.",
      },
      {
        id: "moalboal-turtle-sardines",
        title: "(모알보알)바다거북이 정어리떼",
        mapsQuery: "Panagsama Beach sardine run sea turtles Moalboal",
        mapPin: { lat: 9.944, lng: 123.3839 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/222827690573",
          label: "자세히 보기",
        },
        description:
          "파나그사마 앞바다의 정어리 떼·바다거북 스노클링으로 유명합니다. 파도·가시성은 날씨에 따라 달라지며, 다이빙 샵·가이드 규정을 지켜 주세요.",
      },
      {
        id: "moalboal-white-beach",
        title: "(모알보알)화이트비치",
        mapsQuery: "Basdaku White Beach Moalboal Cebu",
        mapPin: { lat: 9.9856, lng: 123.3843 },
        mapPopupLink: {
          url: "https://m.blog.naver.com/aalove0902/223070023937",
          label: "자세히 보기",
        },
        description:
          "바스다쿠(화이트 비치)로 불리는 긴 백사장입니다. 주말에는 피크닉객이 많을 수 있고, 해수욕장 안전·시설은 현지 안내를 확인하세요.",
      },
      {
        id: "moalboal-mantayupan-falls",
        title: "(모알보알)만타유판 폭포",
        mapsQuery: "Mantayupan Falls Barili Cebu",
        mapPin: { lat: 10.1009, lng: 123.5358 },
        description:
          "바릴리에 있는 높은 낙폭으로 알려져 있습니다. 모알보알에서 북쪽으로 차로 이어 붙이는 일정이 많습니다. 입장료·셔틀은 변동될 수 있습니다.",
      },
      {
        id: "camotes-amazing-cave",
        title: "(카모테스)어메이징 케이브",
        mapsQuery: "Amazing Cave Camotes Island Cebu",
        mapPin: { lat: 10.598, lng: 124.365 },
        description:
          "카모테스 제도(포로·산프란시스코 일대)의 종유동·지하 호수 관광지로 알려져 있습니다. 보트·동선은 현지 투어 안내를 따르세요.",
      },
      {
        id: "camotes-timubo-cave",
        title: "(카모테스)티무보 케이브",
        mapsQuery: "Timubo Cave San Francisco Camotes Cebu",
        mapPin: { lat: 10.6986, lng: 124.3377 },
        description:
          "산프란시스코에 있는 천연 동굴입니다. 계단·어두운 구간이 있어 편한 신발과 조명을 준비하고, 개방 시간·요금은 현장 기준을 확인하세요.",
      },
      {
        id: "camotes-mangodlong-rock-beach",
        title: "(카모테스)망고들롱 락비치",
        mapsQuery: "Mangodlong Rock Beach San Francisco Camotes",
        mapPin: { lat: 10.6175, lng: 124.2834 },
        description:
          "리조트·바위 해안이 어우러진 동네로, 카모테스 숙박·해변 산책 코스에 자주 넣습니다.",
      },
      {
        id: "camotes-santiago-bay",
        title: "(카모테스)산티아고 베이",
        mapsQuery: "Santiago Bay San Francisco Camotes Cebu",
        mapPin: { lat: 10.5878, lng: 124.3057 },
        description:
          "얕고 잔잔한 편인 해변으로 가족·수영 목적으로 찾는 경우가 많습니다. 날씨에 따라 수색이 달라질 수 있습니다.",
      },
      {
        id: "camotes-buho-rock",
        title: "(카모테스)부호락",
        mapsQuery: "Buho Rock Tudela Camotes Cebu",
        mapPin: { lat: 10.6285, lng: 124.4013 },
        description:
          "튜델라에 있는 바위 절벽·다이빙 포인트로 유명한 스팟입니다. 안전 펜스·입장 규정을 지키고, 수영 실력에 맞게 이용하세요.",
      },
      {
        id: "camotes-danao-lake",
        title: "(카모테스)다나오 레이크",
        mapsQuery: "Lake Danao Camotes Islands San Francisco",
        mapPin: { lat: 10.6711, lng: 124.3389 },
        description:
          "카모테스의 대표 호수로, 카약·보트·주변 산책로가 있습니다. 렌탈·요금은 현지 업체 기준이며 호수 일대는 기상에 따라 운항이 제한될 수 있습니다.",
      },
      {
        id: "malapascua-island",
        title: "말라바스쿠아 아일랜드",
        mapsQuery: "Malapascua Island Daanbantayan Cebu",
        mapPin: { lat: 11.3272, lng: 124.1124 },
        description:
          "다안반타얀에서 배로 들어가는 북부 작은 섬으로, 다이빙·비치 휴양으로 유명합니다. 배편·날씨에 따라 결항이 생길 수 있어 여유 일정이 좋습니다.",
      },
      {
        id: "bantayan",
        title: "반타얀 아일랜드",
        mapsQuery: "Santa Fe Bantayan Island Cebu",
        mapPin: { lat: 11.2186, lng: 123.7285 },
        description:
          "산타페 등 해변 마을이 있는 반타얀 섬입니다. 페리로 들어가는 섬 여정이며, 배편·날씨(바람)에 따라 결항이 생길 수 있어 여유 일정이 필요합니다.",
      },
    ],
  },
  {
    kind: "split",
    id: "bohol",
    title: "보홀",
    groups: [
      {
        id: "sights",
        label: "가볼만한 곳",
        items: [
          {
            id: "bohol-chocolate-hills",
            title: "초콜릿 힐",
            mapsQuery: "Chocolate Hills Complex Carmen Bohol Philippines",
            mapPin: { lat: 9.8297, lng: 124.111 },
            description:
              "콘 모양 언덕이 이어지는 보홀 대표 명소입니다. 우천 시 진흙·시야를 감안해 신발·이동 수단을 준비하세요.",
          },
          {
            id: "bohol-tarsier",
            title: "타르시어 보호구역",
            mapsQuery: "Philippine Tarsier Sanctuary Corella Bohol",
            mapPin: { lat: 9.6018, lng: 123.95 },
            description:
              "작은 원숭이이의 한 종을 보호하는 시설입니다. 촬영·플래시·소음 제한이 있을 수 있으니 안내를 따라 주세요.",
          },
          {
            id: "bohol-alona",
            title: "알로나 비치·팡라오",
            mapsQuery: "Alona Beach Panglao Bohol Philippines",
            mapPin: { lat: 9.5434, lng: 123.7712 },
            description:
              "숙소·식사·다이빙 상점이 모인 해변입니다. 해양 기상에 따라 바다 상태가 달라질 수 있습니다.",
          },
          {
            id: "bohol-balicasag",
            title: "발리카삭 아일랜드",
            mapsQuery: "Balicasag Island Bohol Philippines",
            mapPin: { lat: 9.5142, lng: 123.6885 },
            description:
              "팡라오에서 배로 당일 다이빙·스노클링로 자주 찾는 섬입니다. 바람·파도에 따라 출항이 조정될 수 있습니다.",
          },
          {
            id: "bohol-napaling",
            title: "나팔링 포인트",
            mapsQuery: "Napaling Point Panglao Bohol",
            mapPin: { lat: 9.5429, lng: 123.7781 },
            description:
              "절벽·사르댕 스노클링으로 알려진 팡라오 동쪽 포인트입니다. 입장·시설료·안전 안내는 현장 기준을 확인하세요.",
          },
          {
            id: "bohol-hinagdanan",
            title: "히낙다난 케이브",
            mapsQuery: "Hinagdanan Cave Panglao Bohol",
            mapPin: { lat: 9.5791, lng: 123.7657 },
            description:
              "석회 동굴·연못으로 유명한 관광지입니다(표기는 히나그다난 등으로도 올라옵니다). 좁은 통로·계단이 있어 신발·동선을 미리 확인하세요.",
          },
          {
            id: "bohol-loboc",
            title: "로복 강 크루즈",
            mapsQuery: "Loboc River Cruise Bohol Philippines",
            mapPin: { lat: 9.503, lng: 123.982 },
            description:
              "강변 절경과 식사·공연이 묶인 크루즈로 알려져 있습니다. 시간표·포함 항목은 업체별로 확인하세요.",
          },
          {
            id: "bohol-baclayon",
            title: "바클라온 성당",
            mapsQuery: "Baclayon Church Bohol Philippines",
            mapPin: { lat: 9.6028, lng: 123.9315 },
            description:
              "스페인 식민 시대의 오래된 성당으로, 방문 시 복장·촬영 규정은 현장 안내를 따르는 편이 좋습니다.",
          },
          {
            id: "bohol-virgin-island",
            title: "버진 아일랜드(팡라오 출발)",
            mapsQuery: "Virgin Island Panglao Bohol tour",
            mapPin: { lat: 9.516, lng: 123.7 },
            description:
              "팡라오에서 배로 들르는 모래톱 일대로 유명합니다. 날씨·파도에 따라 일정이 바뀔 수 있으니 현지 투어 안내를 확인하세요.",
          },
        ],
      },
      {
        id: "mall",
        label: "쇼핑몰",
        items: [
          {
            id: "bohol-icm",
            title: "아일랜드 시티 몰 (ICM)",
            mapsQuery: "Island City Mall Tagbilaran Bohol",
            mapPin: { lat: 9.6555, lng: 123.8745 },
            description:
              "타그빌라란 시내의 대형 복합몰로 마트·패션·식당이 한곳에 모여 있습니다.",
          },
          {
            id: "bohol-alturas",
            title: "알투라스 몰 타그빌라란",
            mapsQuery: "Alturas Mall Tagbilaran Bohol",
            mapPin: { lat: 9.654, lng: 123.878 },
            description:
              "타그빌라란 중심가에 있는 알투라스 계열 몰입니다. 현지 브랜드·식사 코너를 함께 둘러보기 좋습니다.",
          },
          {
            id: "bohol-bq",
            title: "BQ 몰 타그빌라란",
            mapsQuery: "BQ Mall Tagbilaran Bohol",
            mapPin: { lat: 9.656, lng: 123.88 },
            description:
              "시내 동선에 묶기 쉬운 중형 몰로 생활·식사·잡화 매장이 섞여 있습니다.",
          },
          {
            id: "bohol-island-central",
            title: "아일랜드 센트럴 스퀘어(팡라오)",
            mapsQuery: "Island Central Panglao Bohol",
            mapPin: { lat: 9.549, lng: 123.77 },
            description:
              "팡라오 본섬에 있는 상업 단지로 알로나 비치와 가깝게 묶는 경우가 많습니다.",
          },
        ],
      },
    ],
  },
];
