import { HackathonView } from "@/lib/types";

interface Props {
  hackathon: HackathonView;
  isAdmin?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function HistoryCard({ hackathon: h, isAdmin, selected, onSelect, onEdit, onDelete }: Props) {
  return (
    <div className="card" style={{
      padding: 18, display: "flex", flexDirection: "column", gap: 10,
      border: selected ? "1px solid var(--accent)" : "1px solid var(--border)",
      transition: "border-color 0.15s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {isAdmin && onSelect && (
            <input type="checkbox" checked={!!selected} onChange={() => onSelect(h.id)} style={{ marginTop: 3, flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{h.title}</div>
            {h.achievement && (
              <div style={{ fontSize: 12, color: "var(--amber)", display: "flex", alignItems: "center", gap: 5 }}>
                <span>🏆</span> {h.achievement}
              </div>
            )}
          </div>
        </div>
        {isAdmin && (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={onDelete}>Del</button>
          </div>
        )}
      </div>

      {h.project_name && (
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          <span style={{ color: "var(--text-dim)" }}>Project: </span>
          <span style={{ fontWeight: 500 }}>{h.project_name}</span>
        </div>
      )}

      {h.learning && (
        <div style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-muted)", borderLeft: "2px solid var(--border)", paddingLeft: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", color: "var(--text-dim)", marginBottom: 3 }}>Learning</div>
          {h.learning}
        </div>
      )}

      {h.tags && h.tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {h.tags.map(t => <span key={t} className="tag">#{t}</span>)}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
          Ended: {fmt(h.end_time)}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <a href={h.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Visit ↗</a>
          {h.github_repo && (
            <a href={h.github_repo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">GitHub ↗</a>
          )}
        </div>
      </div>
    </div>
  );
}
