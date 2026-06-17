import type { CebuGuideItem } from "./cebuPlacesData";
import { KakaoTalkIcon } from "./KakaoTalkIcon";
import { getReservationAction, handleKakaoChannelClick } from "./kakaoSubAction";

export function ReservationActionButtons({ item }: { item: CebuGuideItem }) {
  const reservationAction = getReservationAction(item);
  const reserveUrl = item.reservationUrl ?? reservationAction?.url;
  const isKakao = reserveUrl?.includes("kakao.com");

  return (
    <div className="pg-action-buttons">
      {item.mapPopupLink ? (
        <a
          href={item.mapPopupLink.url}
          target="_self"
          className="pg-action-btn pg-action-btn--detail"
        >
          📋 자세히 보기
        </a>
      ) : (
        <a
          href={
            item.googleMapsUrl ??
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapsQuery ?? item.title)}`
          }
          target="_self"
          className="pg-action-btn pg-action-btn--detail"
        >
          📍 구글 지도
        </a>
      )}
      {reserveUrl ? (
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`pg-action-btn ${isKakao ? "pg-action-btn--kakao" : "pg-action-btn--reserve"}`}
          onClick={() => {
            if (isKakao) handleKakaoChannelClick(reserveUrl);
          }}
        >
          {isKakao ? <KakaoTalkIcon /> : null}
          예약하기
        </a>
      ) : null}
    </div>
  );
}
