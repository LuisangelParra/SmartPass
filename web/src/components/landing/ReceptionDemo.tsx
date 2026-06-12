"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

const GUESTS = [
  { name: "Juan Pérez", role: "VIP · Speaker" },
  { name: "Amara Okafor", role: "General Admission" },
  { name: "Liam Schäfer", role: "Press Pass" },
  { name: "Sofía Romano", role: "Organizer Staff" },
];

type State = "scanning" | "verifying" | "welcome" | "denied";

export function ReceptionDemo() {
  const [state, setState] = useState<State>("scanning");
  const [guest, setGuest] = useState(GUESTS[0]);
  const idx = useRef(0);
  const cycle = useRef(0);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;
    const run = () => {
      setState("scanning");
      t1 = setTimeout(() => setState("verifying"), 1600);
      t2 = setTimeout(() => {
        cycle.current++;
        const deny = cycle.current % 5 === 0;
        if (deny) {
          setState("denied");
        } else {
          idx.current = (idx.current + 1) % GUESTS.length;
          setGuest(GUESTS[idx.current]);
          setState("welcome");
        }
      }, 2700);
      t3 = setTimeout(run, 5200);
    };
    run();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const isWelcome = state === "welcome";
  const isDenied = state === "denied";
  const overlayBg = isWelcome
    ? "oklch(0.40 0.12 150 / 0.55)"
    : isDenied
    ? "oklch(0.40 0.16 25 / 0.5)"
    : "transparent";
  const labelText =
    state === "scanning"
      ? "SEARCHING FOR FACE"
      : state === "verifying"
      ? "MATCHING AGAINST POOL"
      : isWelcome
      ? "MATCH FOUND"
      : "NO MATCH";
  const labelColor = isWelcome
    ? "var(--green)"
    : isDenied
    ? "var(--red)"
    : "var(--amber)";

  const time =
    typeof window !== "undefined"
      ? new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "";

  return (
    <div className="reception-frame">
      <div className="reception-bezel">
        <div className="cam-feed" />
        {(state === "scanning" || state === "verifying") && (
          <div className="cam-scanline" />
        )}
        {(state === "scanning" || state === "verifying") && (
          <div className="cam-corner-frame">
            <i
              className="tl"
              style={{
                borderColor:
                  state === "verifying" ? "var(--green)" : "var(--cyan)",
              }}
            />
            <i
              className="tr"
              style={{
                borderColor:
                  state === "verifying" ? "var(--green)" : "var(--cyan)",
              }}
            />
            <i
              className="bl"
              style={{
                borderColor:
                  state === "verifying" ? "var(--green)" : "var(--cyan)",
              }}
            />
            <i
              className="br"
              style={{
                borderColor:
                  state === "verifying" ? "var(--green)" : "var(--cyan)",
              }}
            />
          </div>
        )}
        <div className="cam-state-label">
          <span
            className="ld"
            style={{
              background: labelColor,
              boxShadow: `0 0 10px ${labelColor}`,
            }}
          />
          {labelText}
        </div>

        <div className="cam-overlay" style={{ background: overlayBg }}>
          {isWelcome && (
            <>
              <div
                className="welcome-icon"
                style={{
                  background: "var(--green)",
                  color: "oklch(0.16 0.02 150)",
                }}
              >
                <Icon name="check" size={42} stroke={2.4} />
              </div>
              <div className="welcome-name">
                Welcome, {guest.name.split(" ")[0]}!
              </div>
              <div className="welcome-sub" style={{ color: "var(--green)" }}>
                {guest.name} · {guest.role}
              </div>
              <div className="chip" style={{ marginTop: 16 }}>
                checked in · {time}
              </div>
            </>
          )}
          {isDenied && (
            <>
              <div
                className="welcome-icon"
                style={{ background: "var(--red)", color: "white" }}
              >
                <Icon name="x" size={42} stroke={2.6} />
              </div>
              <div className="welcome-name" style={{ color: "white" }}>
                Access Denied
              </div>
              <div className="welcome-sub" style={{ color: "var(--red)" }}>
                Face not in this event&apos;s guest list
              </div>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 8px 4px",
        }}
      >
        <span className="chip">
          <Icon name="face" size={14} /> reception · entrance A
        </span>
        <span
          className="mono"
          style={{ fontSize: 12, color: "var(--text-faint)" }}
        >
          frames streamed · {state === "scanning" ? "filtering empty" : "24 fps"}
        </span>
      </div>
    </div>
  );
}
