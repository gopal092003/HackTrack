"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HackathonView } from "@/lib/types";
import AchievementCard from "@/components/ui/achievement-card";
import HistoryCard from "@/components/ui/history-card";
import HackathonForm from "@/components/forms/hackathon-form";
import DeleteConfirm from "@/components/ui/delete-confirm";
import Pagination from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/lib/types";

interface Props {
  topAchievements: HackathonView[];
  history: HackathonView[];
  historyCount: number;
  currentPage: number;
  searchQuery: string;
  isAdmin: boolean;
}

export default function HistoryClient({ topAchievements, history, historyCount, currentPage, searchQuery, isAdmin }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(searchQuery);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editItem, setEditItem] = useState<HackathonView | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HackathonView | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleSearch(val: string) {
    setSearch(val);
    const p = new URLSearchParams(searchParams.toString());
    if (val.trim()) { p.set("search", val); p.set("page", "1"); }
    else { p.delete("search"); }
    startTransition(() => router.push(`${pathname}?${p.toString()}`));
  }

  function toggleSelect(id: string) {
    setSelected(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function selectAll() {
    setSelected(s => s.size === history.length ? new Set() : new Set(history.map(h => h.id)));
  }

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

  async function handleBulkDelete() {
    setDeleting(true); setDeleteError(null);
    try {
      const res = await fetch("/api/hackathons/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      setSelected(new Set()); setBulkDeleteOpen(false); router.refresh();
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
    } finally { setDeleting(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

      {/* ── Top achievements ── */}
      {topAchievements.length > 0 && (
        <section>
          <SectionTitle label="Recent Achievements" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {topAchievements.map(h => (
              <AchievementCard key={h.id} hackathon={h} isAdmin={isAdmin} onEdit={() => setEditItem(h)} onDelete={() => setDeleteTarget(h)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Search & controls ── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <SectionTitle label={`History`} count={historyCount} noLine />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, maxWidth: 400 }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="search-input"
                placeholder="Search title, project, learning…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bulk controls */}
        {isAdmin && history.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <input type="checkbox" checked={selected.size === history.length && history.length > 0} onChange={selectAll} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.size > 0 ? `${selected.size} selected` : "Select all"}</span>
            {selected.size > 0 && (
              <button className="btn btn-danger btn-sm" onClick={() => setBulkDeleteOpen(true)}>
                Delete {selected.size}
              </button>
            )}
          </div>
        )}

        {history.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--text-dim)", fontSize: 13, border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
            {searchQuery ? "No results found." : "No completed hackathons yet."}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {history.map(h => (
              <HistoryCard
                key={h.id}
                hackathon={h}
                isAdmin={isAdmin}
                selected={selected.has(h.id)}
                onSelect={toggleSelect}
                onEdit={() => setEditItem(h)}
                onDelete={() => setDeleteTarget(h)}
              />
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalCount={historyCount} pageSize={PAGE_SIZE} />
      </section>

      {/* Modals */}
      {editItem && (
        <HackathonForm hackathon={editItem} onClose={() => setEditItem(null)} onSuccess={() => { setEditItem(null); router.refresh(); }} />
      )}
      {deleteTarget && (
        <DeleteConfirm title="Delete Hackathon" itemName={deleteTarget.title} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} error={deleteError} />
      )}
      {bulkDeleteOpen && (
        <DeleteConfirm
          title={`Delete ${selected.size} Hackathon${selected.size !== 1 ? "s" : ""}`}
          itemName={`${selected.size} selected item${selected.size !== 1 ? "s" : ""}`}
          onConfirm={handleBulkDelete}
          onCancel={() => setBulkDeleteOpen(false)}
          loading={deleting}
          error={deleteError}
        />
      )}
    </div>
  );
}

function SectionTitle({ label, count, noLine }: { label: string; count?: number; noLine?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: noLine ? 0 : 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
        {label}
      </h2>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>{count}</span>
      )}
      {!noLine && <div style={{ flex: 1, height: 1, background: "var(--border)" }} />}
    </div>
  );
}
