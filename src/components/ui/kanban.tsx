"use client";
import { HackathonView } from "@/lib/types";
import Countdown from "./countdown";

interface KanbanProps {
  hackathons: HackathonView[];
  isAdmin: boolean;
  onEdit?: (h: HackathonView) => void;
}

export default function Kanban({ hackathons, isAdmin, onEdit }: KanbanProps) {
  const upcoming = hackathons.filter(h => h.status === "Upcoming")
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  const live = hackathons.filter(h => h.status === "Live")
    .sort((a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime());

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <KanbanColumn
        label="Upcoming"
        count={upcoming.length}
        color="var(--blue)"
        items={upcoming}
        isAdmin={isAdmin}
        onEdit={onEdit}
        emptyMsg="No upcoming hackathons"
      />
      <KanbanColumn
        label="Live"
        count={live.length}
        color="var(--green)"
        items={live}
        isAdmin={isAdmin}
        onEdit={onEdit}
        emptyMsg="No live hackathons"
      />
    </div>
  );
}

function KanbanColumn({ label, count, color, items, isAdmin, onEdit, emptyMsg }: {
  label: string; count: number; color: string; items: HackathonView[];
  isAdmin: boolean; onEdit?: (h: HackathonView) => void; emptyMsg: string;
}) {
  return (
    <div className="kanban-col">
      <div className="kanban-col-header">
        <span style={{ color }}>{label}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: 4, padding: "1px 6px", color: "var(--text-dim)",
        }}>{count}</span>
      </div>
      {items.length === 0 ? (
        <div style={{ fontSize: 12, color: "var(--text-dim)", padding: "16px 0", textAlign: "center" }}>{emptyMsg}</div>
      ) : (
        items.map(h => <KanbanCard key={h.id} hackathon={h} isAdmin={isAdmin} onEdit={onEdit} />)
      )}
    </div>
  );
}

function KanbanCard({ hackathon: h, isAdmin, onEdit }: { hackathon: HackathonView; isAdmin: boolean; onEdit?: (h: HackathonView) => void }) {
  return (
    <div className="kanban-card">
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{h.title}</div>
      {h.project_name && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
          <span style={{ color: "var(--text-dim)" }}>Project: </span>{h.project_name}
        </div>
      )}
      <Countdown startTime={h.start_time} endTime={h.end_time} status={h.status} />
      {isAdmin && onEdit && (
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(h)} style={{ marginTop: 8, fontSize: 11 }}>Edit</button>
      )}
    </div>
  );
}
