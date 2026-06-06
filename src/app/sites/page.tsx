import { getSites } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import SitesClient from "@/components/sites-client";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function SitesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const search = params.search ?? "";

  const [{ data, count, error }, admin] = await Promise.all([
    getSites({ page, search }),
    isAdmin(),
  ]);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Sites</h1>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-dim)" }}>{count} sites</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Useful platforms, communities, and resources.</p>
        {error && <p style={{ marginTop: 8, fontSize: 12, color: "var(--red)", padding: "8px 12px", background: "var(--red-dim)", borderRadius: "var(--radius)" }}>Error: {error}</p>}
      </div>
      <SitesClient sites={data} count={count} currentPage={page} searchQuery={search} isAdmin={admin} />
    </div>
  );
}
