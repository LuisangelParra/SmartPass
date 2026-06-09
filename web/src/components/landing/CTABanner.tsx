import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-24 px-7">
      <div className="max-w-[1160px] mx-auto">
        <div className="reveal relative overflow-hidden rounded-[20px] border border-[var(--border-hi)] bg-[var(--surface)] px-8 md:px-16 py-16 md:py-20 text-center">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,229,200,0.15) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              maskImage:
                "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
            style={{
              background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)",
              opacity: 0.4,
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="hero-badge mb-6 inline-flex">
              <span className="pulse-dot" />
              Production-Ready
            </span>

            <h2 className="text-[clamp(34px,5vw,56px)] font-extrabold tracking-[-2px] leading-[1.05] mb-5">
              Ship biometric check-in
              <br />
              <span className="text-[var(--accent)]">in an afternoon.</span>
            </h2>

            <p className="text-[var(--text-muted)] text-[16px] leading-[1.7] mb-8 max-w-md mx-auto">
              Open source. Self-hostable. Deploy the backend to Railway,
              the frontend to Vercel. Get started in one click.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-all hover:-translate-y-px"
                style={{ background: "var(--accent)", color: "#080B0F" }}
              >
                Launch Dashboard →
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border border-[var(--border-hi)] text-[var(--text)] hover:bg-[var(--accent-dim)] transition-all hover:-translate-y-px"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
