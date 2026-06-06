import { getPastHackathons, getRecentAchievements } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import HistoryClient from "@/components/history-client";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function ParticipationHistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const search = params.search ?? "";

  const [{ data: history, count }, topAchievements, admin] = await Promise.all([
    getPastHackathons({ page, search }),
    getRecentAchievements(3),
    isAdmin(),
  ]);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Participation History</h1>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-dim)" }}>{count} hackathons</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>All completed hackathons, achievements, and learnings.</p>
      </div>
      <HistoryClient
        topAchievements={topAchievements}
        history={history}
        historyCount={count}
        currentPage={page}
        searchQuery={search}
        isAdmin={admin}
      />
    </div>
  );
}
