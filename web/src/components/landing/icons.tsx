import type { ReactNode } from "react";

type IconName =
  | "shield"
  | "bolt"
  | "upload"
  | "code"
  | "scan"
  | "face"
  | "spark"
  | "db"
  | "lock"
  | "eye"
  | "eyeoff"
  | "clock"
  | "arrow"
  | "check"
  | "x"
  | "star"
  | "zip"
  | "cpu"
  | "git"
  | "layers"
  | "fingerprint";

const PATHS: Record<IconName, ReactNode> = {
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
    </>
  ),
  code: (
    <>
      <path d="M9 8l-5 4 5 4" />
      <path d="M15 8l5 4-5 4" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V5a1 1 0 011-1h3" />
      <path d="M20 8V5a1 1 0 00-1-1h-3" />
      <path d="M4 16v3a1 1 0 001 1h3" />
      <path d="M20 16v3a1 1 0 01-1 1h-3" />
      <path d="M4 12h16" />
    </>
  ),
  face: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01M15 10h.01" />
      <path d="M9 15c.8.7 1.9 1 3 1s2.2-.3 3-1" />
    </>
  ),
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />,
  db: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeoff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A10.9 10.9 0 0112 6c6.5 0 10 7 10 7a13.4 13.4 0 01-3.3 4M6.6 6.6A13.3 13.3 0 002 13s3.5 7 10 7a10.7 10.7 0 005.4-1.5" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  check: <path d="M5 13l4 4 10-11" />,
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  star: <path d="M12 3l2.6 6.3L21 10l-5 4.3L17.5 21 12 17.3 6.5 21 8 14.3 3 10l6.4-.7L12 3z" />,
  zip: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M10 3v2M12 5v2M10 7v2M12 9v2M10 11v2" />
      <rect x="9" y="13" width="4" height="4" rx="1" />
    </>
  ),
  cpu: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3v2M14 3v2M10 19v2M14 19v2M3 10h2M3 14h2M19 10h2M19 14h2" />
    </>
  ),
  git: (
    <>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <circle cx="18" cy="9" r="2.4" />
      <path d="M6 8.4v7.2M8.2 7.2C13 7.5 15.5 8.5 15.5 11.4v0" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M12 11v3a8 8 0 01-1.5 4.7" />
      <path d="M8.5 7.5A5 5 0 0117 12v1" />
      <path d="M5 12a7 7 0 0111-5.7" />
      <path d="M14 13a8 8 0 01-2 5.3" />
    </>
  ),
};

export function Icon({
  name,
  size = 22,
  stroke = 1.6,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

export type { IconName };
