import "server-only";
import { createClient } from "./supabase/server";
import { HackathonView, Site, QueryResult, PAGE_SIZE } from "./types";

// ─── Hackathons ────────────────────────────────────────────────────────────────

export async function getAllHackathons(): Promise<HackathonView[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hackathons_view")
    .select("*")
    .order("start_time", { ascending: true });
  return (data as HackathonView[]) ?? [];
}

export async function getActiveHackathons({
  page = 1,
}: { page?: number } = {}): Promise<QueryResult<HackathonView>> {
  const supabase = await createClient();
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("hackathons_view")
    .select("*", { count: "exact" })
    .in("status", ["Live", "Upcoming"])
    .order("end_time", { ascending: true })
    .range(start, end);

  return {
    data: (data as HackathonView[]) ?? [],
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

export async function getPastHackathons({
  page = 1,
  search = "",
}: { page?: number; search?: string } = {}): Promise<QueryResult<HackathonView>> {
  const supabase = await createClient();
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  let query = supabase
    .from("hackathons_view")
    .select("*", { count: "exact" })
    .eq("status", "Completed")
    .order("end_time", { ascending: false });

  if (search.trim()) {
    query = query.or(
      `title.ilike.%${search}%,project_name.ilike.%${search}%,achievement.ilike.%${search}%,learning.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query.range(start, end);

  return {
    data: (data as HackathonView[]) ?? [],
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

export async function getRecentAchievements(limit = 3): Promise<HackathonView[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hackathons_view")
    .select("*")
    .eq("status", "Completed")
    .not("achievement", "is", null)
    .order("end_time", { ascending: false })
    .limit(limit);
  return (data as HackathonView[]) ?? [];
}

export async function createHackathon(payload: {
  title: string;
  url: string;
  project_name?: string | null;
  prize_display?: string | null;
  prize_amount?: number | null;
  tags?: string[] | null;
  priority?: string | null;
  github_repo?: string | null;
  registration_deadline?: string | null;
  start_time: string;
  end_time: string;
  journal?: string | null;
  learning?: string | null;
  achievement?: string | null;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("hackathons").insert([payload]);
  return { error: error?.message ?? null };
}

export async function updateHackathon(
  id: string,
  payload: Partial<{
    title: string;
    url: string;
    project_name: string | null;
    prize_display: string | null;
    prize_amount: number | null;
    tags: string[] | null;
    priority: string | null;
    github_repo: string | null;
    registration_deadline: string | null;
    start_time: string;
    end_time: string;
    journal: string | null;
    learning: string | null;
    achievement: string | null;
  }>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("hackathons").update(payload).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteHackathon(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("hackathons").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function bulkDeleteHackathons(ids: string[]): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("hackathons").delete().in("id", ids);
  return { error: error?.message ?? null };
}

// ─── Sites ─────────────────────────────────────────────────────────────────────

export async function getSites({
  page = 1,
  search = "",
}: { page?: number; search?: string } = {}): Promise<QueryResult<Site>> {
  const supabase = await createClient();
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  let query = supabase
    .from("sites")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search.trim()) {
    query = query.or(`name.ilike.%${search}%,url.ilike.%${search}%`);
  }

  const { data, count, error } = await query.range(start, end);

  return {
    data: (data as Site[]) ?? [],
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

export async function createSite(payload: {
  name: string;
  url: string;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("sites").insert([payload]);
  return { error: error?.message ?? null };
}

export async function updateSite(
  id: string,
  payload: { name?: string; url?: string }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("sites").update(payload).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteSite(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("sites").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function bulkDeleteSites(ids: string[]): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("sites").delete().in("id", ids);
  return { error: error?.message ?? null };
}
