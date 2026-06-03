import { Fragment, useMemo, useState } from "react";
import { CebuClusterMap } from "./CebuClusterMap";
import {
  CEBU_PLACES_ZONES,
  CEBU_VIDEO_BLOG_URL,
  googleMapsSearchUrl,
  selectedGuideItemId,
  sortGuideItemsWithSelectedFirst,
  zoneHasClusterMap,
  type CebuGuideZone,
} from "./cebuPlacesData";

function zoneById(id: string): CebuGuideZone {
  const z = CEBU_PLACES_ZONES.find((x) => x.id === id);
  if (!z) return CEBU_PLACES_ZONES[0]!;
  return z;
}

export function CebuPlacesGuide() {
  const firstZone = CEBU_PLACES_ZONES[0]!;
  const [zoneId, setZoneId] = useState(firstZone.id);
  const [groupId, setGroupId] = useState<string>(() =>
    firstZone.kind === "split" ? firstZone.groups[0]!.id : "",
  );
  const [openKey, setOpenKey] = useState<string | null>(null);

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
        <strong>세부</strong>·<strong>막탄</strong>·<strong>보홀</strong>은 가볼만한 곳·쇼핑몰로 나뉘고, 같은 카테고리 장소가 지도에 모입니다.{" "}
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
                {(item.mapPopupLink || item.mapsQuery) && (
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
                    {item.mapsQuery && !item.mapPopupLink ? (
                      <a
                        className="pg-item-link"
                        href={googleMapsSearchUrl(item.mapsQuery)}
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
