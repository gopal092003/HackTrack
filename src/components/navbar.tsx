import Link from "next/link";
import { getUser } from "@/lib/auth";
import LogoutButton from "./logout-button";

export default async function Navbar() {
  const user = await getUser();

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,15,25,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 16px",
          height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, fontWeight: 700, color: "var(--accent)",
              background: "var(--accent-dim)", border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 5, padding: "3px 7px",
            }}>{"</>"}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
              HackTrack
            </span>
          </Link>

          {/* Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <NavLink href="/">Dashboard</NavLink>
            <NavLink href="/hackathons">Hackathons</NavLink>
            <NavLink href="/participation-history">History</NavLink>
            <NavLink href="/sites">Sites</NavLink>

            <div style={{ width: 1, height: 18, background: "var(--border)", margin: "0 10px" }} />

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: "var(--green)", fontWeight: 600,
                  background: "var(--green-dim)", border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 4, padding: "3px 8px",
                }}>Admin</span>
                <LogoutButton />
              </div>
            ) : (
              <Link href="/login" className="btn btn-secondary btn-sm">Login</Link>
            )}
          </div>
        </div>
      </nav>
      <style>{`
        .nav-link { padding: 5px 10px; border-radius: var(--radius); font-size: 13px; color: var(--text-muted); transition: color 0.15s, background 0.15s; }
        .nav-link:hover { color: var(--text); background: var(--bg-elevated); }
      `}</style>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="nav-link">{children}</Link>;
}
