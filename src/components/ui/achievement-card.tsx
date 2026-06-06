import { HackathonView, JournalData } from "@/lib/types";

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

export default function AchievementCard({ hackathon: h, isAdmin, onEdit, onDelete }: Props) {
  const journal = parseJournal(h.journal);
  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Achievement badge */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🏆</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--amber)" }}>{h.achievement}</span>
        </div>
        {isAdmin && (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={onDelete}>Del</button>
          </div>
        )}
      </div>

      <div style={{ fontWeight: 600, fontSize: 14 }}>{h.title}</div>

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

      {journal.retrospective && (
        <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5, fontStyle: "italic" }}>
          "{journal.retrospective}"
        </div>
      )}

      {h.prize_display && (
        <div style={{ fontSize: 12, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
          {h.prize_display}
        </div>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
        <a href={h.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Hackathon ↗</a>
        {h.github_repo && (
          <a href={h.github_repo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">GitHub ↗</a>
        )}
      </div>

      <div style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
        {new Date(h.end_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>
    </div>
  );
}
