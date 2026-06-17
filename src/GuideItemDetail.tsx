import { useEffect, useState } from "react";
import { CompanyGroupsPanel, CompanyListPanel } from "./CompanyListPanel";
import type { CebuGuideItem } from "./cebuPlacesData";
import { KakaoTalkIcon } from "./KakaoTalkIcon";
import { handleKakaoChannelClick, hasReservation, isKakaoChannelUrl } from "./kakaoSubAction";
import { ReservationActionButtons } from "./reservationActionButtons";
import { usePlaceInfo } from "./usePlaceInfo";

type GuideItemDetailProps = {
  item: CebuGuideItem;
  onScrollToActivityTop?: () => void;
};

function subActionLinkTarget(url: string): "_self" | "_blank" {
  return url.includes("blog.naver.com") || url.includes("cafe.naver.com")
    ? "_self"
    : "_blank";
}

function openSubActionUrl(url: string): void {
  if (isKakaoChannelUrl(url)) {
    handleKakaoChannelClick(url);
  }
  window.open(url, subActionLinkTarget(url), "noopener,noreferrer");
}

export function GuideItemDetail({ item, onScrollToActivityTop }: GuideItemDetailProps) {
  const [faqOpenId, setFaqOpenId] = useState<string | null>(null);
  const [showCompanies, setShowCompanies] = useState(
    () => Boolean((item.companyList || item.companyGroups) && !item.subActions),
  );
  const [companyOpenId, setCompanyOpenId] = useState<string | null>(null);
  const [subActionOpenId, setSubActionOpenId] = useState<string | null>(null);
  const showReservationButtons =
    Boolean(item.reservationUrl) ||
    (hasReservation(item) &&
      !item.subActions?.some((action) => !action.id.endsWith("-reservation")));
  const fetchPlaceInfo =
    !item.mapPopupLink &&
    !item.subActions &&
    !item.companyList &&
    !item.companyGroups &&
    !item.reservationUrl &&
    Boolean(item.mapsQuery);
  const { info, loading } = usePlaceInfo(item.mapsQuery, fetchPlaceInfo);

  useEffect(() => {
    setFaqOpenId(null);
    setShowCompanies(Boolean((item.companyList || item.companyGroups) && !item.subActions));
    setCompanyOpenId(null);
    setSubActionOpenId(null);
  }, [item.id, item.companyList, item.companyGroups, item.subActions]);

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
          <div
            className="pg-subaction-grid"
            style={{ gridTemplateColumns: `repeat(${item.subActions.length}, 1fr)` }}
          >
            {item.subActions.map((action) => {
              const isCompaniesAction = action.id === "hopping-companies";
              const isKakaoInquiry =
                action.id.endsWith("-inquiry") ||
                Boolean(action.url?.includes("kakao.com"));
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
                    onClick={() => {
                      handleKakaoChannelClick(action.url!);
                      onScrollToActivityTop?.();
                    }}
                  >
                    <KakaoTalkIcon />
                    <span className="pg-subaction-label">{action.label}</span>
                  </a>
                );
              }

              if (action.url && !isCompaniesAction && !action.description) {
                const target =
                  action.url.includes("blog.naver.com") ||
                  action.url.includes("cafe.naver.com")
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
                      onScrollToActivityTop?.();
                      if (isKakaoChannelUrl(action.url!)) {
                        event.preventDefault();
                        handleKakaoChannelClick(action.url!);
                      }
                    }}
                  >
                    <span
                      className={`pg-subaction-icon${
                        action.id === "canyoneering-info"
                          ? " pg-subaction-icon--smaller"
                          : action.id === "oslob-total"
                            ? " pg-subaction-icon--small"
                            : ""
                      }`}
                    >
                      {action.icon}
                    </span>
                    <span
                      className={`pg-subaction-label${
                        [
                          "oslob-total",
                          "oslob-mo-tour",
                          "oslob-canyoneering-tour",
                          "canyoneering-info",
                        ].includes(action.id)
                          ? " pg-subaction-label--small"
                          : action.id === "oslob-tour" ||
                              action.id === "oslob-canyoneering-mo-tour"
                            ? " pg-subaction-label--smaller"
                            : ""
                      }`}
                    >
                      {action.label}
                    </span>
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
                      onScrollToActivityTop?.();
                      return;
                    }
                    if (action.description) {
                      setShowCompanies(false);
                      const openingDescription = subActionOpenId !== action.id;
                      setSubActionOpenId(openingDescription ? action.id : null);
                      if (openingDescription) {
                        onScrollToActivityTop?.();
                      }
                      return;
                    }
                    if (action.url) {
                      onScrollToActivityTop?.();
                      openSubActionUrl(action.url);
                    }
                  }}
                >
                  <span
                    className={`pg-subaction-icon${
                      action.id === "canyoneering-info"
                        ? " pg-subaction-icon--smaller"
                        : action.id === "oslob-total"
                          ? " pg-subaction-icon--small"
                          : ""
                    }`}
                  >
                    {action.icon}
                  </span>
                  <span
                    className={`pg-subaction-label${
                      [
                        "oslob-total",
                        "oslob-mo-tour",
                        "oslob-canyoneering-tour",
                        "canyoneering-info",
                      ].includes(action.id)
                        ? " pg-subaction-label--small"
                        : action.id === "oslob-tour" ||
                            action.id === "oslob-canyoneering-mo-tour"
                          ? " pg-subaction-label--smaller"
                          : ""
                    }`}
                  >
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
          {openSubAction?.description ? (
            <div className="pg-subaction-detail">
              <p className="pg-subaction-detail-text">{openSubAction.description}</p>
              {openSubAction.url ? (
                <a
                  href={openSubAction.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pg-subaction-detail-btn"
                >
                  예약하기
                </a>
              ) : null}
            </div>
          ) : null}
          <CompanyListPanel
            item={item}
            showCompanies={showCompanies}
            companyOpenId={companyOpenId}
            onCompanyOpenIdChange={setCompanyOpenId}
          />
        </>
      ) : item.companyGroups ? (
        <CompanyGroupsPanel
          item={item}
          companyOpenId={companyOpenId}
          onCompanyOpenIdChange={setCompanyOpenId}
        />
      ) : item.companyList ? (
        <CompanyListPanel
          item={item}
          showCompanies
          companyOpenId={companyOpenId}
          onCompanyOpenIdChange={setCompanyOpenId}
        />
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
          {item.mapsQuery &&
          !loading &&
          !item.subActions &&
          !item.companyList &&
          !item.companyGroups &&
          !item.reservationUrl ? (
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
      ) : item.mapsQuery &&
        !item.subActions &&
        !item.companyList &&
        !item.companyGroups &&
        !item.reservationUrl ? (
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
