"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";

function ReceptionMini() {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--line)",
        position: "relative",
        aspectRatio: "16/10",
        background: "var(--ink-900)",
      }}
    >
      <div className="cam-feed" />
      <span className="feed-label mono">[ live camera feed ]</span>
      <div className="reticle">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <span className="cross-h" />
        <span className="cross-v" />
      </div>
      <div className="cam-scanline" />
      <div className="cam-state-label">
        <span
          className="ld"
          style={{ background: "var(--cyan)", boxShadow: "0 0 10px var(--cyan)" }}
        />
        STREAMING FRAMES
      </div>
    </div>
  );
}

type Step = {
  n: string;
  icon: IconName;
  title: string;
  body: string;
  visual: ReactNode;
};

const STEPS: Step[] = [
  {
    n: "01",
    icon: "spark",
    title: "Create your event",
    body: "Spin up a free-access event in seconds — no global admin signup. Each one gets a unique, secure UUID-based URL you can share with your team.",
    visual: (
      <>
        <div className="vis-head">
          <span className="chip">
            <Icon name="spark" size={13} /> new event
          </span>
          <span className="mono" style={{ fontSize: 11, color: "var(--green)" }}>
            ● created
          </span>
        </div>
        <div className="vis-card">
          <div className="vis-title">DevConf 2026 — Main Hall</div>
          <div className="vis-url">
            smartpass.io/e/<span style={{ color: "var(--green)" }}>8f3a-c41d</span>
            <span className="cpy">
              <Icon name="layers" size={14} />
            </span>
          </div>
          <div className="toggle-row">
            <span className="lbl">
              <Icon name="lock" size={15} /> Free public access
            </span>
            <span className="tg" />
          </div>
          <div className="toggle-row">
            <span className="lbl">
              <Icon name="face" size={15} /> Face check-in
            </span>
            <span className="tg" />
          </div>
          <div className="toggle-row">
            <span className="lbl">
              <Icon name="eyeoff" size={15} /> Discard raw images
            </span>
            <span className="tg" />
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span className="chip">no admin registration</span>
          <span className="chip">uuid-secured</span>
          <span className="chip">free tier</span>
        </div>
      </>
    ),
  },
  {
    n: "02",
    icon: "upload",
    title: "Upload your guests",
    body: "Add attendees one at a time with a drag-and-drop photo, or drop a single ZIP of labeled images to enroll hundreds at once — all processed in memory.",
    visual: (
      <>
        <div className="vis-head">
          <span className="chip">
            <Icon name="zip" size={13} /> guests.zip · 412 photos
          </span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>
            in-memory
          </span>
        </div>
        <div className="dropzone">
          <span className="di">
            <Icon name="upload" size={26} />
          </span>
          <div style={{ fontSize: 14 }}>Drop a ZIP of attendee photos</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>
            labeled by name · jpg / png
          </div>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              marginBottom: 7,
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>enrolling…</span>
            <span style={{ color: "var(--green)" }}>412 / 412</span>
          </div>
          <div className="progress">
            <i />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {["amara_okafor.jpg", "juan_perez.jpg", "wei_zhang.jpg"].map((f, i) => (
            <div className="flist-row" key={i}>
              <span className="ok">
                <Icon name="check" size={14} stroke={2.4} />
              </span>
              {f}
              <span className="arr">→ 128-d vector</span>
            </div>
          ))}
        </div>
        <div
          className="mono"
          style={{ marginTop: "auto", fontSize: 11.5, color: "var(--green)" }}
        >
          ✓ 0 files written to disk
        </div>
      </>
    ),
  },
  {
    n: "03",
    icon: "scan",
    title: "Open the webcam terminal",
    body: "Point any laptop or tablet at the entrance and open the reception screen. It streams frames continuously and matches every face the instant it appears.",
    visual: (
      <>
        <div className="vis-head">
          <span className="chip">
            <Icon name="scan" size={13} /> reception terminal
          </span>
          <span className="mono" style={{ fontSize: 11, color: "var(--cyan)" }}>
            ● streaming
          </span>
        </div>
        <ReceptionMini />
        <div
          style={{
            display: "flex",
            gap: 9,
            flexWrap: "wrap",
            marginTop: "auto",
          }}
        >
          <span className="chip">any webcam</span>
          <span className="chip">empty frames filtered</span>
          <span className="chip">no install</span>
        </div>
      </>
    ),
  },
  {
    n: "04",
    icon: "eye",
    title: "Track arrivals live",
    body: "Watch your dashboard fill in real time — names, roles, and exact timestamps appear the moment each guest is verified at the door.",
    visual: (
      <>
        <div className="vis-head">
          <span className="live-pill">
            <span className="pulse" />
            LIVE FEED
          </span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>
            auto-updating
          </span>
        </div>
        <div className="mini-stats">
          <div className="mini-stat">
            <div className="v">
              5
              <span style={{ color: "var(--text-faint)", fontSize: 14 }}>/8</span>
            </div>
            <div className="l">checked in</div>
          </div>
          <div className="mini-stat">
            <div className="v">
              63<span style={{ color: "var(--text-faint)", fontSize: 14 }}>%</span>
            </div>
            <div className="l">attendance</div>
          </div>
          <div className="mini-stat">
            <div className="v" style={{ color: "var(--green)" }}>
              0.8
              <span style={{ color: "var(--text-faint)", fontSize: 14 }}>ms</span>
            </div>
            <div className="l">avg match</div>
          </div>
        </div>
        <div className="vis-card" style={{ padding: "6px 16px" }}>
          {(
            [
              ["AO", "Amara Okafor", "09:41:12"],
              ["JP", "Juan Pérez", "09:42:58"],
              ["WZ", "Wei Zhang", "09:43:30"],
              ["SR", "Sofía Romano", "09:44:05"],
            ] as const
          ).map(([tag, nm, tm], i) => (
            <div className="arr-row" key={i}>
              <span className="avatar-ph">{tag}</span>
              <span className="nm">{nm}</span>
              <span className="tm">{tm}</span>
              <span className="status-tag arrived">ARRIVED</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % STEPS.length);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  function pick(i: number) {
    paused.current = true;
    setActive(i);
  }

  return (
    <section
      className="section"
      id="how"
      style={{ background: "oklch(0.165 0.012 256)" }}
    >
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">How it works</span>
          <h2 className="h-section">From zero to live check-in in four steps.</h2>
        </div>
        <div className="steps-wrap">
          <div className="steps-list reveal">
            {STEPS.map((s, i) => (
              <div
                className={"step" + (active === i ? " active" : "")}
                key={i}
                onClick={() => pick(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(i);
                  }
                }}
              >
                <span className="num">
                  {active === i ? <Icon name={s.icon} size={18} /> : s.n}
                </span>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="step-visual" key={active}>
            {STEPS[active].visual}
          </div>
        </div>
      </div>
    </section>
  );
}
