import { CebuPlacesGuide } from "./CebuPlacesGuide";

export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Philippines · Cebu</p>
        <h1>세부 가볼 만한 곳</h1>
        <p className="sub">
          세부·막탄·세부외곽·세부영상(블로그)·보홀(가볼만한 곳·쇼핑몰)을 구분합니다.
        </p>
      </header>
      <main className="grid">
        <CebuPlacesGuide />
      </main>
      <nav
        aria-label="세부 여행 앱 바로가기"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          background: "rgba(4,47,46,0.97)",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: "10px 0 max(10px, env(safe-area-inset-bottom))",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          maxWidth: "430px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {[
          {
            href: "https://cebu-planner-weather.vercel.app",
            bg: "linear-gradient(135deg,#32D4A4,#0EA5E9)",
            icon: "🌤️",
            label: "날씨",
          },
          {
            href: "https://cebu-accommodation-guide.vercel.app",
            bg: "linear-gradient(135deg,#007AFF,#5AC8FA)",
            icon: "🏨",
            label: "숙소",
          },
          {
            href: "https://cebu-traffic-master.vercel.app",
            bg: "linear-gradient(135deg,#F59E0B,#F97316)",
            icon: "🚗",
            label: "교통",
          },
          {
            href: "https://cebu-exchange-rate.vercel.app",
            bg: "linear-gradient(135deg,#10B981,#059669)",
            icon: "💱",
            label: "환율",
          },
        ].map((item, i, arr) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              padding: "8px 4px",
              textDecoration: "none",
              borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
              WebkitTapHighlightColor: "transparent",
              outline: "none",
            }}
          >
            <span
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: item.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
          </a>
        ))}
      </nav>
      <style>{`
        .app {
          width: 100%;
          max-width: 52rem;
          min-width: 0;
          margin: 0 auto;
          padding: 1.25rem max(0.75rem, env(safe-area-inset-left)) 3rem
            max(0.75rem, env(safe-area-inset-right));
          padding-bottom: max(7rem, calc(4rem + env(safe-area-inset-bottom)));
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .hero {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .eyebrow {
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin: 0 0 0.35rem;
        }
        h1 {
          font-size: clamp(1.6rem, 5vw, 2.1rem);
          font-weight: 700;
          margin: 0 0 0.5rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .sub {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.55;
          margin: 0 auto 1rem;
          max-width: 36rem;
          overflow-wrap: anywhere;
        }
        .sub strong {
          color: #fef9c3;
          font-weight: 600;
        }
        .sub code {
          font-size: 0.82em;
          padding: 0.08em 0.35em;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.35);
          font-family: ui-monospace, monospace;
        }
        .grid {
          display: grid;
          gap: 1rem;
          width: 100%;
          min-width: 0;
        }
        .card {
          background: var(--bg-card);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(236, 254, 255, 0.12);
          border-radius: var(--radius);
          padding: 1.15rem 1.2rem;
          min-width: 0;
          max-width: 100%;
        }
        .card h2 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.85rem;
          color: #ccfbf1;
        }
        .muted {
          color: var(--text-muted);
          margin: 0 0 0.75rem;
        }
        .muted.lead {
          font-size: 0.82rem;
          line-height: 1.5;
          margin: -0.2rem 0 0.9rem;
        }
        .muted.lead strong {
          color: #fef9c3;
          font-weight: 600;
        }
        .card-place-guide .pg-lead {
          margin-bottom: 0.85rem;
        }
        .pg-zone-row,
        .pg-group-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.65rem;
        }
        .pg-group-row {
          margin-top: -0.15rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .pg-tab {
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.5rem 0.85rem;
          border-radius: 0.5rem;
          border-width: 2px;
          border-style: solid;
          transition:
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease,
            box-shadow 0.15s ease,
            opacity 0.15s ease;
        }
        .pg-tab-idle {
          opacity: 0.55;
          color: rgba(236, 254, 255, 0.72);
          background: rgba(0, 0, 0, 0.45);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: none;
        }
        .pg-tab-idle:hover {
          opacity: 0.85;
          border-color: rgba(255, 255, 255, 0.22);
          color: rgba(254, 249, 195, 0.95);
        }
        .pg-tab-on {
          opacity: 1;
          font-weight: 700;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.35),
            0 4px 14px rgba(0, 0, 0, 0.35);
        }
        .pg-tab-on--cebu-city {
          color: #ecfdf5;
          background: linear-gradient(
            165deg,
            rgba(52, 211, 153, 0.95) 0%,
            rgba(5, 150, 105, 0.98) 55%,
            rgba(4, 120, 87, 1) 100%
          );
          border-color: #6ee7b7;
        }
        .pg-tab-on--mactan {
          color: #f0f9ff;
          background: linear-gradient(
            165deg,
            rgba(56, 189, 248, 0.95) 0%,
            rgba(2, 132, 199, 0.98) 55%,
            rgba(3, 105, 161, 1) 100%
          );
          border-color: #7dd3fc;
        }
        .pg-tab-on--outskirts {
          color: #faf5ff;
          background: linear-gradient(
            165deg,
            rgba(167, 139, 250, 0.95) 0%,
            rgba(124, 58, 237, 0.98) 55%,
            rgba(109, 40, 217, 1) 100%
          );
          border-color: #c4b5fd;
        }
        .pg-tab-cebu-video {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          cursor: pointer;
          text-decoration: none;
          opacity: 0.55;
          color: rgba(236, 254, 255, 0.72);
          background: rgba(0, 0, 0, 0.45);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: none;
        }
        .pg-tab-cebu-video:hover {
          opacity: 0.85;
          border-color: rgba(255, 255, 255, 0.22);
          color: rgba(254, 249, 195, 0.95);
        }
        .pg-tab-on--bohol {
          color: #ecfeff;
          background: linear-gradient(
            165deg,
            rgba(45, 212, 191, 0.9) 0%,
            rgba(13, 148, 136, 0.95) 50%,
            rgba(15, 118, 110, 1) 100%
          );
          border-color: #99f6e4;
        }
        .pg-tab-sub {
          font-size: 0.78rem;
          font-weight: 600;
        }
        .pg-tab-sub-idle {
          opacity: 0.55;
          color: rgba(236, 254, 255, 0.72);
          background: rgba(0, 0, 0, 0.38);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: none;
        }
        .pg-tab-sub-idle:hover {
          opacity: 0.88;
          border-color: rgba(165, 243, 252, 0.35);
          color: rgba(254, 249, 195, 0.95);
        }
        .pg-tab-sub-on {
          opacity: 1;
          font-weight: 700;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.25),
            0 2px 10px rgba(0, 0, 0, 0.25);
        }
        .pg-group-row--cebu-city .pg-tab-sub-on {
          color: #ecfdf5;
          background: rgba(4, 120, 87, 0.65);
          border-color: rgba(110, 231, 183, 0.75);
        }
        .pg-group-row--mactan .pg-tab-sub-on {
          color: #f0f9ff;
          background: rgba(3, 105, 161, 0.65);
          border-color: rgba(125, 211, 252, 0.75);
        }
        .pg-group-row--bohol .pg-tab-sub-on {
          color: #ecfeff;
          background: rgba(15, 118, 110, 0.65);
          border-color: rgba(153, 246, 228, 0.75);
        }
        .pg-group-row--outskirts .pg-tab-sub-on {
          color: #faf5ff;
          background: rgba(109, 40, 217, 0.65);
          border-color: rgba(196, 181, 253, 0.75);
        }
        .pg-tab:focus-visible {
          outline: 2px solid #a5f3fc;
          outline-offset: 2px;
        }
        .mf-wrap {
          margin: 0.65rem 0 0.75rem;
          padding: 0.75rem 0.65rem;
          border-radius: 0.75rem;
          background: rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(165, 243, 252, 0.18);
        }
        .mg-quick-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          width: 100%;
        }
        .mg-quick-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          padding: 1.4rem 0.3rem;
          border-radius: 0.75rem;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.22);
          color: #ecfeff;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .mg-quick-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(165, 243, 252, 0.35);
        }
        .mg-quick-icon {
          font-size: clamp(2rem, 7vw, 2.8rem);
          line-height: 1;
        }
        .mg-quick-label {
          font-size: clamp(0.72rem, 2.2vw, 0.88rem);
          font-weight: 700;
          text-align: center;
          line-height: 1.35;
          white-space: pre-line;
          word-break: keep-all;
          width: 100%;
        }
        .mf-section {
          margin-bottom: 0.65rem;
        }
        .mf-section:last-child {
          margin-bottom: 0;
        }
        .mf-label {
          display: block;
          margin-bottom: 0.45rem;
          font-size: 0.76rem;
          font-weight: 700;
          color: rgba(165, 243, 252, 0.9);
        }
        .mf-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .mf-chip {
          padding: 0.38rem 0.62rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(0, 0, 0, 0.22);
          color: #ecfeff;
          font: inherit;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .mf-chip--off:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(165, 243, 252, 0.35);
        }
        .mf-chip--on {
          background: rgba(56, 189, 248, 0.22);
          border-color: rgba(125, 211, 252, 0.75);
          color: #f0f9ff;
        }
        .mg-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          padding: 0.3rem 0.65rem 0.4rem;
        }
        .mg-place-info {
          padding: 0 0.65rem 0.5rem;
        }
        .mg-place-loading {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0 0 0.5rem;
        }
        .mg-place-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }
        .mg-place-chip {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.55rem;
          border-radius: 0.4rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .mg-place-sub {
          font-weight: 400;
          font-size: 0.7rem;
          opacity: 0.85;
        }
        .mg-place-chip--rating {
          background: rgba(251, 191, 36, 0.2);
          color: #fde68a;
          border: 1px solid rgba(251, 191, 36, 0.35);
        }
        .mg-place-chip--price {
          background: rgba(52, 211, 153, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }
        .mg-place-chip--hours {
          background: rgba(56, 189, 248, 0.15);
          color: #bae6fd;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .mg-place-chip--open {
          background: rgba(52, 211, 153, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }
        .mg-place-chip--closed {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .mg-place-hours {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0.5rem;
          padding: 0.5rem 0.65rem;
          margin-bottom: 0.5rem;
        }
        .mg-place-hours-title {
          margin: 0 0 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(165, 243, 252, 0.9);
        }
        .mg-place-hours-row {
          margin: 0;
          font-size: 0.72rem;
          color: rgba(165, 243, 252, 0.75);
          line-height: 1.6;
        }
        .mg-badge {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.18rem 0.5rem;
          border-radius: 0.35rem;
          line-height: 1.4;
        }
        .mg-badge--premium {
          background: rgba(245, 158, 11, 0.25);
          color: #fde68a;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .mg-badge--budget {
          background: rgba(56, 189, 248, 0.2);
          color: #bae6fd;
          border: 1px solid rgba(56, 189, 248, 0.35);
        }
        .mg-badge--zone {
          background: rgba(52, 211, 153, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }
        .mg-badge--recommend {
          background: rgba(167, 139, 250, 0.2);
          color: #c4b5fd;
          border: 1px solid rgba(167, 139, 250, 0.35);
        }
        .pg-massage-empty {
          padding: 1rem 0.65rem;
          text-align: center;
          list-style: none;
        }
        .pg-massage-selected {
          margin: 0.65rem 0 0;
          border-radius: 0.55rem;
          background: rgba(0, 0, 0, 0.22);
          border: 1px solid rgba(125, 211, 252, 0.45);
          overflow: hidden;
        }
        .pg-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .pg-item {
          border-radius: 0.55rem;
          background: rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }
        .pg-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          text-align: left;
          padding: 0.55rem 0.65rem;
          border: none;
          background: transparent;
          color: #ecfeff;
          font-size: 0.88rem;
          font-weight: 600;
        }
        .pg-item-btn:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .pg-item-title {
          flex: 1;
          min-width: 0;
        }
        .pg-chev {
          flex-shrink: 0;
          font-size: 0.65rem;
          color: rgba(165, 243, 252, 0.9);
        }
        .pg-item-desc {
          margin: 0;
          padding: 0 0.65rem 0.65rem;
          font-size: 0.82rem;
          line-height: 1.55;
          color: rgba(165, 243, 252, 0.95);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 0.5rem;
        }
        .pg-item-detail {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 0.5rem;
        }
        .pg-item-detail .pg-item-desc {
          border-top: none;
          padding-top: 0;
        }
        .pg-item-info {
          padding: 0 0.65rem 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .pg-item-info p {
          margin: 0;
          font-size: 0.8rem;
          color: rgba(165, 243, 252, 0.9);
          line-height: 1.45;
        }
        .pg-activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
          gap: 0.5rem;
          margin-bottom: 0.85rem;
          width: 100%;
        }
        .pg-activity-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.85rem 0.25rem;
          border-radius: 0.75rem;
          border: 2px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.25);
          color: #ecfeff;
          cursor: pointer;
          transition: all 0.15s ease;
          min-width: 0;
          width: 100%;
        }
        .pg-activity-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
        }
        .pg-activity-card--open {
          background: rgba(4, 120, 87, 0.45);
          border-color: rgba(110, 231, 183, 0.9);
          box-shadow: 0 0 0 1px rgba(110, 231, 183, 0.4);
        }
        .pg-activity-icon {
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          line-height: 1;
          flex-shrink: 0;
        }
        .pg-activity-name {
          font-size: clamp(0.55rem, 2.4vw, 0.8rem);
          font-weight: 600;
          text-align: center;
          line-height: 1.3;
          white-space: pre-line;
          max-width: 100%;
          width: 100%;
          overflow-wrap: break-word;
          word-break: keep-all;
        }
        .pg-activity-detail {
          margin-bottom: 0.85rem;
        }
        .pg-subaction-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(3.5rem, 1fr));
          gap: 0.5rem;
          padding: 0.75rem 0.65rem;
          width: 100%;
          border-top: 2px solid rgba(165, 243, 252, 0.25);
          margin-top: 0.5rem;
        }
        .pg-subaction-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          aspect-ratio: 1 / 1;
          padding: 0;
          min-height: 0;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.2);
          color: #a5f3fc;
          font: inherit;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .pg-subaction-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(165, 243, 252, 0.4);
        }
        .pg-subaction-card:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .pg-subaction-card--open {
          border-color: rgba(165, 243, 252, 0.6);
          background: rgba(165, 243, 252, 0.1);
        }
        .pg-subaction-detail {
          margin: 0 0.65rem 0.65rem;
          padding: 0.85rem 1rem;
          border-radius: 0.65rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(165, 243, 252, 0.2);
        }
        .pg-subaction-detail-text {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.7;
          color: rgba(165, 243, 252, 0.95);
          white-space: pre-line;
        }
        .pg-subaction-detail-btn {
          display: block;
          text-align: center;
          padding: 0.65rem;
          border-radius: 0.55rem;
          background: #f5d600;
          color: #3a1d1d;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
        }
        .pg-subaction-detail-btn:hover {
          background: #ecc900;
        }
        .pg-company-section {
          padding: 0 0.65rem 0.65rem;
          border-top: 2px solid rgba(165, 243, 252, 0.2);
          margin-top: 0.5rem;
          padding-top: 0.75rem;
        }
        .pg-company-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          width: 100%;
        }
        .pg-company-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.2rem 0.25rem;
          border-radius: 0.65rem;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.22);
          color: #ecfeff;
          font: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .pg-company-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(165, 243, 252, 0.35);
        }
        .pg-company-card--open {
          background: rgba(4, 120, 87, 0.35);
          border-color: rgba(110, 231, 183, 0.8);
        }
        .pg-company-icon {
          font-size: clamp(2rem, 7vw, 2.8rem);
          line-height: 1;
        }
        .pg-company-label {
          font-size: clamp(0.72rem, 2.2vw, 0.88rem);
          font-weight: 700;
          text-align: center;
          line-height: 1.35;
          word-break: keep-all;
          width: 100%;
        }
        .pg-company-detail {
          margin-top: 0.6rem;
          padding: 0.85rem 1rem;
          border-radius: 0.65rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(165, 243, 252, 0.25);
        }
        .pg-company-detail-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
        }
        .pg-company-detail-icon {
          font-size: 1.4rem;
          line-height: 1;
        }
        .pg-company-detail-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ecfeff;
        }
        .pg-company-desc {
          margin: 0 0 0.5rem;
          font-size: 0.8rem;
          line-height: 1.7;
          color: rgba(165, 243, 252, 0.95);
          white-space: pre-line;
        }
        .pg-company-recommend {
          margin: 0 0 0.65rem;
          font-size: 0.78rem;
          color: #fef9c3;
          font-weight: 600;
        }
        .pg-company-btn-row {
          display: flex;
          gap: 0.5rem;
          width: 100%;
        }
        .pg-company-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0.85rem 0.5rem;
          border-radius: 0.55rem;
          font-size: clamp(0.85rem, 2.5vw, 1rem);
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s ease;
          flex: 1;
          width: 100%;
          box-sizing: border-box;
        }
        .pg-company-btn--kakao {
          background: #e5c800;
          color: #3a1d1d;
        }
        .pg-company-btn--kakao:hover {
          background: #d4b800;
        }
        .pg-company-btn--reserve {
          background: rgba(56, 189, 248, 0.25);
          border: 1.5px solid rgba(56, 189, 248, 0.5);
          color: #e0f2fe;
        }
        .pg-company-btn--reserve:hover {
          background: rgba(56, 189, 248, 0.38);
          border-color: rgba(56, 189, 248, 0.7);
        }
        .pg-subaction-icon {
          font-size: clamp(1.9rem, 6vw, 2.6rem);
          line-height: 1;
        }
        .pg-subaction-label {
          font-size: clamp(0.72rem, 2.2vw, 0.88rem);
          font-weight: 600;
          text-align: center;
          line-height: 1.35;
          white-space: pre-line;
          word-break: keep-all;
          width: 100%;
        }
        .pg-action-buttons {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem 0.65rem 0.4rem;
        }
        .pg-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.8rem 0.5rem;
          border-radius: 0.6rem;
          font-size: 0.92rem;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .pg-action-btn--detail {
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          color: #ecfeff;
        }
        .pg-action-btn--detail:hover {
          background: rgba(255, 255, 255, 0.18);
        }
        .pg-action-btn--kakao {
          background: #f5d600;
          border: 1.5px solid #f5d600;
          color: #3a1d1d;
        }
        .pg-action-btn--kakao:hover {
          background: #ecc900;
          border-color: #ecc900;
        }
        .pg-action-btn--reserve {
          background: rgba(13, 148, 136, 0.35);
          border: 1.5px solid rgba(45, 212, 191, 0.6);
          color: #ccfbf1;
        }
        .pg-action-btn--reserve:hover {
          background: rgba(13, 148, 136, 0.55);
          border-color: rgba(45, 212, 191, 0.85);
        }
        .pg-faq-header {
          padding: 0.65rem 0.65rem 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #a5f3fc;
          border-top: 2px solid rgba(165, 243, 252, 0.25);
          margin-top: 0.5rem;
        }
        .pg-faq-item {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .pg-faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          text-align: left;
          padding: 0.55rem 0.65rem;
          border: none;
          background: transparent;
          color: #ecfeff;
          font-size: 0.82rem;
          font-weight: 600;
          line-height: 1.45;
          cursor: pointer;
        }
        .pg-faq-question:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .pg-faq-answer {
          margin: 0;
          padding: 0 0.65rem 0.65rem;
          font-size: 0.8rem;
          line-height: 1.6;
          color: rgba(165, 243, 252, 0.95);
        }
        .pg-item-actions {
          margin: 0;
          padding: 0 0.65rem 0.65rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        .pg-item-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: #a5f3fc;
          text-decoration: underline;
          text-underline-offset: 0.15em;
        }
        .pg-item-link:hover {
          color: #ecfeff;
        }
        .pg-place-info {
          padding: 0 0.65rem 0.65rem;
        }
        .pg-place-info-loading,
        .pg-place-info-error {
          margin: 0 0 0.5rem;
          font-size: 0.8rem;
        }
        .pg-place-info-rating {
          margin: 0 0 0.35rem;
          font-size: 0.82rem;
          color: #fef9c3;
          font-weight: 600;
        }
        .pg-place-info-reviews {
          font-weight: 500;
          color: rgba(165, 243, 252, 0.9);
        }
        .pg-place-info-address {
          margin: 0 0 0.45rem;
          font-size: 0.8rem;
          line-height: 1.5;
          color: rgba(165, 243, 252, 0.95);
        }
        .pg-place-info-hours {
          margin: 0 0 0.5rem;
          padding-left: 1.1rem;
          font-size: 0.78rem;
          line-height: 1.45;
          color: rgba(165, 243, 252, 0.88);
        }
        .pg-place-info-hours li {
          margin-bottom: 0.15rem;
        }
        .pg-place-info .pg-item-actions {
          padding-left: 0;
          padding-bottom: 0;
        }
        .pg-cluster-map {
          margin-bottom: 0.85rem;
        }
        .pg-cluster-map-caption {
          font-size: 0.78rem;
          line-height: 1.45;
          margin: 0 0 0.5rem;
          color: var(--text-muted);
        }
        .pg-map-unified {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .pg-map-unified .pg-cluster-map-inner {
          flex-shrink: 0;
        }
        .pg-cluster-map-inner {
          width: 100%;
          height: min(42vmin, 16rem);
          min-height: 12.5rem;
          border-radius: 0.55rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          z-index: 0;
        }
        .pg-map-place-panel {
          padding: 0.65rem 0.75rem;
          border-radius: 0.55rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.22);
        }
        .pg-map-place-panel-title {
          display: block;
          font-size: 0.88rem;
          color: #ecfeff;
          margin-bottom: 0.35rem;
        }
        .pg-map-place-panel-desc {
          margin: 0 0 0.5rem;
          font-size: 0.8rem;
          line-height: 1.45;
          color: rgba(165, 243, 252, 0.95);
        }
        .pg-map-place-panel-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: #a5f3fc;
          text-decoration: underline;
          text-underline-offset: 0.15em;
        }
        .pg-map-place-panel-link:hover {
          color: #ecfeff;
        }
        .pg-cluster-popup-title {
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.35rem;
          color: #0f172a;
        }
        .pg-cluster-popup-desc {
          margin: 0 0 0.5rem;
          font-size: 0.78rem;
          line-height: 1.45;
          color: #334155;
        }
        .pg-cluster-popup-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: #0369a1;
        }
        .pg-cluster-popup-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
