"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

export default function Pagination({ currentPage, totalCount, pageSize }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  function goTo(page: number) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", String(page));
    router.push(`${pathname}?${p.toString()}`);
  }

  // Build page window
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-dim)" }}>
        {start}–{end} of {totalCount}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => goTo(currentPage - 1)} disabled={!hasPrev}>← Prev</button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} style={{ padding: "0 4px", color: "var(--text-dim)", fontSize: 12 }}>…</span>
          ) : (
            <button
              key={p}
              className="btn btn-ghost btn-sm"
              onClick={() => goTo(p as number)}
              style={p === currentPage ? { background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.3)" } : {}}
            >
              {p}
            </button>
          )
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => goTo(currentPage + 1)} disabled={!hasNext}>Next →</button>
      </div>
    </div>
  );
}
