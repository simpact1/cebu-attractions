import {
  MASSAGE_QUALITY_OPTIONS,
  MASSAGE_RECOMMEND_OPTIONS,
  MASSAGE_ZONE_OPTIONS,
  type MassageFilterState,
} from "./massageFilters";

type MassageFilterBarProps = {
  filters: MassageFilterState;
  onChange: (filters: MassageFilterState) => void;
};

export function MassageFilterBar({ filters, onChange }: MassageFilterBarProps) {
  return (
    <div className="mf-wrap" aria-label="마사지샵 필터">
      <div className="mf-section">
        <span className="mf-label">💆 퀄리티에 따른 구분</span>
        <div className="mf-chips">
          {MASSAGE_QUALITY_OPTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className={`mf-chip ${filters.quality === q ? "mf-chip--on" : "mf-chip--off"}`}
              aria-pressed={filters.quality === q}
              onClick={() => onChange({ ...filters, quality: filters.quality === q ? null : q })}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      <div className="mf-section">
        <span className="mf-label">📍 위치에 따른 구분</span>
        <div className="mf-chips">
          {MASSAGE_ZONE_OPTIONS.map((z) => (
            <button
              key={z}
              type="button"
              className={`mf-chip ${filters.zone === z ? "mf-chip--on" : "mf-chip--off"}`}
              aria-pressed={filters.zone === z}
              onClick={() => onChange({ ...filters, zone: filters.zone === z ? null : z })}
            >
              {z}
            </button>
          ))}
        </div>
      </div>
      <div className="mf-section">
        <span className="mf-label">✨ 추천에 따른 구분</span>
        <div className="mf-chips">
          {MASSAGE_RECOMMEND_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              className={`mf-chip ${filters.recommend === r ? "mf-chip--on" : "mf-chip--off"}`}
              aria-pressed={filters.recommend === r}
              onClick={() =>
                onChange({ ...filters, recommend: filters.recommend === r ? null : r })
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
