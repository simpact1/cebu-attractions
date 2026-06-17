import type { RefObject } from "react";
import type { CebuGuideCompany, CebuGuideItem } from "./cebuPlacesData";
import { KakaoTalkIcon } from "./KakaoTalkIcon";
import { handleKakaoChannelClick } from "./kakaoSubAction";

const SOLO_HOPPING_KAKAO_URL =
  "https://pf.kakao.com/_xoVxhjxb/chat?utm_source=cebu-places-app&utm_medium=hopping&utm_campaign=solo";

type CompanyOpenProps = {
  companyOpenId: string | null;
  onCompanyOpenIdChange: (id: string | null) => void;
  companyGridRef?: RefObject<HTMLDivElement | null>;
};

export function CompanyGroupsPanel({
  item,
  companyOpenId,
  onCompanyOpenIdChange,
  companyGridRef,
}: CompanyOpenProps & { item: CebuGuideItem }) {
  if (!item.companyGroups) {
    return null;
  }

  return (
    <div className="pg-company-section">
      {item.companyGroups.map((group, gi) => (
        <div key={gi} className="pg-company-group">
          <p className="pg-company-group-title">{group.groupTitle}</p>
          <div
            ref={
              companyOpenId && group.companies.some((c) => c.id === companyOpenId)
                ? companyGridRef
                : undefined
            }
            className="pg-company-grid pg-company-grid--2col"
          >
            {group.companies.map((company) => (
              <button
                key={company.id}
                type="button"
                className={`pg-company-card${companyOpenId === company.id ? " pg-company-card--open" : ""}`}
                onClick={() =>
                  onCompanyOpenIdChange(companyOpenId === company.id ? null : company.id)
                }
              >
                <span className="pg-company-icon">{company.icon}</span>
                <span className="pg-company-label">{company.label}</span>
              </button>
            ))}
          </div>
          {group.companies.map((company) =>
            companyOpenId === company.id ? (
              <div key={company.id} className="pg-company-detail">
                <p className="pg-company-desc">{company.description}</p>
                <p className="pg-company-recommend">✅ 추천대상: {company.recommend}</p>
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pg-company-btn pg-company-btn--reserve"
                >
                  예약하러 가기 →
                </a>
              </div>
            ) : null,
          )}
        </div>
      ))}
    </div>
  );
}

type CompanyListPanelProps = {
  item: CebuGuideItem;
  showCompanies: boolean;
  companyList?: CebuGuideCompany[];
  companyOpenId: string | null;
  onCompanyOpenIdChange: (id: string | null) => void;
  companyGridRef?: RefObject<HTMLDivElement | null>;
};

export function CompanyListPanel({
  item,
  showCompanies,
  companyList,
  companyOpenId,
  onCompanyOpenIdChange,
  companyGridRef,
}: CompanyListPanelProps) {
  const list = companyList ?? item.companyList;
  if (!showCompanies || !list) {
    return null;
  }

  const openCompany = list.find((company) => company.id === companyOpenId);

  return (
    <div className="pg-company-section">
      <div ref={companyGridRef} className="pg-company-grid">
        {list.map((company) => (
          <button
            key={company.id}
            type="button"
            className={`pg-company-card${companyOpenId === company.id ? " pg-company-card--open" : ""}`}
            onClick={() =>
              onCompanyOpenIdChange(companyOpenId === company.id ? null : company.id)
            }
          >
            <span className="pg-company-icon">{company.icon}</span>
            <span className="pg-company-label">{company.label}</span>
          </button>
        ))}
      </div>
      {openCompany ? (
        <div className="pg-company-detail">
          <div className="pg-company-detail-header">
            <span className="pg-company-detail-icon">{openCompany.icon}</span>
            <span className="pg-company-detail-name">{openCompany.label}</span>
          </div>
          <p className="pg-company-desc">{openCompany.description}</p>
          <p className="pg-company-recommend">✅ 추천대상: {openCompany.recommend}</p>
          {openCompany.id === "company-우리" ? (
            <div className="pg-company-btn-row">
              <a
                href={SOLO_HOPPING_KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pg-company-btn pg-company-btn--kakao"
                onClick={() => handleKakaoChannelClick(SOLO_HOPPING_KAKAO_URL)}
              >
                <KakaoTalkIcon />
                카톡문의
              </a>
              <a
                href={openCompany.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pg-company-btn pg-company-btn--reserve"
              >
                📋 예약하기
              </a>
            </div>
          ) : (
            <a
              href={openCompany.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-company-btn pg-company-btn--reserve"
            >
              📋 예약하기
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
