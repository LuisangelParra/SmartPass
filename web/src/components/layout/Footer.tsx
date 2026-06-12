"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/landing/icons";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
      { label: "Live views", href: "/#views" },
      { label: "Launch dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/#developers" },
      { label: "GitHub", href: "https://github.com" },
      { label: "API reference", href: "/#developers" },
      { label: "Architecture", href: "/#developers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Privacy", href: "/" },
      { label: "Security", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/c/")) return null;
  if (pathname.startsWith("/events/") && pathname.endsWith("/checkin")) return null;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand" style={{ marginBottom: 16 }}>
              <span className="brand-mark">
                <Icon name="fingerprint" size={18} stroke={1.8} />
              </span>
              SmartPass
            </Link>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                maxWidth: 280,
                marginTop: 14,
                lineHeight: 1.55,
              }}
            >
              Open-source biometric access control. Your face is your ticket.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h5>{c.title}</h5>
              {c.links.map((l) =>
                l.href.startsWith("http") ? (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.label} href={l.href}>
                    {l.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
        <div className="footer-bot">
          <span>© 2026 SmartPass · MIT License</span>
          <span>Privacy by design · no raw images stored</span>
        </div>
      </div>
    </footer>
  );
}
