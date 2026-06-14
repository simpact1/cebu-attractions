import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CebuClusterMap } from "./CebuClusterMap";
import { GuideItemDetail } from "./GuideItemDetail";
import { MassageFilterBar } from "./MassageFilterBar";
import { MACTAN_MASSAGE_SHOPS } from "./mactanMassageData";
import type { MassageFilterState } from "./massageFilters";
import {
  CEBU_PLACES_ZONES,
  CEBU_VIDEO_BLOG_URL,
  selectedGuideItemId,
  sortGuideItemsWithSelectedFirst,
  zoneHasClusterMap,
  type CebuGuideItem,
  type CebuGuideZoneSplit,
} from "./cebuPlacesData";
import {
  readPlacesHashFromLocation,
  readPersistedScrollY,
  resolveInitialGuideState,
  resolvePlacesHashTarget,
  writePersistedGuideState,
  writePlacesHashToLocation,
} from "./placesHashDeepLink";

function activityIcon(id: string): string {
  const map: Record<string, string> = {
    kartzone: "🏎️",
    "cebu-last-day-tour": "🗺️",
    "cebu-city-tour": "🏛️",
    "cebu-night-tour": "🌙",
    "mactan-island-hopping": "🚤",
    "mactan-diving": "🤿",
    "mactan-seawalk": "🪸",
    "mactan-parasailing": "🪂",
    "mactan-shooting": "🔫",
  };
  return map[id] ?? "⭐";
}

export { handleKakaoChannelClick, hasReservation, isKakaoChannelUrl } from "./kakaoSubAction";
export { ReservationActionButtons } from "./reservationActionButtons";
export { CompanyListPanel } from "./CompanyListPanel";
export { MassageFilterBar } from "./MassageFilterBar";
export {
  EMPTY_MASSAGE_FILTER,
  matchesMassageFilter,
  type MassageFilterState,
} from "./massageFilters";

function findMassageShopForItem(item: CebuGuideItem) {
  return MACTAN_MASSAGE_SHOPS.find((shop) =>
    item.title.includes(shop.name.split("(")[0].trim()),
  );
}

function MassageShopBadges({ item }: { item: CebuGuideItem }) {
  const shop = findMassageShopForItem(item);
  if (!shop) return null;
  return (
    <div className="mg-badges">
      {shop.quality ? (
        <span
          className={`mg-badge ${shop.quality === "고급" ? "mg-badge--premium" : "mg-badge--budget"}`}
        >
          {shop.quality}
        </span>
      ) : null}
      {shop.zones?.map((z) => (
        <span key={z} className="mg-badge mg-badge--zone">
          {z}
        </span>
      ))}
      {shop.recommends?.map((r) => (
        <span key={r} className="mg-badge mg-badge--recommend">
          {r}
        </span>
      ))}
    </div>
  );
}

