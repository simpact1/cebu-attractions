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
  const [subActionOpenId, setSubActionOpenId] = useState<string | null>(null);
  const showReservationButtons =
    hasReservation(item) &&
    !item.subActions?.some((action) => !action.id.endsWith("-reservation"));
  const fetchPlaceInfo =
    !item.mapPopupLink && !item.subActions && Boolean(item.mapsQuery);
  const { info, loading } = usePlaceInfo(item.mapsQuery, fetchPlaceInfo);

  useEffect(() => {
    setFaqOpenId(null);
    setShowCompanies(false);
    setCompanyOpenId(null);
    setSubActionOpenId(null);
  }, [item.id]);

  const openSubAction = item.subActions?.find((action) => action.id === subActionOpenId);

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
              const isKakaoInquiry = action.icon === "kakao";
              const isOpen = isCompaniesAction
                ? showCompanies
                : subActionOpenId === action.id;

              if (isKakaoInquiry && action.url) {
                return (
                  <a
                    key={action.id}
                    href={action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`pg-subaction-card pg-subaction-card--kakao${isOpen ? " pg-subaction-card--open" : ""}`}
                    onClick={() => handleKakaoChannelClick(action.url!)}
                  >
                    <span className="pg-subaction-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24">
                        <ellipse cx="12" cy="11" rx="10" ry="8" fill="#FEE500" />
                        <path
                          d="M12 5.5C7.31 5.5 3.5 8.36 3.5 11.88c0 2.18 1.45 4.1 3.64 5.27l-.93 3.44 3.97-2.6c.57.08 1.15.13 1.75.13 4.69 0 8.5-2.86 8.5-6.38S16.69 5.5 12 5.5z"
                          fill="#3C1E1E"
                        />
                      </svg>
                    </span>
                    <span className="pg-subaction-label">{action.label}</span>
                  </a>
                );
              }

              if (action.url && !isCompaniesAction && !action.description) {
                const target = action.url.includes("blog.naver.com")
                  ? "_self"
                  : "_blank";
                return (
                  <a
                    key={action.id}
                    href={action.url}
                    target={target}
                    rel={target === "_blank" ? "noopener noreferrer" : undefined}
                    className={`pg-subaction-card${isOpen ? " pg-subaction-card--open" : ""}`}
                    onClick={(event) => {
                      if (isKakaoChannelUrl(action.url!)) {
                        event.preventDefault();
                        handleKakaoChannelClick(action.url!);
                      }
                    }}
                  >
                    <span className="pg-subaction-icon">{action.icon}</span>
                    <span className="pg-subaction-label">{action.label}</span>
                  </a>
                );
              }

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
                        setSubActionOpenId(null);
                        setShowCompanies(true);
                      }
                      return;
                    }
                    if (action.description) {
                      setSubActionOpenId(
                        subActionOpenId === action.id ? null : action.id,
                      );
                    }
                  }}
                >
                  <span className="pg-subaction-icon">{action.icon}</span>
                  <span className="pg-subaction-label">{action.label}</span>
                </button>
              );
            })}
          </div>
          {openSubAction?.description ? (
            <div className="pg-subaction-detail">
              <p className="pg-subaction-detail-text">{openSubAction.description}</p>
            </div>
          ) : null}
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
