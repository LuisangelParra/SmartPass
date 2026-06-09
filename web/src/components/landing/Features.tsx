const features = [
  {
    title: "Privacy by Design",
    description:
      "Photos are converted to 128-dimensional vectors on arrival and immediately discarded from memory. Raw images are never stored.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5C8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M9 14.5c0-1.657 1.343-2.5 3-2.5s3 .843 3 2.5" />
      </svg>
    ),
  },
  {
    title: "Database-Native Matching",
    description:
      "Face search runs as a single SQL query using pgvector's L2 distance operator. No Python loops. Scales with your database — add an HNSW index for large events.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5C8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
        <path d="M3 11v6c0 1.657 4.03 3 9 3s9-1.343 9-3v-6" />
        <line x1="18" y1="14" x2="22" y2="10" />
        <polyline points="20 10 22 10 22 12" />
      </svg>
    ),
  },
  {
    title: "Bulk Onboarding via ZIP",
    description:
      "Upload a ZIP archive of attendee photos. Filenames become names automatically. Hundreds of attendees registered in a single request — processed entirely in memory.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5C8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
        <rect x="3" y="17" width="18" height="4" rx="1" opacity="0.5" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-7" style={{ background: "var(--surface)" }}>
      <div className="max-w-[1160px] mx-auto">
        <div className="text-center mb-[60px]">
          <span className="section-label reveal">Core Capabilities</span>
          <h2 className="reveal text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.1]" data-d="1">
            Built for real events.
            <br />
            <span className="text-[var(--accent)]">Not demos.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-[22px]">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="reveal group p-[34px_26px_36px] rounded-[12px] border border-[var(--border)] bg-[var(--bg)] transition-all duration-200 hover:border-[var(--border-hi)] hover:-translate-y-[5px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,229,200,0.07)]"
              data-d={String(i + 1) as "1" | "2" | "3"}
            >
              <div className="w-[46px] h-[46px] bg-[var(--accent-dim)] border border-[var(--border)] rounded-[8px] flex items-center justify-center mb-5">
                <div className="w-[22px] h-[22px]">{f.icon}</div>
              </div>
              <h3 className="text-base font-bold mb-2.5 text-[var(--text)]">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-[1.65]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
