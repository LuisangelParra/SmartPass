"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/landing/icons";

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isMobileCheckIn = pathname.startsWith("/c/");
  const isAppRoute = pathname.startsWith("/events/");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isMobileCheckIn) return null;
  if (isAppRoute) return null;

  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="SmartPass">
          <span className="brand-mark">
            <Icon name="fingerprint" size={18} stroke={1.8} />
          </span>
          SmartPass
        </Link>

        {isLanding && (
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#views">Live views</a>
            <a href="#developers">Developers</a>
          </div>
        )}

        <div className="nav-cta">
          <a
            className="ghstars"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="star" size={14} />
            4.2k
          </a>
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            {isLanding ? "Create an Event Free" : "Dashboard"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* Bracket Reticle — biometric focus mark.
   Preserved for OG/favicon routes that import it. */
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
      <path d="M4 14 L4 6 Q4 4 6 4 L14 4" stroke="#00E5C8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 4 L38 4 Q40 4 40 6 L40 14" stroke="#00E5C8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4 30 L4 38 Q4 40 6 40 L14 40" stroke="#00E5C8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 40 L38 40 Q40 40 40 38 L40 30" stroke="#00E5C8" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="22" cy="22" r="3" fill="#00E5C8" />
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
