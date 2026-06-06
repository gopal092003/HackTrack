import { getAllHackathons, getRecentAchievements, getPastHackathons } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import DashboardClient from "@/components/dashboard-client";
import { PAGE_SIZE } from "@/lib/types";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const achievementPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const [allHackathons, admin] = await Promise.all([
    getAllHackathons(),
    isAdmin(),
  ]);

  // Achievements — paginated subset of completed with achievement set
  const achievementsWithAchievement = allHackathons.filter(
    h => h.status === "Completed" && h.achievement
  ).sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime());

  const achievementCount = achievementsWithAchievement.length;
  const start = (achievementPage - 1) * PAGE_SIZE;
  const achievements = achievementsWithAchievement.slice(start, start + PAGE_SIZE);

  // Recent projects: all completed, sorted by end_time desc, project_name first
  const recentProjects = allHackathons
    .filter(h => h.status === "Completed")
    .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
    .slice(0, 10);

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: "1px solid var(--border)" }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)", marginBottom: 12 }}>
            HackTrack
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 10 }}>
            Track hackathons.<br />
            <span style={{ color: "var(--text-muted)" }}>Manage projects.</span><br />
            <span style={{ color: "var(--text-dim)" }}>Document learnings.</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Stat label="Total" value={allHackathons.length} />
          <Stat label="Live" value={allHackathons.filter(h => h.status === "Live").length} color="var(--green)" />
          <Stat label="Upcoming" value={allHackathons.filter(h => h.status === "Upcoming").length} color="var(--blue)" />
          <Stat label="Completed" value={allHackathons.filter(h => h.status === "Completed").length} color="var(--text-dim)" />
          <Stat label="Achievements" value={achievementCount} color="var(--amber)" />
        </div>
      </div>

      <DashboardClient
        allHackathons={allHackathons}
        achievements={achievements}
        achievementCount={achievementCount}
        achievementPage={achievementPage}
        recentProjects={recentProjects}
        isAdmin={admin}
      />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: color ?? "var(--text)" }}>{value}</span>
      <span style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
    </div>
  );
}
