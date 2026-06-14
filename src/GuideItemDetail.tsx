import { useEffect, useState } from "react";
import type { CebuGuideItem } from "./cebuPlacesData";
import { handleKakaoChannelClick, hasReservation, isKakaoChannelUrl } from "./kakaoSubAction";
import { ReservationActionButtons } from "./reservationActionButtons";
import { googleMapsUrlForPlace, usePlaceInfo } from "./usePlaceInfo";

type GuideItemDetailProps = {
  item: CebuGuideItem;
};

export function GuideItemDetail({ item }: GuideItemDetailProps) {
  const [faqOpenId, setFaqOpenId] = useState<string | null>(null);
  const showReservationButtons = hasReservation(item);
  const fetchPlaceInfo =
    !item.mapPopupLink && !item.subActions && Boolean(item.mapsQuery);  const { place, loading } = usePlaceInfo(item.mapsQuery, fetchPlaceInfo);

  useEffect(() => {
    setFaqOpenId(null);
  }, [item.id]);

  return (
    <div className="pg-item-detail">
      <p className="pg-item-desc">{item.description}</p>

      {(item.address || item.rating || item.openingHours) && (
        <div className="pg-item-info">
          {item.address ? <p>📍 {item.address}</p> : null}
          {item.rating ? <p>{item.rating}</p> : null}
          {item.openingHours ? <p>🕐 {item.openingHours}</p> : null}
        </div>
      )}

      {showReservationButtons ? (
        <ReservationActionButtons item={item} />
      ) : item.subActions ? (
        <div className="pg-subaction-grid">
          {item.subActions.map((action) => {
            const url = action.url;
            return url ? (
              <a
                key={action.id}
                href={url}
                target={isKakaoChannelUrl(url) ? "_blank" : "_self"}
                rel={isKakaoChannelUrl(url) ? "noopener noreferrer" : undefined}
                className="pg-subaction-card"
                onClick={() => {
                  if (isKakaoChannelUrl(url)) {
                    handleKakaoChannelClick(url);
                  }
                }}
              >
                <span className="pg-subaction-icon">{action.icon}</span>
                <span className="pg-subaction-label">{action.label}</span>
              </a>
            ) : (
              <button key={action.id} type="button" className="pg-subaction-card" disabled>
                <span className="pg-subaction-icon">{action.icon}</span>
                <span className="pg-subaction-label">{action.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {item.faqItems ? (        <div className="pg-faq-section">
          <div className="pg-faq-header">
            <span>💬 자주 묻는 질문</span>
          </div>
          {item.faqItems.map((faq) => (
            <div key={faq.id} className="pg-faq-item">
              <button
                type="button"
                className="pg-faq-question"
                aria-expanded={faqOpenId === faq.id}
                onClick={() => setFaqOpenId(faqOpenId === faq.id ? null : faq.id)}
              >
                <span>Q. {faq.question}</span>
                <span className="pg-chev" aria-hidden>
                  {faqOpenId === faq.id ? "▲" : "▼"}
                </span>
              </button>
              {faqOpenId === faq.id ? (
                <p className="pg-faq-answer">A. {faq.answer}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {item.mapPopupLink && !showReservationButtons ? (
        <p className="pg-item-actions">
          <a className="pg-item-link" href={item.mapPopupLink.url} target="_self">
            {item.mapPopupLink.label}
          </a>
        </p>
      ) : fetchPlaceInfo ? (
        <div className="pg-place-info">
          {loading ? (
            <p className="pg-place-info-loading muted">정보 불러오는 중...</p>
          ) : place ? (
            <>
              {place.rating != null ? (
                <p className="pg-place-info-rating">
                  <span aria-hidden>⭐</span> {place.rating.toFixed(1)}
                  {place.userRatingsTotal != null ? (
                    <span className="pg-place-info-reviews">
                      {" "}
                      · 리뷰 {place.userRatingsTotal.toLocaleString()}개
                    </span>
                  ) : null}
                </p>
              ) : null}
              {place.address ? <p className="pg-place-info-address">{place.address}</p> : null}
              {place.openingHours && place.openingHours.length > 0 ? (
                <ul className="pg-place-info-hours">
                  {place.openingHours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : null}
          {item.mapsQuery && !loading && !item.subActions ? (
            <p className="pg-item-actions">
              <a
                className="pg-item-link pg-place-google-link"
                href={googleMapsUrlForPlace(item.mapsQuery, place)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google 지도에서 보기
              </a>
            </p>
          ) : null}
        </div>
      ) : item.mapsQuery && !item.subActions ? (
        <p className="pg-item-actions">
          <a
            className="pg-item-link pg-place-google-link"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 지도에서 보기
          </a>
        </p>
      ) : null}
    </div>
  );
}
