"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isMobileCheckIn = pathname.startsWith("/c/");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isMobileCheckIn) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all",
        scrolled
          ? "py-3 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]"
          : "py-5 bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-[1160px] mx-auto px-7 flex items-center justify-between gap-5">
        <Link href="/" aria-label="SmartPass" className="flex items-center flex-shrink-0">
          <SmartPassLogo height={28} />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isLanding && (
            <>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it Works</NavLink>
              <NavLink href="#use-cases">Use Cases</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
            </>
          )}
          {!isLanding && <NavLink href="/dashboard">Dashboard</NavLink>}
        </div>

        <Button asChild size="sm">
          <Link href="/dashboard">{isLanding ? "Launch App" : "New Event"}</Link>
        </Button>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3.5 py-2 rounded-md text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors"
    >
      {children}
    </Link>
  );
}

/* Bracket Reticle — biometric focus mark.
   4 corner brackets + center dot. No background fill.
   Carries the "scan / identify / acquire" semantic without literal imagery.
   Scales from 16px favicon to billboard. */
export function SmartPassLogo({
  height = 28,
  withWordmark = true,
}: {
  height?: number;
  withWordmark?: boolean;
}) {
  const w = withWordmark ? 200 : 44;
  return (
    <svg
      viewBox={`0 0 ${w} 44`}
      fill="none"
      style={{ height, width: "auto" }}
      aria-hidden="true"
    >
      {/* Corner brackets — viewfinder reticle */}
      <path d="M4 14 L4 6 Q4 4 6 4 L14 4" stroke="#00E5C8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 4 L38 4 Q40 4 40 6 L40 14" stroke="#00E5C8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4 30 L4 38 Q4 40 6 40 L14 40" stroke="#00E5C8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 40 L38 40 Q40 40 40 38 L40 30" stroke="#00E5C8" strokeWidth="2.2" strokeLinecap="round" />

      {/* Center dot — identity acquired */}
      <circle cx="22" cy="22" r="3" fill="#00E5C8" />

      {/* Wordmark */}
      {withWordmark && (
        <text
          x="54"
          y="29"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif"
          fontWeight="800"
          fontSize="20"
          letterSpacing="-0.8"
        >
          <tspan fill="#E6EDF3">Smart</tspan>
          <tspan fill="#00E5C8">Pass</tspan>
        </text>
      )}
    </svg>
  );
}
