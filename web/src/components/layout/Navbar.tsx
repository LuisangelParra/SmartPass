"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

export function SmartPassLogo({ height = 28 }: { height?: number }) {
  return (
    <svg viewBox="0 0 200 44" fill="none" style={{ height, width: "auto" }} aria-hidden="true">
      <rect x="2" y="2" width="40" height="40" rx="7" fill="#0D1117" stroke="#00E5C8" strokeWidth="1.5" />
      <ellipse cx="22" cy="21" rx="10" ry="12" stroke="rgba(0,229,200,0.55)" strokeWidth="1.2" />
      <circle cx="17.5" cy="17" r="2.2" fill="#00E5C8" />
      <circle cx="26.5" cy="17" r="2.2" fill="#00E5C8" />
      <line x1="22" y1="20" x2="22" y2="24" stroke="rgba(0,229,200,0.5)" strokeWidth="1" strokeLinecap="round" />
      <path d="M 17 27 Q 22 31 27 27" stroke="rgba(0,229,200,0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <line x1="7" y1="19" x2="37" y2="19" stroke="rgba(0,229,200,0.18)" strokeWidth="0.8" />
      <line x1="7" y1="23" x2="37" y2="23" stroke="rgba(0,229,200,0.18)" strokeWidth="0.8" />
      <line x1="7" y1="27" x2="37" y2="27" stroke="rgba(0,229,200,0.18)" strokeWidth="0.8" />
      <path d="M2 13 L2 2 L13 2" stroke="#00E5C8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 2 L42 2 L42 13" stroke="#00E5C8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <text
        x="54"
        y="30"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="700"
        fontSize="21"
        letterSpacing="-0.4"
      >
        <tspan fill="#E6EDF3">Smart</tspan>
        <tspan fill="#00E5C8">Pass</tspan>
      </text>
    </svg>
  );
}