function MassageItemDetail({ item }: { item: CebuGuideItem }) {
  const isKakao = item.reservationUrl?.includes("kakao.com");

  return (
    <div className="pg-item-detail">
      <p className="pg-item-desc">{item.description}</p>
      <div className="mg-place-info">
        <div className="mg-place-row">
          {item.rating ? (
            <span className="mg-place-chip mg-place-chip--rating">{item.rating}</span>
          ) : null}
          {item.openingHours ? (
            <span className="mg-place-chip mg-place-chip--hours">
              🕐 {item.openingHours}
            </span>
          ) : null}
        </div>
      </div>
      {(item.googleMapsUrl || item.mapPopupLink || item.reservationUrl) && (
        <div className="pg-action-buttons">
          {item.googleMapsUrl ? (
            <a
              href={item.googleMapsUrl}
              target="_self"
              className="pg-action-btn pg-action-btn--detail"
            >
              📍 Google 지도
            </a>
          ) : null}
          {item.mapPopupLink ? (
            <a
              href={item.mapPopupLink.url}
              target="_self"
              className="pg-action-btn pg-action-btn--detail"
            >
              📋 {item.mapPopupLink.label}
            </a>
          ) : null}
          {item.reservationUrl ? (
            <a
              href={item.reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`pg-action-btn ${isKakao ? "pg-action-btn--kakao" : "pg-action-btn--reserve"}`}
            >
              📋 예약하기
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
}

function tourPinsToGuideItems(
  tourPins: NonNullable<CebuGuideItem["tourPins"]>,
): CebuGuideItem[] {
  return tourPins.map((p) => ({
    id: p.id,
    title: p.title,
    description: "",
    mapPin: { lat: p.lat, lng: p.lng },
  }));
}

function zoneById(id: string): CebuGuideZoneSplit {
  const z = CEBU_PLACES_ZONES.find((x) => x.id === id);
  if (z?.kind === "split") return z;
  return CEBU_PLACES_ZONES.find((x) => x.kind === "split")! as CebuGuideZoneSplit;
}

const firstZone = CEBU_PLACES_ZONES.find((z) => z.kind === "split")! as CebuGuideZoneSplit;
const defaultGroupId = firstZone.groups[0]!.id;
const guideInitialState = resolveInitialGuideState(
  CEBU_PLACES_ZONES,
  firstZone.id,
  defaultGroupId,
);

export function CebuPlacesGuide() {
  const [zoneId, setZoneId] = useState(guideInitialState.zoneId);
  const [groupId, setGroupId] = useState(guideInitialState.groupId);
  const [openKey, setOpenKey] = useState<string | null>(guideInitialState.openKey);
  const [tourPinOverride, setTourPinOverride] = useState<CebuGuideItem[] | null>(null);
  const [massageFilters, setMassageFilters] = useState<MassageFilterState>({
    quality: null,
    zone: null,
    recommend: null,
  });

  const skipHashSync = useRef(false);
  const historyReady = useRef(false);
  const scrollRestorePending = useRef(readPersistedScrollY());
  const clusterMapRef = useRef<HTMLDivElement>(null);

  const persistState = useCallback(
    (next: { zoneId: string; groupId: string; openKey: string | null }) => {
      writePersistedGuideState({
        zoneId: next.zoneId,
        groupId: next.groupId,
        openKey: next.openKey,
        scrollY: window.scrollY,
      });
    },
    [],
  );

  const applyHashFromLocation = useCallback(() => {
    const raw = readPlacesHashFromLocation();
    if (!raw) return;
    const resolved = resolvePlacesHashTarget(CEBU_PLACES_ZONES, raw);
    if (!resolved) return;
    skipHashSync.current = true;
    setZoneId(resolved.zoneId);
    setGroupId(resolved.groupId);
    setOpenKey(resolved.openKey);
    persistState({
      zoneId: resolved.zoneId,
      groupId: resolved.groupId,
      openKey: resolved.openKey,
    });
  }, [persistState]);

  useEffect(() => {
    window.addEventListener("hashchange", applyHashFromLocation);
    window.addEventListener("popstate", applyHashFromLocation);
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        scrollRestorePending.current = readPersistedScrollY();
      }
      applyHashFromLocation();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("hashchange", applyHashFromLocation);
      window.removeEventListener("popstate", applyHashFromLocation);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [applyHashFromLocation]);

  const zone = useMemo(() => zoneById(zoneId), [zoneId]);

  const groupItems = useMemo(() => {
    const g = zone.groups.find((x) => x.id === groupId) ?? zone.groups[0]!;
    return g.items;
  }, [zone, groupId]);

  const visibleItems = groupItems;

  const selectedItemId = useMemo(
    () => selectedGuideItemId(openKey, zone, groupId),
    [openKey, zone, groupId],
  );

  const sortedItems = useMemo(
    () => sortGuideItemsWithSelectedFirst(visibleItems, selectedItemId),
    [visibleItems, selectedItemId],
  );

  const filteredMassageItems = useMemo(() => {
    if (groupId !== "massage") return sortedItems;
    return sortedItems.filter((item) => {
      const shop = findMassageShopForItem(item);
      if (!shop) return true;
      if (massageFilters.quality && shop.quality !== massageFilters.quality) return false;
      if (massageFilters.zone && !shop.zones?.includes(massageFilters.zone)) return false;
      if (massageFilters.recommend && !shop.recommends?.includes(massageFilters.recommend)) {
        return false;
      }
      return true;
    });
  }, [sortedItems, groupId, massageFilters]);

  const listItems = groupId === "massage" ? filteredMassageItems : sortedItems;

  const selectedMassageItem = useMemo(() => {
    if (groupId !== "massage" || !openKey) return null;
    const match = (item: CebuGuideItem) => `${zone.id}:${groupId}:${item.id}` === openKey;
    return (
      filteredMassageItems.find(match) ?? sortedItems.find(match) ?? null
    );
  }, [groupId, openKey, filteredMassageItems, sortedItems, zone.id]);

  const displayItems = useMemo(
    () => (zone.kind === "split" && groupId === "activities" ? visibleItems : sortedItems),
    [zone, groupId, visibleItems, sortedItems],
  );

  const mapItems = useMemo(
    () =>
      tourPinOverride ??
      (zone.kind === "split" && groupId === "activities" && !openKey
        ? []
        : groupId === "massage"
          ? filteredMassageItems
          : visibleItems),
    [tourPinOverride, zone, groupId, openKey, visibleItems, filteredMassageItems],
  );

  const openActivityItem = useMemo(() => {
    if (groupId !== "activities" || !selectedItemId) return null;
    return visibleItems.find((item) => item.id === selectedItemId) ?? null;
  }, [groupId, selectedItemId, visibleItems]);

  const clusterMapFocusId = useMemo(() => {
    if (!zoneHasClusterMap(zone)) return null;
    if (tourPinOverride) {
      return tourPinOverride.some((item) => item.id === selectedItemId) ? selectedItemId : null;
    }
    return selectedItemId;
  }, [zone, selectedItemId, tourPinOverride]);

  useEffect(() => {
    if (groupId !== "massage") {
      setMassageFilters({ quality: null, zone: null, recommend: null });
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId !== "massage" || !selectedItemId) return;
    if (!filteredMassageItems.some((item) => item.id === selectedItemId)) {
      setOpenKey(null);
    }
  }, [groupId, selectedItemId, filteredMassageItems]);

  useEffect(() => {
    if (groupId !== "activities") return;
    if (!openKey) {
      setTourPinOverride(null);
      return;
    }
    const item = visibleItems.find((i) => i.id === selectedItemId);
    if (!item) {
      setTourPinOverride(null);
      return;
    }
    if (item.tourPins) {
      setTourPinOverride(tourPinsToGuideItems(item.tourPins));
    } else {
      setTourPinOverride([item]);
    }
  }, [groupId, selectedItemId, openKey, visibleItems]);

  useEffect(() => {
    const mode = historyReady.current ? "push" : "replace";
    historyReady.current = true;

    if (skipHashSync.current) {
      skipHashSync.current = false;
      if (mode === "replace") {
        writePlacesHashToLocation(
          CEBU_PLACES_ZONES,
          { zoneId, groupId, itemId: selectedItemId },
          "replace",
        );
      }
      persistState({ zoneId, groupId, openKey });
      return;
    }

    writePlacesHashToLocation(
      CEBU_PLACES_ZONES,
      { zoneId, groupId, itemId: selectedItemId },
      mode,
    );
    persistState({ zoneId, groupId, openKey });
  }, [zoneId, groupId, openKey, selectedItemId, persistState]);

  useEffect(() => {
    const y = scrollRestorePending.current;
    if (y == null) return;
    scrollRestorePending.current = null;
    const id = window.requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [zoneId, groupId, openKey, sortedItems.length]);

  useEffect(() => {
    const saveScroll = () => {
      persistState({ zoneId, groupId, openKey });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") saveScroll();
    };
    const onBeforeUnload = () => saveScroll();
    const onLinkClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor || anchor.getAttribute("target") === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      saveScroll();
      scrollRestorePending.current = window.scrollY;
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onLinkClick, true);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onLinkClick, true);
    };
  }, [zoneId, groupId, openKey, persistState]);

  function selectZone(id: string) {
    setZoneId(id);
    setOpenKey(null);
    setTourPinOverride(null);
    const z = zoneById(id);
    setGroupId(z.groups[0]!.id);
  }

  function itemOpenKey(itemId: string): string {
    return `${zone.id}:${groupId}:${itemId}`;
  }

  function toggleActivityItem(item: CebuGuideItem) {
    const key = itemOpenKey(item.id);
    const opening = openKey !== key;
    setOpenKey(opening ? key : null);
    if (opening && item.tourPins) {
      setTourPinOverride(tourPinsToGuideItems(item.tourPins));
    } else if (opening) {
      setTourPinOverride([item]);
    } else {
      setTourPinOverride(null);
    }
    if (opening) {
      requestAnimationFrame(() => {
        document
          .querySelector(".pg-activity-detail, .pg-cluster-map")
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }

  function toggleItem(itemId: string) {
    const key = itemOpenKey(itemId);
    const opening = openKey !== key;
    setOpenKey(opening ? key : null);
    if (opening && zoneHasClusterMap(zone) && groupId !== "activities") {
      requestAnimationFrame(() => {
        document.querySelector(".pg-cluster-map")?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      });
    }
  }

  function focusItem(itemId: string) {
    setOpenKey(itemOpenKey(itemId));

    requestAnimationFrame(() => {
      if (clusterMapRef.current) {
        const mapBottom = clusterMapRef.current.getBoundingClientRect().bottom;
        const scrollY = window.scrollY + mapBottom - window.innerHeight * 0.35;
        window.scrollTo({
          top: scrollY,
          behavior: "smooth",
        });
      }
    });
  }

  function isOpen(itemId: string): boolean {
    return openKey === itemOpenKey(itemId);
  }

  return (
    <section className="card card-place-guide" aria-label="세부 가볼 만한 곳">
      <h2>세부 가볼 만한 곳</h2>
      <p className="muted lead pg-lead">
        <strong>세부</strong>·<strong>막탄</strong>·<strong>보홀</strong>은 가볼만한 곳·마사지·쇼핑몰 등으로 나뉘고, 같은 카테고리 장소가 지도에 모입니다.{" "}
        <strong>세부외곽</strong>도 지도에 표시됩니다. <strong>세부영상</strong>은 네이버 블로그로 바로 연결됩니다.
      </p>

      <div className="pg-zone-row" aria-label="지역 선택 및 세부영상 블로그">
        {CEBU_PLACES_ZONES.map((z) => (
          <Fragment key={z.id}>
            {z.id === "bohol" && (
              <a className="pg-tab pg-tab-cebu-video" href={CEBU_VIDEO_BLOG_URL}>
                세부영상
              </a>
            )}
            <button
              type="button"
              className={`pg-tab ${zoneId === z.id ? `pg-tab-on pg-tab-on--${z.id}` : "pg-tab-idle"}`}
              aria-pressed={zoneId === z.id}
              onClick={() => selectZone(z.id)}
            >
              {z.title}
            </button>
          </Fragment>
        ))}
      </div>

      <div
        className={`pg-group-row pg-group-row--${zone.id}`}
        role="tablist"
        aria-label="카테고리 선택"
      >
        {zone.groups.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={groupId === g.id}
              className={`pg-tab pg-tab-sub ${groupId === g.id ? "pg-tab-sub-on" : "pg-tab-sub-idle"}`}
              onClick={() => {
                setGroupId(g.id);
                setOpenKey(null);
                setTourPinOverride(null);
              }}
            >
              {g.label}
            </button>
          ))}
      </div>

      {groupId === "massage" && (
        <div className="mg-quick-links">
          <a
            href="https://m.blog.naver.com/aalove0902/221178736479"
            target="_self"
            className="mg-quick-card"
          >
            <span className="mg-quick-icon">💆</span>
            <span className="mg-quick-label">마사지{"\n"}알쓸신잡</span>
          </a>
          <a
            href="https://m.blog.naver.com/aalove0902/223259081998"
            target="_self"
            className="mg-quick-card"
          >
            <span className="mg-quick-icon">💡</span>
            <span className="mg-quick-label">알면{"\n"}좋은정보</span>
          </a>
          <a
            href="https://m.blog.naver.com/aalove0902/220767139543"
            target="_self"
            className="mg-quick-card"
          >
            <span className="mg-quick-icon">🏨</span>
            <span className="mg-quick-label">주요{"\n"}리조트스파</span>
          </a>
        </div>
      )}

      {(zoneHasClusterMap(zone) || groupId === "activities") && (
        <div ref={clusterMapRef} className="pg-cluster-map">
          <CebuClusterMap
            mapKey={`${zone.id}-${groupId}-${openKey ?? "none"}-${massageFilters.quality ?? ""}-${massageFilters.zone ?? ""}-${massageFilters.recommend ?? ""}`}
            items={mapItems}
            focusedItemId={clusterMapFocusId}
            onSelectItem={focusItem}
          />
        </div>
      )}

      {groupId === "activities" ? (
        <>
          <div className="pg-activity-grid">
            {displayItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`pg-activity-card ${isOpen(item.id) ? "pg-activity-card--open" : ""}`}
                aria-expanded={isOpen(item.id)}
                onClick={() => toggleActivityItem(item)}
              >
                <span className="pg-activity-icon">{activityIcon(item.id)}</span>
                <span className="pg-activity-name">{item.title}</span>
              </button>
            ))}
          </div>
          {openActivityItem ? (
            <div className="pg-activity-detail">
              <GuideItemDetail item={openActivityItem} />
            </div>
          ) : null}
        </>
      ) : groupId === "massage" ? (
        <>
          {selectedMassageItem ? (
            <div className="pg-massage-selected">
              <button
                type="button"
                className="pg-item-btn"
                aria-expanded
                onClick={() => toggleItem(selectedMassageItem.id)}
              >
                <span className="pg-item-title">{selectedMassageItem.title}</span>
                <span className="pg-chev" aria-hidden>
                  ▲
                </span>
              </button>
              <MassageShopBadges item={selectedMassageItem} />
              <MassageItemDetail item={selectedMassageItem} />
            </div>
          ) : null}
          <MassageFilterBar filters={massageFilters} onChange={setMassageFilters} />
          <ul className="pg-list">
            {listItems.length === 0 ? (
              <li className="pg-massage-empty muted">조건에 맞는 마사지샵이 없습니다.</li>
            ) : null}
            {listItems.map((item) => (
              <li key={item.id} className="pg-item">
                <button
                  type="button"
                  className="pg-item-btn"
                  aria-expanded={isOpen(item.id)}
                  onClick={() => toggleItem(item.id)}
                >
                  <span className="pg-item-title">{item.title}</span>
                  <span className="pg-chev" aria-hidden>
                    {isOpen(item.id) ? "▲" : "▼"}
                  </span>
                </button>
                <MassageShopBadges item={item} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul className="pg-list">
          {listItems.map((item) => (
            <li key={item.id} className="pg-item">
              <button
                type="button"
                className="pg-item-btn"
                aria-expanded={isOpen(item.id)}
                onClick={() => toggleItem(item.id)}
              >
                <span className="pg-item-title">{item.title}</span>
                <span className="pg-chev" aria-hidden>
                  {isOpen(item.id) ? "▲" : "▼"}
                </span>
              </button>
              {isOpen(item.id) && <GuideItemDetail item={item} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
