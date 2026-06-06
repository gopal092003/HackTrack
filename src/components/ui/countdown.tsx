"use client";
import { useState, useEffect } from "react";

interface CountdownProps {
  startTime: string;
  endTime: string;
  status: "Live" | "Upcoming" | "Completed";
}

function formatDiff(ms: number): string {
  const abs = Math.abs(ms);
  const d = Math.floor(abs / 86400000);
  const h = Math.floor((abs % 86400000) / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function Countdown({ startTime, endTime, status }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (status === "Completed") {
    return <span className="countdown" style={{ color: "var(--text-dim)" }}>Ended</span>;
  }

  if (status === "Upcoming") {
    const diff = new Date(startTime).getTime() - now;
    return (
      <span className="countdown" style={{ color: "var(--blue)" }}>
        T‑{formatDiff(diff)}
      </span>
    );
  }

  // Live
  const diff = new Date(endTime).getTime() - now;
  return (
    <span className="countdown" style={{ color: "var(--green)" }}>
      T+{formatDiff(now - new Date(startTime).getTime())} · {formatDiff(diff)} left
    </span>
  );
}
