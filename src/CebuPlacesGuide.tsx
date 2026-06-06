import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CebuClusterMap } from "./CebuClusterMap";
import {
  CEBU_PLACES_ZONES,
  CEBU_VIDEO_BLOG_URL,
  googleMapsQueryUrl,
  selectedGuideItemId,
  sortGuideItemsWithSelectedFirst,
  zoneHasClusterMap,
  type CebuGuideZone,
} from "./cebuPlacesData";
import {
  readPlacesHashFromLocation,
  readPersistedScrollY,
  resolveInitialGuideState,
  resolvePlacesHashTarget,
  writePersistedGuideState,
  writePlacesHashToLocation,
} from "./placesHashDeepLink";

function zoneById(id: string): CebuGuideZone {
  const z = CEBU_PLACES_ZONES.find((x) => x.id === id);
  if (!z) return CEBU_PLACES_ZONES[0]!;
  return z;
}

const firstZone = CEBU_PLACES_ZONES[0]!;
const defaultGroupId = firstZone.kind === "split" ? firstZone.groups[0]!.id : "";
const guideInitialState = resolveInitialGuideState(
  CEBU_PLACES_ZONES,
  firstZone.id,
  defaultGroupId,
);

export function CebuPlacesGuide() {
  const [zoneId, setZoneId] = useState(guideInitialState.zoneId);
  const [groupId, setGroupId] = useState(guideInitialState.groupId);
  const [openKey, setOpenKey] = useState<string | null>(guideInitialState.openKey);

  const skipHashSync = useRef(false);
  const historyReady = useRef(false);
  const scrollRestorePending = useRef(readPersistedScrollY());

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

  const visibleItems = useMemo(() => {
    if (zone.kind === "flat") return zone.items;
    const g = zone.groups.find((x) => x.id === groupId) ?? zone.groups[0]!;
    return g.items;
  }, [zone, groupId]);

  const selectedItemId = useMemo(
    () => selectedGuideItemId(openKey, zone, groupId),
    [openKey, zone, groupId],
  );

  const sortedItems = useMemo(
    () => sortGuideItemsWithSelectedFirst(visibleItems, selectedItemId),
    [visibleItems, selectedItemId],
  );

  const clusterMapFocusId = useMemo(
    () => (zoneHasClusterMap(zone) ? selectedItemId : null),
    [zone, selectedItemId],
  );

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
    const z = zoneById(id);
    if (z.kind === "split") {
      setGroupId(z.groups[0]!.id);
    } else {
      setGroupId("");
    }
  }

  function itemOpenKey(itemId: string): string {
    if (zone.kind === "split") {
      return `${zone.id}:${groupId}:${itemId}`;
    }
    return `${zone.id}:${itemId}`;
  }

  function toggleItem(itemId: string) {
    const key = itemOpenKey(itemId);
    setOpenKey((prev) => (prev === key ? null : key));
  }

  function focusItem(itemId: string) {
    setOpenKey(itemOpenKey(itemId));
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

      {zone.kind === "split" && (
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
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {zoneHasClusterMap(zone) && (
        <CebuClusterMap
          mapKey={`${zone.id}-${zone.kind === "split" ? groupId : "all"}`}
          items={visibleItems}
          focusedItemId={clusterMapFocusId}
          onSelectItem={focusItem}
        />
      )}

      <ul className="pg-list">
        {sortedItems.map((item) => (
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
            {isOpen(item.id) && (
              <div className="pg-item-detail">
                <p className="pg-item-desc">{item.description}</p>
                {(item.mapPopupLink || item.googleMapsUrl || item.mapsQuery) && (
                  <p className="pg-item-actions">
                    {item.mapPopupLink ? (
                      <a
                        className="pg-item-link"
                        href={item.mapPopupLink.url}
                        target="_self"
                      >
                        {item.mapPopupLink.label}
                      </a>
                    ) : null}
                    {item.googleMapsUrl && !item.mapPopupLink ? (
                      <a
                        className="pg-item-link"
                        href={item.googleMapsUrl}
                        target="_self"
                      >
                        Google 지도
                      </a>
                    ) : null}
                    {item.mapsQuery && !item.mapPopupLink && !item.googleMapsUrl ? (
                      <a
                        className="pg-item-link"
                        href={googleMapsQueryUrl(item.mapsQuery)}
                      >
                        Google 지도
                      </a>
                    ) : null}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
