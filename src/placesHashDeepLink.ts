import type { CebuGuideZone } from "./cebuPlacesData";

export type PlacesHashTarget = {
  zoneId: string;
  groupId: string;
  itemId?: string;
};

export type ResolvedPlacesTarget = {
  zoneId: string;
  groupId: string;
  itemId?: string;
  openKey: string | null;
};

const STORAGE_KEY = "cebu-places-guide:v1";

export type GuidePersistedState = {
  zoneId: string;
  groupId: string;
  openKey: string | null;
  scrollY: number;
};

/** 예: #/mactan/massage/massage-oasis-spa 또는 #/outskirts/oslob-whale */
export function parsePlacesHash(hash: string): PlacesHashTarget | null {
  const raw = hash.replace(/^#\/?/, "").trim();
  if (!raw) return null;
  const parts = raw.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  return {
    zoneId: parts[0]!,
    groupId: parts[1] ?? "",
    itemId: parts[2],
  };
}

function itemsInZoneGroup(zone: CebuGuideZone, groupId: string) {
  if (zone.kind === "flat") return zone.items;
  const group = zone.groups.find((g) => g.id === groupId) ?? zone.groups[0];
  return group?.items ?? [];
}

function openKeyForItem(
  zone: CebuGuideZone,
  groupId: string,
  itemId: string,
): string {
  if (zone.kind === "split") return `${zone.id}:${groupId}:${itemId}`;
  return `${zone.id}:${itemId}`;
}

export function resolvePlacesHashTarget(
  zones: readonly CebuGuideZone[],
  target: PlacesHashTarget,
): ResolvedPlacesTarget | null {
  const zone = zones.find((z) => z.id === target.zoneId);
  if (!zone) return null;

  if (zone.kind === "flat") {
    let itemId: string | undefined;
    if (target.itemId && zone.items.some((i) => i.id === target.itemId)) {
      itemId = target.itemId;
    } else if (target.groupId && zone.items.some((i) => i.id === target.groupId)) {
      itemId = target.groupId;
    }
    return {
      zoneId: zone.id,
      groupId: "",
      itemId,
      openKey: itemId ? openKeyForItem(zone, "", itemId) : null,
    };
  }

  const groupId =
    target.groupId && zone.groups.some((g) => g.id === target.groupId)
      ? target.groupId
      : zone.groups[0]!.id;

  const items = itemsInZoneGroup(zone, groupId);
  let itemId: string | undefined;
  if (target.itemId && items.some((i) => i.id === target.itemId)) {
    itemId = target.itemId;
  }

  return {
    zoneId: zone.id,
    groupId,
    itemId,
    openKey: itemId ? openKeyForItem(zone, groupId, itemId) : null,
  };
}

export function readPlacesHashFromLocation(): PlacesHashTarget | null {
  if (typeof window === "undefined") return null;
  return parsePlacesHash(window.location.hash);
}

export function buildPlacesHash(
  zones: readonly CebuGuideZone[],
  target: { zoneId: string; groupId: string; itemId?: string | null },
): string {
  const zone = zones.find((z) => z.id === target.zoneId);
  const parts = [target.zoneId];
  if (zone?.kind === "split") {
    if (target.groupId) parts.push(target.groupId);
    if (target.itemId) parts.push(target.itemId);
  } else if (target.itemId) {
    parts.push(target.itemId);
  }
  return `#/${parts.join("/")}`;
}

export function writePlacesHashToLocation(
  zones: readonly CebuGuideZone[],
  target: { zoneId: string; groupId: string; itemId?: string | null },
  mode: "push" | "replace" = "push",
): void {
  if (typeof window === "undefined") return;
  const hash = buildPlacesHash(zones, target);
  const url = `${window.location.pathname}${window.location.search}${hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current === url) return;
  if (mode === "replace") {
    history.replaceState({ cebuGuide: true }, "", url);
  } else {
    history.pushState({ cebuGuide: true }, "", url);
  }
}

export function readPersistedGuideState(): GuidePersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuidePersistedState;
  } catch {
    return null;
  }
}

export function writePersistedGuideState(state: GuidePersistedState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}

export function resolveInitialGuideState(
  zones: readonly CebuGuideZone[],
  defaultZoneId: string,
  defaultGroupId: string,
): { zoneId: string; groupId: string; openKey: string | null } {
  const fromHash = readPlacesHashFromLocation();
  if (fromHash) {
    const resolved = resolvePlacesHashTarget(zones, fromHash);
    if (resolved) {
      return {
        zoneId: resolved.zoneId,
        groupId: resolved.groupId,
        openKey: resolved.openKey,
      };
    }
  }

  const saved = readPersistedGuideState();
  if (saved && zones.some((z) => z.id === saved.zoneId)) {
    const zone = zones.find((z) => z.id === saved.zoneId)!;
    if (zone.kind === "flat") {
      return { zoneId: saved.zoneId, groupId: "", openKey: saved.openKey };
    }
    const groupOk = zone.groups.some((g) => g.id === saved.groupId);
    return {
      zoneId: saved.zoneId,
      groupId: groupOk ? saved.groupId : zone.groups[0]!.id,
      openKey: saved.openKey,
    };
  }

  return { zoneId: defaultZoneId, groupId: defaultGroupId, openKey: null };
}

export function readPersistedScrollY(): number | null {
  const saved = readPersistedGuideState();
  return saved?.scrollY != null ? saved.scrollY : null;
}
