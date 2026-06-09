const useCases = [
  {
    title: "Tech Conferences",
    description:
      "Skip the printed badge line. Attendees walk past a webcam and instantly check in to talks, breakouts, and after-parties.",
    stat: "1,000+ attendees",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 18v2M16 18v2" />
      </svg>
    ),
  },
  {
    title: "Coworking & Membership",
    description:
      "Members register once, then walk through the door any day. No keycards to lose, no apps to install, no front desk friction.",
    stat: "Always-on access",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 4l9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    title: "Private Events",
    description:
      "Weddings, galas, exclusive launches. Pre-register the guest list from a photo album, then verify identities discreetly at arrival.",
    stat: "Invite-only verified",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 6.4L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.6-.6L12 2z" />
      </svg>
    ),
  },
  {
    title: "Universities & Campuses",
    description:
      "Run attendance for lectures, exams, or facility access. Bulk-upload class rosters and check students in with a single webcam.",
    stat: "Roster-scale",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7l10-4 10 4-10 4-10-4z" />
        <path d="M6 9v5c0 2 3 4 6 4s6-2 6-4V9" />
        <path d="M22 7v6" />
      </svg>
    ),
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-24 px-7">
      <div className="max-w-[1160px] mx-auto">
        <div className="text-center mb-[60px]">
          <span className="section-label reveal">Use Cases</span>
          <h2 className="reveal text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.1]" data-d="1">
            Anywhere a face is
            <br />
            <span className="text-[var(--accent)]">the credential.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {useCases.map((u, i) => (
            <div
              key={u.title}
              className="reveal group relative overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-7 transition-all hover:border-[var(--border-hi)] hover:-translate-y-1"
              data-d={(((i % 4) + 1).toString()) as "1" | "2" | "3" | "4"}
            >
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-2xl pointer-events-none transition-opacity group-hover:opacity-50"
                style={{ background: "radial-gradient(circle, var(--accent-glow), transparent 70%)" }}
              />

              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="w-12 h-12 rounded-[10px] bg-[var(--accent-dim)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <div className="w-6 h-6">{u.icon}</div>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] mt-2">
                  {u.stat}
                </span>
              </div>

              <h3 className="text-[18px] font-bold mb-2 text-[var(--text)] relative z-10">{u.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-[1.65] relative z-10">
                {u.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
