"use client";
import { useState } from "react";
import { HackathonView, HackathonFormData, JournalData } from "@/lib/types";
import { validateHackathon, ValidationError } from "@/lib/validations";

interface Props {
  hackathon?: HackathonView;
  onClose: () => void;
  onSuccess: () => void;
}

function toLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseJournal(raw: string | null | undefined): Partial<JournalData> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export default function HackathonForm({ hackathon, onClose, onSuccess }: Props) {
  const isEdit = !!hackathon;
  const j = parseJournal(hackathon?.journal);

  const [form, setForm] = useState<HackathonFormData>({
    title: hackathon?.title ?? "",
    url: hackathon?.url ?? "",
    project_name: hackathon?.project_name ?? "",
    prize_display: hackathon?.prize_display ?? "",
    prize_amount: hackathon?.prize_amount != null ? String(hackathon.prize_amount) : "",
    tags: hackathon?.tags?.join(", ") ?? "",
    priority: hackathon?.priority ?? "",
    github_repo: hackathon?.github_repo ?? "",
    registration_deadline: toLocal(hackathon?.registration_deadline),
    start_time: toLocal(hackathon?.start_time),
    end_time: toLocal(hackathon?.end_time),
    achievement: hackathon?.achievement ?? "",
    learning: hackathon?.learning ?? "",
    goal: j.goal ?? "",
    approach: j.approach ?? "",
    challenges: j.challenges ?? "",
    outcome: j.outcome ?? "",
    retrospective: j.retrospective ?? "",
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"basic" | "journal">("basic");

  const err = (f: string) => errors.find(e => e.field === f)?.message;

  function set(name: keyof HackathonFormData, value: string) {
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => p.filter(e => e.field !== name));
  }

  function inp(name: keyof HackathonFormData) {
    return {
      value: form[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(name, e.target.value),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ve = validateHackathon(form);
    if (ve.length > 0) { setErrors(ve); if (ve.some(x => ["title","url","start_time","end_time"].includes(x.field))) setTab("basic"); return; }

    setSubmitting(true); setServerError(null);

    const journal: JournalData = {
      goal: form.goal.trim(),
      approach: form.approach.trim(),
      challenges: form.challenges.trim(),
      outcome: form.outcome.trim(),
      retrospective: form.retrospective.trim(),
    };
    const hasJournal = Object.values(journal).some(Boolean);

    const payload = {
      title: form.title.trim(),
      url: form.url.trim(),
      project_name: form.project_name.trim() || null,
      prize_display: form.prize_display.trim() || null,
      prize_amount: form.prize_amount ? Number(form.prize_amount) : null,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : null,
      priority: form.priority.trim() || null,
      github_repo: form.github_repo.trim() || null,
      registration_deadline: form.registration_deadline ? new Date(form.registration_deadline).toISOString() : null,
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
      journal: hasJournal ? JSON.stringify(journal) : null,
      learning: form.learning.trim() || null,
      achievement: form.achievement.trim() || null,
    };

    try {
      const url = isEdit ? `/api/hackathons/${hackathon!.id}` : "/api/hackathons";
      const res = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      onSuccess();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>{isEdit ? "Edit Hackathon" : "Add Hackathon"}</h2>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: "4px 8px", fontSize: 16 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
          {(["basic", "journal"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="btn btn-ghost btn-sm"
              style={tab === t ? { background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.3)" } : {}}>
              {t === "basic" ? "Details" : "Journal"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === "basic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <F label="Title *" error={err("title")}><input className="input" placeholder="e.g. ETHGlobal Bangkok" {...inp("title")} /></F>
              <F label="URL *" error={err("url")}><input className="input" placeholder="https://..." {...inp("url")} /></F>
              <F label="Project Name" error={err("project_name")}><input className="input" placeholder="e.g. CodePilot" {...inp("project_name")} /></F>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Prize Display" error={err("prize_display")}><input className="input" placeholder="$10,000" {...inp("prize_display")} /></F>
                <F label="Prize Amount" error={err("prize_amount")}><input className="input" type="number" min="0" placeholder="10000" {...inp("prize_amount")} /></F>
              </div>
              <F label="Tags (comma separated)"><input className="input" placeholder="ai, web3, open-source" {...inp("tags")} /></F>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Priority"><input className="input" placeholder="High / Medium / Low" {...inp("priority")} /></F>
                <F label="GitHub Repo" error={err("github_repo")}><input className="input" placeholder="https://github.com/..." {...inp("github_repo")} /></F>
              </div>
              <F label="Registration Deadline"><input className="input" type="datetime-local" {...inp("registration_deadline")} /></F>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Start Time *" error={err("start_time")}><input className="input" type="datetime-local" {...inp("start_time")} /></F>
                <F label="End Time *" error={err("end_time")}><input className="input" type="datetime-local" {...inp("end_time")} /></F>
              </div>
              <F label="Achievement"><input className="input" placeholder="e.g. Best AI Hack, 2nd Place" {...inp("achievement")} /></F>
              <F label="Learning">
                <textarea className="input" rows={3} placeholder="Key insight from this hackathon..." style={{ resize: "vertical" }} {...inp("learning")} />
              </F>
            </div>
          )}

          {tab === "journal" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                Document your structured notes for this hackathon.
              </p>
              <F label="Goal"><textarea className="input" rows={2} placeholder="What are you trying to build?" style={{ resize: "vertical" }} {...inp("goal")} /></F>
              <F label="Approach"><textarea className="input" rows={2} placeholder="How are you approaching it?" style={{ resize: "vertical" }} {...inp("approach")} /></F>
              <F label="Challenges"><textarea className="input" rows={2} placeholder="What obstacles did you face?" style={{ resize: "vertical" }} {...inp("challenges")} /></F>
              <F label="Outcome"><textarea className="input" rows={2} placeholder="What was the result?" style={{ resize: "vertical" }} {...inp("outcome")} /></F>
              <F label="Retrospective"><textarea className="input" rows={2} placeholder="What would you do differently?" style={{ resize: "vertical" }} {...inp("retrospective")} /></F>
            </div>
          )}

          {serverError && (
            <p className="error-text" style={{ marginTop: 12, padding: "8px 12px", background: "var(--red-dim)", borderRadius: "var(--radius)" }}>
              {serverError}
            </p>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Hackathon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function F({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
