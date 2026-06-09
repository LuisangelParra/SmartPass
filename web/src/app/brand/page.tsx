"use client";

import Link from "next/link";

/* ============================================================
   SmartPass Logo Concepts
   6 directions exploring focus/lock-on metaphor
   Each is rendered at 3 scales: icon (44), badge (88), wordmark
   ============================================================ */

const ACCENT = "#00E5C8";
const TEXT = "#E6EDF3";

/* ---------- CONCEPT 1: Pure Bracket Reticle ---------- */
function Concept1({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} fill="none">
      <path d="M4 14 L4 6 Q4 4 6 4 L14 4" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 4 L38 4 Q40 4 40 6 L40 14" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4 30 L4 38 Q4 40 6 40 L14 40" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 40 L38 40 Q40 40 40 38 L40 30" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="22" cy="22" r="3" fill={ACCENT} />
    </svg>
  );
}

/* ---------- CONCEPT 2: S inside brackets ---------- */
function Concept2({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} fill="none">
      <path d="M4 14 L4 6 Q4 4 6 4 L14 4" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M30 4 L38 4 Q40 4 40 6 L40 14" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M4 30 L4 38 Q4 40 6 40 L14 40" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M30 40 L38 40 Q40 40 40 38 L40 30" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <text
        x="22"
        y="29"
        textAnchor="middle"
        fontFamily="-apple-system, sans-serif"
        fontSize="22"
        fontWeight="800"
        fill={ACCENT}
        letterSpacing="-1"
      >
        S
      </text>
    </svg>
  );
}

/* ---------- CONCEPT 3: Pass Card / Boarding Pass shape ---------- */
function Concept3({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} fill="none">
      <rect x="4" y="10" width="36" height="24" rx="4" fill="#0D1117" stroke={ACCENT} strokeWidth="1.8" />
      <line x1="4" y1="18" x2="40" y2="18" stroke={ACCENT} strokeWidth="1.8" strokeDasharray="2 2" opacity="0.5" />
      <circle cx="14" cy="26" r="2.5" fill={ACCENT} />
      <rect x="21" y="22" width="14" height="2.5" rx="1" fill={ACCENT} opacity="0.6" />
      <rect x="21" y="27" width="10" height="2" rx="1" fill={ACCENT} opacity="0.3" />
    </svg>
  );
}

