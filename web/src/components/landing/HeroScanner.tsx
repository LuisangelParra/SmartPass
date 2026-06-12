"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

const MATCH = {
  name: "Amara Okafor",
  tag: "AO",
  role: "VIP · Speaker",
  score: "99.4",
};

export function HeroScanner() {
  const [phase, setPhase] = useState<"scan" | "match">("scan");
  const [vec, setVec] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    const run = async () => {
      while (!cancelled) {
        setPhase("scan");
        const nums: string[] = [];
        for (let i = 0; i < 6 && !cancelled; i++) {
          nums.push((Math.random() * 2 - 1).toFixed(2));
          setVec([...nums]);
          await wait(260);
        }
        if (cancelled) break;
        setPhase("match");
        await wait(3200);
        if (cancelled) break;
      }
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const matched = phase === "match";

  return (
    <div className="scanner reveal">
      <div className="scanner-head">
        <span className="chip">
          <Icon name="scan" size={14} /> reception · entrance A
        </span>
        <span
          className="cam-status"
          style={{ color: matched ? "var(--green)" : "var(--amber)" }}
        >
          <span
            className="cam-status-dot"
            style={{ background: matched ? "var(--green)" : "var(--amber)" }}
          />
          {matched ? "MATCH FOUND" : "ANALYZING FRAME"}
        </span>
      </div>

      <div className="scan-stage">
        <span className="feed-label mono">[ live camera feed ]</span>
        <div className={"reticle" + (matched ? " ok" : "")}>
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
          <span className="cross-h" />
          <span className="cross-v" />
        </div>
        {!matched && <div className="scan-line" />}
        <span className="ph-label">webcam_stream · 1280×720 · base64</span>
      </div>

      <div className="vec-panel">
        {!matched ? (
          <>
            <div className="vec-row">
              <span>encoding face → 128-d signature</span>
              <b className="mono" style={{ color: "var(--amber)" }}>
                computing…
              </b>
            </div>
            <div className="vec-stream">
              [{" "}
              {vec.map((n, k) => (
                <span key={k}>
                  <span className="num">{n}</span>
                  {k < vec.length - 1 ? ", " : ""}
                </span>
              ))}
              {vec.length < 6 ? " …" : ", …122 more ]"}
            </div>
          </>
        ) : (
          <div className="match-card">
            <span className="avatar-ph" style={{ width: 40, height: 40 }}>
              {MATCH.tag}
            </span>
            <div className="match-id">
              <b>{MATCH.name}</b>
              <span className="mono">{MATCH.role}</span>
            </div>
            <div className="match-meta">
              <span className="match-score">
                <Icon name="check" size={13} stroke={2.6} /> {MATCH.score}%
              </span>
              <span className="mono">0.8ms · db-side</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
