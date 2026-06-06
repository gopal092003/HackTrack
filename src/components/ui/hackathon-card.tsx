import { HackathonView, JournalData } from "@/lib/types";
import Countdown from "./countdown";

interface Props {
  hackathon: HackathonView;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function parseJournal(raw: string | null): Partial<JournalData> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HackathonCard({ hackathon: h, isAdmin, onEdit, onDelete }: Props) {
  const journal = parseJournal(h.journal);
  const hasJournal = Object.values(journal).some(Boolean);

  const badgeClass =
    h.status === "Live" ? "badge badge-live" :
    h.status === "Upcoming" ? "badge badge-upcoming" :
    "badge badge-ended";

  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      {/* Status row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className={badgeClass}>
          {h.status === "Live" && <span className="dot dot-live" style={{ marginRight: 4 }} />}
          {h.status}
        </span>
        {isAdmin && (
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={onDelete}>Del</button>
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{h.title}</div>

      {/* Project */}
      {h.project_name && (
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          <span style={{ color: "var(--text-dim)" }}>Project: </span>
          <span style={{ fontWeight: 600 }}>{h.project_name}</span>
        </div>
      )}

      {/* Prize */}
      {(h.prize_display || h.prize_amount) && (
        <div style={{ fontSize: 12, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
          {h.prize_display ?? `$${h.prize_amount?.toLocaleString()}`}
        </div>
      )}

      {/* Dates */}
      <div style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", display: "flex", flexDirection: "column", gap: 2 }}>
        {h.registration_deadline && (
          <span>Reg: {fmt(h.registration_deadline)}</span>
        )}
        <span>{fmt(h.start_time)} → {fmt(h.end_time)}</span>
      </div>

      {/* Countdown */}
      <Countdown startTime={h.start_time} endTime={h.end_time} status={h.status} />

      {/* Tags */}
      {h.tags && h.tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {h.tags.map(t => <span key={t} className="tag">#{t}</span>)}
        </div>
      )}

      {/* Achievement */}
      {h.achievement && (
        <div style={{ fontSize: 12, color: "var(--amber)", display: "flex", alignItems: "center", gap: 5 }}>
          <span>🏆</span> {h.achievement}
        </div>
      )}

      {/* Indicators */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {h.learning && (
          <span style={{ fontSize: 10, color: "var(--purple)", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 4, padding: "2px 7px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
            Learning
          </span>
        )}
        {hasJournal && (
          <span style={{ fontSize: 10, color: "var(--text-dim)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 7px", fontFamily: "'JetBrains Mono', monospace" }}>
            Journal
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto", paddingTop: 4 }}>
        <a href={h.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Visit ↗</a>
        {h.github_repo && (
          <a href={h.github_repo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">GitHub ↗</a>
        )}
      </div>
    </div>
  );
}
