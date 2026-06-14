import type { CebuGuideItem } from "./cebuPlacesData";
import { getReservationAction, handleKakaoChannelClick } from "./kakaoSubAction";

export function ReservationActionButtons({ item }: { item: CebuGuideItem }) {
  const reservationAction = getReservationAction(item);
  const kakaoUrl = reservationAction?.url;

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
      ) : null}
      {kakaoUrl ? (
        <a
          href={kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pg-action-btn pg-action-btn--kakao"
          onClick={() => handleKakaoChannelClick(kakaoUrl)}
        >
          💬 예약하기
        </a>
      ) : null}
    </div>
  );
}
