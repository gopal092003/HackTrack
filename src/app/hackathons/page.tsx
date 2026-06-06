import { getActiveHackathons } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import HackathonsClient from "@/components/hackathons-client";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function HackathonsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [{ data, count, error }, admin] = await Promise.all([
    getActiveHackathons({ page }),
    isAdmin(),
  ]);

  return (
    <div>
      <PageHeader count={count} error={error} />
      <HackathonsClient hackathons={data} count={count} currentPage={page} isAdmin={admin} />
    </div>
  );
}

function PageHeader({ count, error }: { count: number; error: string | null }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Hackathons</h1>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-dim)" }}>
          {count} active
        </span>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Live and upcoming hackathons.</p>
      {error && <p style={{ marginTop: 8, fontSize: 12, color: "var(--red)", padding: "8px 12px", background: "var(--red-dim)", borderRadius: "var(--radius)" }}>Error: {error}</p>}
    </div>
  );
}
