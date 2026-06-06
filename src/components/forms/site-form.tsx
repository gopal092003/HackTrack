"use client";
import { useState } from "react";
import { Site, SiteFormData } from "@/lib/types";
import { validateSite, ValidationError } from "@/lib/validations";

interface Props { site?: Site; onClose: () => void; onSuccess: () => void; }

export default function SiteForm({ site, onClose, onSuccess }: Props) {
  const isEdit = !!site;
  const [form, setForm] = useState<SiteFormData>({ name: site?.name ?? "", url: site?.url ?? "" });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const err = (f: string) => errors.find(e => e.field === f)?.message;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ve = validateSite(form);
    if (ve.length > 0) { setErrors(ve); return; }
    setSubmitting(true); setServerError(null);
    try {
      const url = isEdit ? `/api/sites/${site!.id}` : "/api/sites";
      const res = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), url: form.url.trim() }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      onSuccess();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>{isEdit ? "Edit Site" : "Add Site"}</h2>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: "4px 8px", fontSize: 16 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="label">Name *</label>
              <input className="input" value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => p.filter(x => x.field !== "name")); }} placeholder="e.g. Devpost" />
              {err("name") && <p className="error-text">{err("name")}</p>}
            </div>
            <div>
              <label className="label">URL *</label>
              <input className="input" value={form.url} onChange={e => { setForm(p => ({ ...p, url: e.target.value })); setErrors(p => p.filter(x => x.field !== "url")); }} placeholder="https://devpost.com" />
              {err("url") && <p className="error-text">{err("url")}</p>}
            </div>
            {serverError && <p className="error-text" style={{ padding: "8px 12px", background: "var(--red-dim)", borderRadius: "var(--radius)" }}>{serverError}</p>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Site"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
