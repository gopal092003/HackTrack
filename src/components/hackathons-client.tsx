"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HackathonView } from "@/lib/types";
import Kanban from "@/components/ui/kanban";
import HackathonCard from "@/components/ui/hackathon-card";
import HackathonForm from "@/components/forms/hackathon-form";
import DeleteConfirm from "@/components/ui/delete-confirm";
import Countdown from "@/components/ui/countdown";
import Pagination from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/lib/types";

interface Props {
  hackathons: HackathonView[];
  count: number;
  currentPage: number;
  isAdmin: boolean;
}

type ViewMode = "cards" | "table";

export default function HackathonsClient({ hackathons, count, currentPage, isAdmin }: Props) {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("cards");
  const [editItem, setEditItem] = useState<HackathonView | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HackathonView | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Persist view preference in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("hacktrack-view");
    if (stored === "table" || stored === "cards") setView(stored);
  }, []);
  function setViewMode(m: ViewMode) {
    setView(m);
    localStorage.setItem("hacktrack-view", m);
  }

  const live = hackathons.filter(h => h.status === "Live").sort((a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime());
  const upcoming = hackathons.filter(h => h.status === "Upcoming").sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true); setDeleteError(null);
    try {
      const res = await fetch(`/api/hackathons/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      setDeleteTarget(null); router.refresh();
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
    } finally { setDeleting(false); }
  }

  function fmt(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

      {/* ── Kanban ── */}
      <section>
        <SectionTitle label="Board" />
        <Kanban hackathons={hackathons} isAdmin={isAdmin} onEdit={h => setEditItem(h)} />
      </section>

      {/* ── Controls ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        {/* View toggle */}
        <div style={{ display: "flex", gap: 2, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 3 }}>
          {(["cards", "table"] as const).map(m => (
            <button key={m} className="btn btn-ghost btn-sm" onClick={() => setViewMode(m)}
              style={view === m ? { background: "var(--accent-dim)", color: "var(--accent)" } : {}}>
              {m === "cards" ? "⊞ Cards" : "≡ Table"}
            </button>
          ))}
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Hackathon</button>
        )}
      </div>

      {/* ── Live section ── */}
      {live.length > 0 && (
        <section>
          <SectionTitle label="Live" count={live.length} color="var(--green)" />
          {view === "cards" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {live.map(h => <HackathonCard key={h.id} hackathon={h} isAdmin={isAdmin} onEdit={() => setEditItem(h)} onDelete={() => setDeleteTarget(h)} />)}
            </div>
          ) : (
            <HackathonTable hackathons={live} isAdmin={isAdmin} onEdit={setEditItem} onDelete={setDeleteTarget} fmt={fmt} />
          )}
        </section>
      )}

      {/* ── Upcoming section ── */}
      {upcoming.length > 0 && (
        <section>
          <SectionTitle label="Upcoming" count={upcoming.length} color="var(--blue)" />
          {view === "cards" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {upcoming.map(h => <HackathonCard key={h.id} hackathon={h} isAdmin={isAdmin} onEdit={() => setEditItem(h)} onDelete={() => setDeleteTarget(h)} />)}
            </div>
          ) : (
            <HackathonTable hackathons={upcoming} isAdmin={isAdmin} onEdit={setEditItem} onDelete={setDeleteTarget} fmt={fmt} />
          )}
        </section>
      )}

      {live.length === 0 && upcoming.length === 0 && (
        <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-dim)", fontSize: 13, border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
          No active hackathons found.
        </div>
      )}

      <Pagination currentPage={currentPage} totalCount={count} pageSize={PAGE_SIZE} />

      {/* Modals */}
      {showAdd && (
        <HackathonForm onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); router.refresh(); }} />
      )}
      {editItem && (
        <HackathonForm hackathon={editItem} onClose={() => setEditItem(null)} onSuccess={() => { setEditItem(null); router.refresh(); }} />
      )}
      {deleteTarget && (
        <DeleteConfirm title="Delete Hackathon" itemName={deleteTarget.title} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} error={deleteError} />
      )}
    </div>
  );
}

function HackathonTable({ hackathons, isAdmin, onEdit, onDelete, fmt }: {
  hackathons: HackathonView[];
  isAdmin: boolean;
  onEdit: (h: HackathonView) => void;
  onDelete: (h: HackathonView) => void;
  fmt: (s: string) => string;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Title</th>
            <th>Project</th>
            <th>Prize</th>
            <th>End</th>
            <th>Countdown</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {hackathons.map(h => (
            <tr key={h.id}>
              <td>
                <span className={h.status === "Live" ? "badge badge-live" : "badge badge-upcoming"}>
                  {h.status === "Live" && <span className="dot dot-live" style={{ marginRight: 3 }} />}
                  {h.status}
                </span>
              </td>
              <td>
                <a href={h.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>{h.title}</a>
              </td>
              <td style={{ color: "var(--text-muted)" }}>{h.project_name ?? "—"}</td>
              <td style={{ color: "var(--green)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                {h.prize_display ?? (h.prize_amount ? `$${h.prize_amount.toLocaleString()}` : "—")}
              </td>
              <td style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(h.end_time)}</td>
              <td><Countdown startTime={h.start_time} endTime={h.end_time} status={h.status} /></td>
              {isAdmin && (
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => onEdit(h)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(h)}>Del</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ label, count, color }: { label: string; count?: number; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", color: color ?? "var(--text-muted)" }}>
        {label}
      </h2>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>{count}</span>
      )}
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}
