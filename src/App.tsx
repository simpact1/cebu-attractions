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
      <style>{`
        .app {
          width: 100%;
          max-width: 52rem;
          min-width: 0;
          margin: 0 auto;
          padding: 1.25rem max(0.75rem, env(safe-area-inset-left)) 3rem
            max(0.75rem, env(safe-area-inset-right));
          padding-bottom: max(3rem, env(safe-area-inset-bottom));
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
          color: #1c1917;
          background: linear-gradient(
            165deg,
            rgba(251, 191, 36, 0.98) 0%,
            rgba(245, 158, 11, 1) 50%,
            rgba(217, 119, 6, 1) 100%
          );
          border-color: #fde68a;
        }
        .pg-tab-cebu-video {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          cursor: pointer;
          text-decoration: none;
          color: #fdf2f8;
          background: linear-gradient(
            165deg,
            rgba(244, 114, 182, 0.92) 0%,
            rgba(219, 39, 119, 0.95) 55%,
            rgba(157, 23, 77, 1) 100%
          );
          border-color: #fbcfe8;
        }
        .pg-tab-cebu-video:hover {
          filter: brightness(1.06);
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
        .pg-tab:focus-visible {
          outline: 2px solid #a5f3fc;
          outline-offset: 2px;
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
        .pg-cluster-map {
          margin-bottom: 0.85rem;
        }
        .pg-cluster-map-caption {
          font-size: 0.78rem;
          line-height: 1.45;
          margin: 0 0 0.5rem;
          color: var(--text-muted);
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
        .pg-cluster-popup-title {
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.35rem;
          color: #0f172a;
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