/* ---------- CONCEPT 4: Geometric S monogram (scan-cut) ---------- */
function Concept4({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} fill="none">
      <rect x="2" y="2" width="40" height="40" rx="10" fill="#0D1117" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
      {/* Bold geometric S — angular */}
      <path
        d="M32 12 H16 Q12 12 12 16 V18 Q12 22 16 22 H28 Q32 22 32 26 V28 Q32 32 28 32 H12"
        stroke={ACCENT}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ---------- CONCEPT 5: Crosshair / Target reticle ---------- */
function Concept5({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} fill="none">
      <circle cx="22" cy="22" r="16" stroke={ACCENT} strokeWidth="1.5" opacity="0.5" />
      <circle cx="22" cy="22" r="9" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
      <circle cx="22" cy="22" r="2.5" fill={ACCENT} />
      <line x1="22" y1="2" x2="22" y2="9" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="35" x2="22" y2="42" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="22" x2="9" y2="22" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="22" x2="42" y2="22" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- CONCEPT 6: Threshold / Gate ---------- */
function Concept6({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} fill="none">
      <rect x="2" y="2" width="40" height="40" rx="9" fill="#0D1117" stroke={ACCENT} strokeWidth="1.5" />
      {/* Two doorway pillars */}
      <rect x="10" y="10" width="6" height="24" rx="1" fill={ACCENT} opacity="0.85" />
      <rect x="28" y="10" width="6" height="24" rx="1" fill={ACCENT} opacity="0.85" />
      {/* Pass-through indicator (cyan slot in middle) */}
      <rect x="20" y="14" width="4" height="16" rx="2" fill={ACCENT} />
      {/* Top arch indicator */}
      <line x1="10" y1="8" x2="34" y2="8" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

const CONCEPTS = [
  {
    id: 1,
    name: "Bracket Reticle",
    metaphor: "Focus / Lock-on. The moment of biometric recognition. Camera viewfinder semantic.",
    why: "Strongest meaning per pixel. Reads as 'identify / capture' instantly. Brackets are signature — own a unique mark without competing with other logos. Center dot = acquired target.",
    component: Concept1,
    tag: "PRIMARY · REDUCED",
  },
  {
    id: 2,
    name: "S in Brackets",
    metaphor: "Brand letter inside the focus frame. Combines monogram with scan metaphor.",
    why: "More brand-explicit. The S anchors recall, brackets reinforce semantic. Risk: more elements at small sizes.",
    component: Concept2,
    tag: "MONOGRAM HYBRID",
  },
  {
    id: 3,
    name: "Pass Card",
    metaphor: "Literal boarding-pass / ID card with profile dot + name lines. Reads as 'access pass'.",
    why: "Most literal interpretation of 'Pass'. Familiar metaphor. Risk: less distinctive — many event/ticket apps use cards.",
    component: Concept3,
    tag: "LITERAL · PASS",
  },
  {
    id: 4,
    name: "Geometric S",
    metaphor: "Bold angular S as the entire mark. Pure monogram. Optional badge ring.",
    why: "Highest brand-letter recall. Most reductive. Risk: doesn't carry biometric meaning on its own.",
    component: Concept4,
    tag: "PURE MONOGRAM",
  },
  {
    id: 5,
    name: "Reticle / Crosshair",
    metaphor: "Target acquisition. Precision identification. Military-grade feel.",
    why: "Maximum precision/security signal. Risk: reads aggressive (weaponized) — may not suit privacy-first messaging.",
    component: Concept5,
    tag: "PRECISION",
  },
  {
    id: 6,
    name: "Threshold / Gate",
    metaphor: "Doorway with pass-through indicator. The literal act of entering.",
    why: "Direct 'check-in / pass through' metaphor. Risk: door iconography is generic; less ownable.",
    component: Concept6,
    tag: "GATEWAY",
  },
];

export default function BrandPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 110, paddingBottom: 80 }}>
      <div className="max-w-[1160px] mx-auto px-7">
        {/* Header */}
        <div className="mb-16">
          <span className="section-label">Brand System · v2 Concept Board</span>
          <h1 className="text-[clamp(36px,5vw,60px)] font-extrabold tracking-[-2px] leading-[1.05] mb-4">
            Logo Direction.
            <br />
            <span style={{ color: ACCENT }}>Six concepts.</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl text-[15px] leading-[1.7]">
            Brand strategy explores the moment of biometric recognition rather than the face itself.
            Pick the direction that feels right — the primary mark applies to nav, favicon, OG cover,
            and product surfaces.
          </p>
        </div>

        {/* Concept grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {CONCEPTS.map((c) => (
            <div
              key={c.id}
              className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--border-hi)] transition-all"
            >
              {/* Top: large preview */}
              <div
                className="flex items-center justify-center py-14 relative"
                style={{
                  background: "#0A0E13",
                  borderBottom: "1px solid var(--border)",
                  backgroundImage:
                    "radial-gradient(rgba(0,229,200,0.06) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              >
                <c.component size={120} />
              </div>

              {/* Middle: scale row */}
              <div
                className="flex items-center justify-around py-7 border-b border-[var(--border)]"
                style={{ background: "#0B0F14" }}
              >
                <div className="flex flex-col items-center gap-2">
                  <c.component size={16} />
                  <span className="font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-widest">16px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <c.component size={24} />
                  <span className="font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-widest">24px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <c.component size={44} />
                  <span className="font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-widest">44px</span>
                </div>
                <div className="flex flex-col items-center gap-2 px-2 py-2 rounded bg-white">
                  <c.component size={32} />
                  <span className="font-mono text-[9px] text-black uppercase tracking-widest">ON-WHITE</span>
                </div>
              </div>

              {/* Bottom: text */}
              <div className="p-7">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border"
                      style={{ borderColor: "var(--border)", color: "var(--accent)" }}
                    >
                      {String(c.id).padStart(2, "0")}
                    </span>
                    <h3 className="text-[17px] font-bold text-[var(--text)]">{c.name}</h3>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
                    {c.tag}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-[1.6] mb-3">
                  <span className="text-[var(--text)]">Metaphor: </span>
                  {c.metaphor}
                </p>
                <p className="text-sm text-[var(--text-muted)] leading-[1.6]">
                  <span className="text-[var(--text)]">Why: </span>
                  {c.why}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lockup row */}
        <div className="mb-16">
          <h2 className="font-mono text-[10px] uppercase tracking-[3px] text-[var(--accent)] mb-6">
            Lockup with Wordmark — All Concepts
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {CONCEPTS.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 px-6 py-5 rounded-[10px] border border-[var(--border)]"
                style={{ background: "var(--surface)" }}
              >
                <c.component size={36} />
                <div className="flex text-[22px] font-extrabold tracking-[-0.6px]">
                  <span style={{ color: TEXT }}>Smart</span>
                  <span style={{ color: ACCENT }}>Pass</span>
                </div>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-[var(--text-dim)]">
                  Concept 0{c.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended pick */}
        <div
          className="rounded-[16px] p-10 border"
          style={{
            background: "linear-gradient(135deg, rgba(0,229,200,0.06), rgba(0,229,200,0.02))",
            borderColor: "var(--border-hi)",
          }}
        >
          <div className="flex flex-wrap items-start gap-10">
            <Concept1 size={140} />
            <div className="flex-1 min-w-[260px]">
              <span className="font-mono text-[10px] uppercase tracking-[3px] text-[var(--accent)] mb-3 block">
                Recommended
              </span>
              <h3 className="text-2xl font-bold mb-4">Concept 01 — Bracket Reticle</h3>
              <p className="text-[var(--text-muted)] leading-[1.7] mb-6 max-w-xl">
                Strongest semantic load with zero literal imagery. The 4 corner brackets carry
                the biometric scan meaning purely; the center dot signals 'identity acquired'.
                Works from 16px favicon to billboard scale without losing legibility. Won&apos;t age
                like illustrated marks. Currently applied across nav, favicon, OG cover, and
                product surfaces.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold"
                style={{ background: ACCENT, color: "#080B0F" }}
              >
                See it live on the landing →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
