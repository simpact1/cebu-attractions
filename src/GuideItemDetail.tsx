import { useEffect, useRef, useState } from "react";
import { CompanyGroupsPanel, CompanyListPanel } from "./CompanyListPanel";
import type { CebuGuideItem, CebuGuideSubAction } from "./cebuPlacesData";
import { KakaoTalkIcon } from "./KakaoTalkIcon";
import { handleKakaoChannelClick, hasReservation, isKakaoChannelUrl } from "./kakaoSubAction";
import { ReservationActionButtons } from "./reservationActionButtons";
import { usePlaceInfo } from "./usePlaceInfo";

type GuideItemDetailProps = {
  item: CebuGuideItem;
  onScrollToActivityTop?: () => void;
  onScrollToCompanyGrid?: (ref: React.RefObject<HTMLDivElement | null>) => void;
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

function subActionIconClass(actionId: string): string {
  if (actionId === "canyoneering-info") return " pg-subaction-icon--smaller";
  if (actionId === "oslob-total") return " pg-subaction-icon--large";
  return "";
}

function subActionLabelClass(actionId: string): string {
  if (["oslob-total", "oslob-tour-detail", "oslob-tour-inquiry"].includes(actionId)) {
    return " pg-subaction-label--xlarge";
  }
  if (["oslob-mo-tour", "oslob-canyoneering-tour", "canyoneering-info"].includes(actionId)) {
    return " pg-subaction-label--small";
  }
  if (actionId === "oslob-tour" || actionId === "oslob-canyoneering-mo-tour") {
    return " pg-subaction-label--smaller";
  }
  return "";
}

export function GuideItemDetail({
  item,
  onScrollToActivityTop,
  onScrollToCompanyGrid,
}: GuideItemDetailProps) {
  const [faqOpenId, setFaqOpenId] = useState<string | null>(null);
  const [showCompanies, setShowCompanies] = useState(
    () => Boolean((item.companyList || item.companyGroups) && !item.subActions),
  );
  const [companyOpenId, setCompanyOpenId] = useState<string | null>(null);
  const [subActionOpenId, setSubActionOpenId] = useState<string | null>(null);
  const [nestedSubActionOpenId, setNestedSubActionOpenId] = useState<string | null>(null);
  const [openCompanyListId, setOpenCompanyListId] = useState<string | null>(null);
  const companyGridRef = useRef<HTMLDivElement>(null);
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
    setNestedSubActionOpenId(null);
    setOpenCompanyListId(null);
  }, [item.id, item.companyList, item.companyGroups, item.subActions]);

  function handleCompanyOpenIdChange(nextId: string | null) {
    const opening = nextId !== null;
    setCompanyOpenId(nextId);
    if (opening) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (onScrollToCompanyGrid) {
            onScrollToCompanyGrid(companyGridRef);
          } else if (companyGridRef.current) {
            const top = companyGridRef.current.getBoundingClientRect().top;
            const scrollY = window.scrollY + top - 16;
            window.scrollTo({ top: scrollY, behavior: "smooth" });
          }
        }, 50);
      });
    }
  }

  const openSubAction = item.subActions?.find((action) => action.id === subActionOpenId);
  const openNestedSubAction = item.subActions?.find(
    (action) => action.id === nestedSubActionOpenId,
  );
  const openCompanyListAction = item.subActions?.find(
    (action) => action.id === openCompanyListId,
  );

  function renderNestedSubAction(action: CebuGuideSubAction) {
    const isKakaoInquiry =
      action.id.endsWith("-inquiry") || Boolean(action.url?.includes("kakao.com"));

    if (isKakaoInquiry && action.url) {
      return (
        <a
          key={action.id}
          href={action.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pg-subaction-card pg-subaction-card--kakao"
          onClick={() => {
            handleKakaoChannelClick(action.url!);
            onScrollToActivityTop?.();
          }}
        >
          <KakaoTalkIcon />
          <span className={`pg-subaction-label${subActionLabelClass(action.id)}`}>
            {action.label}
          </span>
        </a>
      );
    }

    if (action.url) {
      const target = subActionLinkTarget(action.url);
      return (
        <a
          key={action.id}
          href={action.url}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="pg-subaction-card"
          onClick={(event) => {
            onScrollToActivityTop?.();
            if (isKakaoChannelUrl(action.url!)) {
              event.preventDefault();
              handleKakaoChannelClick(action.url!);
            }
          }}
        >
          <span className={`pg-subaction-icon${subActionIconClass(action.id)}`}>
            {action.icon}
          </span>
          <span className={`pg-subaction-label${subActionLabelClass(action.id)}`}>
            {action.label}
          </span>
        </a>
      );
    }

    return null;
  }

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
              const hasNestedSubActions = Boolean(action.subActions?.length);
              const hasCompanyList = Boolean(action.companyList?.length);
              const isKakaoInquiry =
                action.id.endsWith("-inquiry") ||
                Boolean(action.url?.includes("kakao.com"));
              const isOpen = isCompaniesAction
                ? showCompanies
                : hasCompanyList
                  ? openCompanyListId === action.id
                  : hasNestedSubActions
                    ? nestedSubActionOpenId === action.id
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

              if (action.url && !isCompaniesAction && !action.description && !hasCompanyList) {
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
                    <span className={`pg-subaction-icon${subActionIconClass(action.id)}`}>
                      {action.icon}
                    </span>
                    <span className={`pg-subaction-label${subActionLabelClass(action.id)}`}>
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
                    !isCompaniesAction &&
                    !action.url &&
                    !action.description &&
                    !hasNestedSubActions &&
                    !hasCompanyList
                  }
                  onClick={() => {
                    if (isCompaniesAction) {
                      if (showCompanies) {
                        setCompanyOpenId(null);
                        setShowCompanies(false);
                      } else {
                        setSubActionOpenId(null);
                        setNestedSubActionOpenId(null);
                        setOpenCompanyListId(null);
                        setShowCompanies(true);
                      }
                      onScrollToActivityTop?.();
                      return;
                    }
                    if (hasCompanyList) {
                      setShowCompanies(false);
                      setSubActionOpenId(null);
                      setNestedSubActionOpenId(null);
                      const openingCompanyList = openCompanyListId !== action.id;
                      setOpenCompanyListId(openingCompanyList ? action.id : null);
                      setCompanyOpenId(null);
                      if (openingCompanyList) {
                        onScrollToActivityTop?.();
                      }
                      return;
                    }
                    if (hasNestedSubActions) {
                      setShowCompanies(false);
                      setOpenCompanyListId(null);
                      setSubActionOpenId(null);
                      setCompanyOpenId(null);
                      const openingNested = nestedSubActionOpenId !== action.id;
                      setNestedSubActionOpenId(openingNested ? action.id : null);
                      if (openingNested) {
                        onScrollToActivityTop?.();
                      }
                      return;
                    }
                    if (action.description) {
                      setShowCompanies(false);
                      setOpenCompanyListId(null);
                      setNestedSubActionOpenId(null);
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
                  <span className={`pg-subaction-icon${subActionIconClass(action.id)}`}>
                    {action.icon}
                  </span>
                  <span className={`pg-subaction-label${subActionLabelClass(action.id)}`}>
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
          {openNestedSubAction?.subActions ? (
            <div
              className="pg-subaction-grid pg-subaction-grid--nested"
              style={{
                gridTemplateColumns: `repeat(${openNestedSubAction.subActions.length}, 1fr)`,
              }}
            >
              {openNestedSubAction.subActions.map(renderNestedSubAction)}
            </div>
          ) : null}
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
            onCompanyOpenIdChange={handleCompanyOpenIdChange}
            companyGridRef={companyGridRef}
          />
          <CompanyListPanel
            item={item}
            companyList={openCompanyListAction?.companyList}
            showCompanies={Boolean(openCompanyListId && openCompanyListAction?.companyList)}
            companyOpenId={companyOpenId}
            onCompanyOpenIdChange={handleCompanyOpenIdChange}
            companyGridRef={companyGridRef}
          />
        </>
      ) : item.companyGroups ? (
        <CompanyGroupsPanel
          item={item}
          companyOpenId={companyOpenId}
          onCompanyOpenIdChange={handleCompanyOpenIdChange}
          companyGridRef={companyGridRef}
        />
      ) : item.companyList ? (
        <CompanyListPanel
          item={item}
          showCompanies
          companyOpenId={companyOpenId}
          onCompanyOpenIdChange={handleCompanyOpenIdChange}
          companyGridRef={companyGridRef}
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
