import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { useEffect, useMemo } from "react";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { googleMapsQueryUrl, type CebuGuideItem } from "./cebuPlacesData";

import { googleMapsCoordUrl, latLngTuple, markersCenter, normalizeCebuLatLng } from "./mapCoords";



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

  description?: string;

  mapsQuery?: string;

  googleMapsUrl?: string;

  mapPopupLink?: { url: string; label: string };

};



function toMarkerModel(item: CebuGuideItem & { mapPin: { lat: number; lng: number } }): MarkerModel {

  const { lat, lng } = normalizeCebuLatLng(item.mapPin.lat, item.mapPin.lng);

  return {

    id: item.id,

    lat,

    lng,

    title: item.title,

    description: item.description,

    mapsQuery: item.mapsQuery,

    googleMapsUrl: item.googleMapsUrl ?? googleMapsCoordUrl(lat, lng),

    mapPopupLink: item.mapPopupLink,

  };

}



function MapFitAndFocus({

  markers,

  focusedItemId,

}: {

  markers: MarkerModel[];

  focusedItemId: string | null;

}) {

  const map = useMap();

  const markerBoundsKey = useMemo(

    () => markers.map((m) => `${m.id}:${m.lat},${m.lng}`).join("|"),

    [markers],

  );



  useEffect(() => {

    if (markers.length === 0) return;

    const latlngs = markers.map((m) => L.latLng(m.lat, m.lng));

    if (latlngs.length === 1) {

      map.setView(latlngs[0]!, 15);

    } else {

      map.fitBounds(L.latLngBounds(latlngs), { padding: [32, 32], maxZoom: 14 });

    }

    const t = window.setTimeout(() => map.invalidateSize(), 200);

    return () => window.clearTimeout(t);

  }, [map, markerBoundsKey, markers]);



  useEffect(() => {

    if (!focusedItemId) return;

    const m = markers.find((x) => x.id === focusedItemId);

    if (!m) return;

    map.flyTo(latLngTuple(m.lat, m.lng), 17, { duration: 0.45 });

  }, [map, focusedItemId, markers]);



  return null;

}



export type CebuClusterMapProps = {

  items: CebuGuideItem[];

  focusedItemId: string | null;

  /** 카테고리 바뀔 때 지도 인스턴스를 새로 그리기 위한 키 */

  mapKey: string;

  /** 마커 클릭 시 목록·상세 카드 연동 */

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



  if (markers.length === 0) return null;



  const center = markersCenter(markers);



  return (

    <div className="pg-cluster-map" aria-label="선택한 지역 · 통합 지도">

      <p className="pg-cluster-map-caption muted">

        아래 지도에 현재 목록의 장소가 모두 표시됩니다. 항목을 펼치면 해당 위치로 이동합니다. 마커 팝업에서 Google 지도를 열 수 있습니다.

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

          <Marker

            key={m.id}

            position={latLngTuple(m.lat, m.lng)}

            eventHandlers={{

              click: () => {

                onSelectItem?.(m.id);

              },

            }}

          >

            <Popup>

              <div className="pg-cluster-popup">

                <div className="pg-cluster-popup-title">{m.title}</div>

                {m.description ? (

                  <p className="pg-cluster-popup-desc">{m.description}</p>

                ) : null}

                {m.mapPopupLink ? (

                  <a

                    className="pg-cluster-popup-link"

                    href={m.mapPopupLink.url}

                    target="_self"

                  >

                    {m.mapPopupLink.label}

                  </a>

                ) : m.googleMapsUrl ? (

                  <a

                    className="pg-cluster-popup-link"

                    href={m.googleMapsUrl}

                    target="_self"

                  >

                    Google 지도에서 열기

                  </a>

                ) : m.mapsQuery ? (

                  <a

                    className="pg-cluster-popup-link"

                    href={googleMapsQueryUrl(m.mapsQuery)}

                  >

                    Google 지도에서 열기

                  </a>

                ) : null}

              </div>

            </Popup>

          </Marker>

        ))}

        <MapFitAndFocus markers={markers} focusedItemId={focusedItemId} />

      </MapContainer>

    </div>

  );

}


