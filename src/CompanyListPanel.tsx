import type { CebuGuideItem } from "./cebuPlacesData";
import { handleKakaoChannelClick } from "./kakaoSubAction";

const SOLO_HOPPING_KAKAO_URL =
  "https://pf.kakao.com/_xoVxhjxb/chat?utm_source=cebu-places-app&utm_medium=hopping&utm_campaign=solo";

type CompanyListPanelProps = {
  item: CebuGuideItem;
  showCompanies: boolean;
  companyOpenId: string | null;
  onCompanyOpenIdChange: (id: string | null) => void;
};

export function CompanyListPanel({
  item,
  showCompanies,
  companyOpenId,
  onCompanyOpenIdChange,
}: CompanyListPanelProps) {
  if (!showCompanies || !item.companyList) {
    return null;
  }

  const openCompany = item.companyList.find((company) => company.id === companyOpenId);

  return (
    <div className="pg-company-section">
      <div className="pg-company-grid">
        {item.companyList.map((company) => (
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
                💬 카톡문의
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
