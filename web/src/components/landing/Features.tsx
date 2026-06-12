"use client";

import type { MouseEvent } from "react";
import { Icon, type IconName } from "./icons";

type Feat = {
  icon: IconName;
  span: "span-3" | "span-2";
  title: string;
  body: string;
  tag: string;
};

const FEATS: Feat[] = [
  {
    icon: "lock",
    span: "span-3",
    title: "Privacy by design",
    body: "SmartPass never stores raw images. Every photo is converted into a 128-dimensional mathematical signature the moment it arrives — and the original is discarded immediately.",
    tag: "image → vector → /dev/null",
  },
  {
    icon: "bolt",
    span: "span-3",
    title: "Database-driven AI speed",
    body: "Facial matching runs inside PostgreSQL via pgvector, comparing signatures in microseconds. No slow Python loops shuttling data in and out of the engine.",
    tag: "ORDER BY embedding <-> $1 LIMIT 1",
  },
  {
    icon: "zip",
    span: "span-2",
    title: "In-memory bulk upload",
    body: "Drop one ZIP of attendee photos labeled by name. The backend unpacks and enrolls hundreds of profiles entirely in RAM — no temp files left on disk.",
    tag: "zip → ram → enrolled",
  },
  {
    icon: "scan",
    span: "span-2",
    title: "Smart live check-in",
    body: "A browser loop streams base64 webcam frames to the API, which silently filters empty frames and matches only against the unattended pool.",
    tag: "unattended-only query",
  },
  {
    icon: "git",
    span: "span-2",
    title: "Open source",
    body: "Self-host the whole stack, audit every line, and extend it for your venue. No vendor lock-in, no per-scan fees, no black boxes.",
    tag: "MIT · self-hostable",
  },
];

export function Features() {
  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Why SmartPass</span>
          <h2 className="h-section">Engineered for speed, built for trust.</h2>
          <p className="lede">
            Every capability is designed around two constraints that usually
            fight each other: be instant, and respect privacy. SmartPass refuses
            to trade one for the other.
          </p>
        </div>
        <div className="feat-grid">
          {FEATS.map((f, i) => (
            <div
              className={`feat reveal ${f.span}`}
              key={i}
              onMouseMove={onMove}
            >
              <div className="ficon">
                <Icon name={f.icon} size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <div className="tagline mono">{f.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
