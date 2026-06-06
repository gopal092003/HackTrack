"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HackathonView } from "@/lib/types";
import Calendar from "@/components/ui/calendar";
import AchievementCard from "@/components/ui/achievement-card";
import HackathonForm from "@/components/forms/hackathon-form";
import DeleteConfirm from "@/components/ui/delete-confirm";
import Pagination from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/lib/types";

interface Props {
  allHackathons: HackathonView[];
  achievements: HackathonView[];
  achievementCount: number;
  achievementPage: number;
  recentProjects: HackathonView[];
  isAdmin: boolean;
}

export default function DashboardClient({ allHackathons, achievements, achievementCount, achievementPage, recentProjects, isAdmin }: Props) {
  const router = useRouter();
  const [editItem, setEditItem] = useState<HackathonView | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HackathonView | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true); setDeleteError(null);
    try {
      const res = await fetch(`/api/hackathons/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      setDeleteTarget(null);
      router.refresh();
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
    } finally { setDeleting(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

      {/* ── Calendar ── */}
      <section>
        <SectionTitle label="Calendar" />
        <div className="card" style={{ padding: 20 }}>
          <Calendar hackathons={allHackathons} />
        </div>
      </section>

      {/* ── Achievements ── */}
      <section>
        <SectionTitle label="Achievements" count={achievementCount} />
        {achievements.length === 0 ? (
          <Empty msg="No achievements yet." />
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {achievements.map(h => (
                <AchievementCard
                  key={h.id}
                  hackathon={h}
                  isAdmin={isAdmin}
                  onEdit={() => setEditItem(h)}
                  onDelete={() => setDeleteTarget(h)}
                />
              ))}
            </div>
            <Pagination currentPage={achievementPage} totalCount={achievementCount} pageSize={PAGE_SIZE} />
          </>
        )}
      </section>

      {/* ── Recent Projects ── */}
      <section>
        <SectionTitle label="Recent Projects" />
        {recentProjects.length === 0 ? (
          <Empty msg="No projects tracked yet." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Hackathon</th>
                  <th>Achievement</th>
                  <th>Learning</th>
                  <th>Ended</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map(h => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 600 }}>
                      {h.project_name ?? <span style={{ color: "var(--text-dim)" }}>—</span>}
                    </td>
                    <td>
                      <a href={h.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                        {h.title}
                      </a>
                    </td>
                    <td>
                      {h.achievement
                        ? <span style={{ color: "var(--amber)" }}>🏆 {h.achievement}</span>
                        : <span style={{ color: "var(--text-dim)" }}>—</span>}
                    </td>
                    <td style={{ maxWidth: 240 }}>
                      {h.learning
                        ? <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{h.learning.slice(0, 80)}{h.learning.length > 80 ? "…" : ""}</span>
                        : <span style={{ color: "var(--text-dim)" }}>—</span>}
                    </td>
                    <td style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, whiteSpace: "nowrap" }}>
                      {new Date(h.end_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modals */}
      {editItem && (
        <HackathonForm hackathon={editItem} onClose={() => setEditItem(null)} onSuccess={() => { setEditItem(null); router.refresh(); }} />
      )}
      {deleteTarget && (
        <DeleteConfirm
          title="Delete Hackathon"
          itemName={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
          error={deleteError}
        />
      )}
    </div>
  );
}

function SectionTitle({ label, count }: { label: string; count?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>
        {label}
      </h2>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>{count}</span>
      )}
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--text-dim)", fontSize: 13, border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
      {msg}
    </div>
  );
}
