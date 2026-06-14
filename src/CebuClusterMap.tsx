import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { type CebuGuideItem } from "./cebuPlacesData";
import { latLngTuple, markersCenter, normalizeCebuLatLng } from "./mapCoords";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type IconDefaultPrototype = typeof L.Icon.Default.prototype & { _getIconUrl?: unknown };
delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MarkerModel = {
  id: string;
  lat: number;
  lng: number;
  title: string;
};

function toMarkerModel(item: CebuGuideItem & { mapPin: { lat: number; lng: number } }): MarkerModel {
  const { lat, lng } = normalizeCebuLatLng(Number(item.mapPin.lat), Number(item.mapPin.lng));
  return {
    id: item.id,
    lat,
    lng,
    title: item.title,
  };
}

const FOCUS_ZOOM = 17;

function MapFitAndFocus({
  markers,
  focusedItemId,
  boundsResetKey,
}: {
  markers: MarkerModel[];
  focusedItemId: string | null;
  boundsResetKey: string;
}) {
  const map = useMap();
  const markerBoundsKey = useMemo(
    () => markers.map((m) => `${m.id}:${m.lat},${m.lng}`).join("|"),
    [markers],
  );

  useEffect(() => {
    if (markers.length === 0) return;

    if (focusedItemId) {
      const m = markers.find((x) => x.id === focusedItemId);
      if (m && Number.isFinite(m.lat) && Number.isFinite(m.lng)) {
        map.setView(latLngTuple(m.lat, m.lng), FOCUS_ZOOM, { animate: false });
        const t = window.setTimeout(() => map.invalidateSize(), 0);
        return () => window.clearTimeout(t);
      }
    }

    const latlngs = markers
      .filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng))
      .map((m) => L.latLng(m.lat, m.lng));
    if (latlngs.length === 0) return;
    if (latlngs.length === 1) {
      map.setView(latlngs[0]!, 15, { animate: false });
    } else {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [32, 32], maxZoom: 14 });
    }
    const t = window.setTimeout(() => map.invalidateSize(), 200);
    return () => window.clearTimeout(t);
  }, [map, markerBoundsKey, markers, focusedItemId, boundsResetKey]);

  return null;
}

function ClusterMarker({
  marker,
  isFocused,
  onSelectItem,
}: {
  marker: MarkerModel;
  isFocused: boolean;
  onSelectItem?: (itemId: string) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (!isFocused) return;
    markerRef.current?.openPopup();
  }, [isFocused]);

  return (
    <Marker
      ref={markerRef}
      position={latLngTuple(marker.lat, marker.lng)}
      eventHandlers={{
        click: () => onSelectItem?.(marker.id),
      }}
    >
      <Popup>
        <div className="pg-cluster-popup">
          <div className="pg-cluster-popup-title">{marker.title}</div>
        </div>
      </Popup>
    </Marker>
  );
}

export type CebuClusterMapProps = {
  items: CebuGuideItem[];
  focusedItemId: string | null;
  mapKey: string;
  onSelectItem?: (itemId: string) => void;
};

export function CebuClusterMap({ items, focusedItemId, mapKey, onSelectItem }: CebuClusterMapProps) {
  const markers = useMemo(
    () =>
      items
        .filter((i): i is CebuGuideItem & { mapPin: { lat: number; lng: number } } => Boolean(i.mapPin))
        .map(toMarkerModel),
    [items],
  );

  const center = markersCenter(markers);

  return (
    <div className="pg-cluster-map" aria-label="선택한 지역 · 통합 지도">
      <p className="pg-cluster-map-caption muted">
        아래 지도에 현재 목록의 장소가 모두 표시됩니다. 항목을 펼치면 해당 위치로 이동합니다.
      </p>

      <MapContainer
        key={mapKey}
        center={center}
        zoom={13}
        className="pg-cluster-map-inner"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <ClusterMarker
            key={m.id}
            marker={m}
            isFocused={focusedItemId === m.id}
            onSelectItem={onSelectItem}
          />
        ))}
        <MapFitAndFocus
          markers={markers}
          focusedItemId={focusedItemId}
          boundsResetKey={mapKey}
        />
      </MapContainer>
    </div>
  );
}
