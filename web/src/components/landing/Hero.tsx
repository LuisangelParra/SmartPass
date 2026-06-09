import Link from "next/link";
import { FaceScanWidget } from "./FaceScanWidget";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-7 pt-[130px] pb-24 overflow-hidden">
      <div className="hero-bg" aria-hidden="true">
        <div className="dot-grid" />
        <div className="glow-orb" />
      </div>

      <div className="max-w-[1160px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text */}
        <div className="flex flex-col">
          <div className="hero-badge mb-6" style={{ animation: "slideUp 0.55s ease-out both" }}>
            <span className="pulse-dot" />
            Biometric Access Control
          </div>

          <h1
            className="text-[clamp(40px,5.5vw,70px)] font-extrabold leading-[1.04] tracking-[-2.5px] mb-6 text-[var(--text)]"
          >
            <span className="block" style={{ animation: "slideUp 0.55s 0.08s ease-out both" }}>
              Frictionless Entry.
            </span>
            <span
              className="block text-[var(--accent)]"
              style={{ animation: "slideUp 0.55s 0.16s ease-out both" }}
            >
              Zero Tickets.
            </span>
          </h1>

          <p
            className="text-[17px] text-[var(--text-muted)] max-w-[430px] leading-[1.72] mb-9"
            style={{ animation: "slideUp 0.55s 0.24s ease-out both" }}
          >
            Biometric event check-in powered by facial recognition. Register attendees
            once, verify faces at the door — no app, no QR code, no wait.
          </p>

          <div
            className="flex flex-wrap gap-3.5"
            style={{ animation: "slideUp 0.55s 0.32s ease-out both" }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold transition-all hover:-translate-y-px"
              style={{
                background: "var(--accent)",
                color: "#080B0F",
                boxShadow: "0 0 0 transparent",
              }}
              onMouseEnter={undefined}
            >
              Launch Dashboard →
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-white/20 hover:bg-white/5 transition-all hover:-translate-y-px"
            >
              How it Works →
            </a>
          </div>
        </div>

        {/* Visual */}
        <div className="flex justify-center lg:justify-end" style={{ animation: "fadeIn 0.7s 0.2s ease-out both" }}>
          <FaceScanWidget />
        </div>
      </div>
    </section>
  );
}
