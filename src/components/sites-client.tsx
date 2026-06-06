"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Site } from "@/lib/types";
import SiteForm from "@/components/forms/site-form";
import DeleteConfirm from "@/components/ui/delete-confirm";
import Pagination from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/lib/types";

interface Props {
  sites: Site[];
  count: number;
  currentPage: number;
  searchQuery: string;
  isAdmin: boolean;
}

export default function SitesClient({ sites, count, currentPage, searchQuery, isAdmin }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(searchQuery);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Site | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
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
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true); setDeleteError(null);
    try {
      const res = await fetch(`/api/sites/${deleteTarget.id}`, { method: "DELETE" });
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
      const res = await fetch("/api/sites/bulk-delete", {
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div className="search-wrap" style={{ flex: 1, maxWidth: 360 }}>
          <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="search-input" placeholder="Search sites…" value={search} onChange={e => handleSearch(e.target.value)} />
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Site</button>
        )}
      </div>

      {/* Bulk controls */}
      {isAdmin && sites.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox"
            checked={selected.size === sites.length && sites.length > 0}
            onChange={() => setSelected(s => s.size === sites.length ? new Set() : new Set(sites.map(s => s.id)))}
          />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.size > 0 ? `${selected.size} selected` : "Select all"}</span>
          {selected.size > 0 && (
            <button className="btn btn-danger btn-sm" onClick={() => setBulkDeleteOpen(true)}>Delete {selected.size}</button>
          )}
        </div>
      )}

      {/* Grid */}
      {sites.length === 0 ? (
        <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--text-dim)", fontSize: 13, border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
          {searchQuery ? "No sites match your search." : "No sites available."}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {sites.map(s => (
            <div key={s.id} className="card" style={{
              padding: 18, display: "flex", flexDirection: "column", gap: 10,
              border: selected.has(s.id) ? "1px solid var(--accent)" : "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isAdmin && <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} />}
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</span>
                </div>
                {isAdmin && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditItem(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(s)}>Del</button>
                  </div>
                )}
              </div>
              <a href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: "var(--text-muted)", wordBreak: "break-all" }}>
                {s.url}
              </a>
              <div style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                Added: {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
                Visit Site ↗
              </a>
            </div>
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalCount={count} pageSize={PAGE_SIZE} />

      {showAdd && <SiteForm onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); router.refresh(); }} />}
      {editItem && <SiteForm site={editItem} onClose={() => setEditItem(null)} onSuccess={() => { setEditItem(null); router.refresh(); }} />}
      {deleteTarget && (
        <DeleteConfirm title="Delete Site" itemName={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} error={deleteError} />
      )}
      {bulkDeleteOpen && (
        <DeleteConfirm
          title={`Delete ${selected.size} Site${selected.size !== 1 ? "s" : ""}`}
          itemName={`${selected.size} selected site${selected.size !== 1 ? "s" : ""}`}
          onConfirm={handleBulkDelete}
          onCancel={() => setBulkDeleteOpen(false)}
          loading={deleting}
          error={deleteError}
        />
      )}
    </div>
  );
}
