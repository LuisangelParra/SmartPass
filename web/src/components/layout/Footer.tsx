import Link from "next/link";
import { SmartPassLogo } from "./Navbar";

const groups = [
  {
    label: "Product",
    links: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Use Cases", href: "#use-cases" },
    ],
  },
  {
    label: "Developer",
    links: [
      { name: "API Reference", href: "/docs" },
      { name: "Architecture", href: "/docs" },
      { name: "GitHub", href: "https://github.com" },
      { name: "MIT License", href: "/docs" },
    ],
  },
  {
    label: "Resources",
    links: [
      { name: "FAQ", href: "#faq" },
      { name: "Privacy by Design", href: "#features" },
      { name: "pgvector", href: "https://github.com/pgvector/pgvector" },
      { name: "face_recognition", href: "https://github.com/ageitgey/face_recognition" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="border-t border-[var(--border)] px-7 pt-16 pb-9"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[1160px] mx-auto">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <SmartPassLogo height={26} />
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-[1.65] max-w-xs">
              Biometric event check-in. Privacy-first facial recognition
              powered by pgvector and dlib.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--accent)", opacity: 0.6 }}
                />
                128-DIM EMBEDDINGS
              </span>
            </div>
          </div>

          {/* Link groups */}
          {groups.map((group) => (
            <div key={group.label}>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-4">
                {group.label}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-7 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 SmartPass. Open source under the MIT License.
          </p>
          <div className="flex items-center gap-5 text-xs text-[var(--text-muted)]">
            <span className="font-mono uppercase tracking-widest text-[10px]">
              v1.0 · Built with Next.js + FastAPI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
