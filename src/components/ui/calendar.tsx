"use client";
import { useState } from "react";
import { HackathonView } from "@/lib/types";

interface CalendarProps {
  hackathons: HackathonView[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

interface DayEvents {
  registrations: HackathonView[];
  starts: HackathonView[];
  ends: HackathonView[];
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Calendar({ hackathons }: CalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<{ day: Date; events: DayEvents } | null>(null);

  function buildEventMap(): Map<string, DayEvents> {
    const map = new Map<string, DayEvents>();
    function key(d: Date) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
    function ensure(d: Date): DayEvents {
      const k = key(d);
      if (!map.has(k)) map.set(k, { registrations: [], starts: [], ends: [] });
      return map.get(k)!;
    }
    for (const h of hackathons) {
      if (h.registration_deadline) ensure(new Date(h.registration_deadline)).registrations.push(h);
      ensure(new Date(h.start_time)).starts.push(h);
      ensure(new Date(h.end_time)).ends.push(h);
    }
    return map;
  }

  const eventMap = buildEventMap();

  // First day of month (0=Sun, using Mon-start grid)
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  // Adjust: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  function prev() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function next() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const cells: (Date | null)[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) cells.push(null);
    else cells.push(new Date(viewYear, viewMonth, dayNum));
  }

  function getDayKey(d: Date) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>
            {MONTHS[viewMonth]} <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>{viewYear}</span>
          </h3>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn btn-ghost btn-sm" onClick={prev}>←</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}>Today</button>
            <button className="btn btn-ghost btn-sm" onClick={next}>→</button>
          </div>
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", marginRight: 4 }} />Registration</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--green)", marginRight: 4 }} />Start</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--red)", marginRight: 4 }} />End</span>
        </div>
      </div>

      {/* Day headers */}
      <div className="cal-grid" style={{ marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="cal-grid">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const dk = getDayKey(date);
          const ev = eventMap.get(dk);
          const isToday = sameDay(date, today);
          const hasEv = !!ev;
          return (
            <div
              key={i}
              className={`cal-cell${isToday ? " today" : ""}${hasEv ? " has-event" : ""}`}
              onClick={() => hasEv && setSelected({ day: date, events: ev! })}
            >
              <span className={`cal-day-num${isToday ? " today" : ""}`}>{date.getDate()}</span>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {ev?.registrations.map(h => <span key={h.id + "r"} className="cal-dot" style={{ background: "var(--blue)" }} title={`Registration: ${h.title}`} />)}
                {ev?.starts.map(h => <span key={h.id + "s"} className="cal-dot" style={{ background: "var(--green)" }} title={`Starts: ${h.title}`} />)}
                {ev?.ends.map(h => <span key={h.id + "e"} className="cal-dot" style={{ background: "var(--red)" }} title={`Ends: ${h.title}`} />)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event detail modal */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                {selected.day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              <button className="btn btn-ghost" onClick={() => setSelected(null)} style={{ padding: "4px 8px" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selected.events.registrations.map(h => (
                <EventItem key={h.id + "r"} color="var(--blue)" label="Registration Deadline" hackathon={h} />
              ))}
              {selected.events.starts.map(h => (
                <EventItem key={h.id + "s"} color="var(--green)" label="Hackathon Starts" hackathon={h} />
              ))}
              {selected.events.ends.map(h => (
                <EventItem key={h.id + "e"} color="var(--red)" label="Hackathon Ends" hackathon={h} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventItem({ color, label, hackathon }: { color: string; label: string; hackathon: HackathonView }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius)", borderLeft: `3px solid ${color}` }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{label}</div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{hackathon.title}</div>
        {hackathon.project_name && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Project: {hackathon.project_name}</div>}
        <a href={hackathon.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--accent)", display: "inline-block", marginTop: 6 }}>Visit →</a>
      </div>
    </div>
  );
}
