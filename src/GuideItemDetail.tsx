import { useEffect, useState } from "react";
import { CompanyListPanel } from "./CompanyListPanel";
import type { CebuGuideItem } from "./cebuPlacesData";
import { handleKakaoChannelClick, hasReservation, isKakaoChannelUrl } from "./kakaoSubAction";
import { ReservationActionButtons } from "./reservationActionButtons";
import { usePlaceInfo } from "./usePlaceInfo";

type GuideItemDetailProps = {
  item: CebuGuideItem;
};

export function GuideItemDetail({ item }: GuideItemDetailProps) {
  const [faqOpenId, setFaqOpenId] = useState<string | null>(null);
  const [showCompanies, setShowCompanies] = useState(false);
  const [companyOpenId, setCompanyOpenId] = useState<string | null>(null);
  const showReservationButtons = hasReservation(item);
  const fetchPlaceInfo =
    !item.mapPopupLink && !item.subActions && Boolean(item.mapsQuery);
  const { info, loading } = usePlaceInfo(item.mapsQuery, fetchPlaceInfo);

  useEffect(() => {
    setFaqOpenId(null);
    setShowCompanies(false);
    setCompanyOpenId(null);
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
        <>
          <div className="pg-subaction-grid">
            {item.subActions.map((action) => {
              const isCompaniesAction = action.id === "hopping-companies";
              const isOpen = isCompaniesAction
                ? showCompanies
                : false;

              return (
                <button
                  key={action.id}
                  type="button"
                  className={`pg-subaction-card${isOpen ? " pg-subaction-card--open" : ""}`}
                  disabled={
                    !isCompaniesAction && !action.url && !action.description
                  }
                  onClick={() => {
                    if (isCompaniesAction) {
                      if (showCompanies) {
                        setCompanyOpenId(null);
                        setShowCompanies(false);
                      } else {
                        setShowCompanies(true);
                      }
                      return;
                    }
                    if (action.description) {
                      return;
                    }
                    if (action.url) {
                      if (isKakaoChannelUrl(action.url)) {
                        handleKakaoChannelClick(action.url);
                      }
                      window.open(action.url, "_blank");
                    }
                  }}
                >
                  <span className="pg-subaction-icon">{action.icon}</span>
                  <span className="pg-subaction-label">{action.label}</span>
                </button>
              );
            })}
          </div>
          <CompanyListPanel
            item={item}
            showCompanies={showCompanies}
            companyOpenId={companyOpenId}
            onCompanyOpenIdChange={setCompanyOpenId}
          />
        </>
      ) : null}

      {item.faqItems ? (
        <div className="pg-faq-section">
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
          ) : info ? (
            <>
              {info.rating != null ? (
                <p className="pg-place-info-rating">
                  <span aria-hidden>⭐</span> {info.rating.toFixed(1)}
                  {info.userRatingCount != null ? (
                    <span className="pg-place-info-reviews">
                      {" "}
                      · 리뷰 {info.userRatingCount.toLocaleString()}개
                    </span>
                  ) : null}
                </p>
              ) : null}
              {info.address ? <p className="pg-place-info-address">{info.address}</p> : null}
              {info.weekdayDescriptions && info.weekdayDescriptions.length > 0 ? (
                <ul className="pg-place-info-hours">
                  {info.weekdayDescriptions.map((line) => (
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
                href={
                  item.googleMapsUrl ??
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapsQuery)}`
                }
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
