"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

const ROSTER = [
  { name: "Amara Okafor", tag: "AO", role: "general" },
  { name: "Juan Pérez", tag: "JP", role: "vip" },
  { name: "Wei Zhang", tag: "WZ", role: "general" },
  { name: "Sofía Romano", tag: "SR", role: "staff" },
  { name: "Liam Schäfer", tag: "LS", role: "press" },
  { name: "Priya Nair", tag: "PN", role: "general" },
  { name: "Mateo Silva", tag: "MS", role: "general" },
  { name: "Hana Kim", tag: "HK", role: "vip" },
];

type Row = (typeof ROSTER)[number] & { time: string; justin: boolean };

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function DashboardDemo() {
  const [arrived, setArrived] = useState<Row[]>(() => [
    { ...ROSTER[0], time: "09:41:12", justin: false },
    { ...ROSTER[2], time: "09:42:58", justin: false },
  ]);
  const next = useRef(2);

  useEffect(() => {
    const t = setInterval(() => {
      if (next.current >= ROSTER.length) return;
      const g = ROSTER[next.current];
      next.current++;
      setArrived((prev) =>
        [{ ...g, time: fmtTime(new Date()), justin: true }, ...prev].slice(0, 8)
      );
      setTimeout(
        () => setArrived((prev) => prev.map((p) => ({ ...p, justin: false }))),
        1600
      );
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const total = ROSTER.length;
  const here = arrived.length;
  const pct = Math.round((here / total) * 100);

  return (
    <div className="dash">
      <div className="dash-top">
        <div className="titlewrap">
          <span className="brand-mark" style={{ width: 26, height: 26 }}>
            <Icon name="fingerprint" size={15} />
          </span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>
              DevConf 2026 — Main Hall
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--text-faint)" }}
            >
              event/8f3a-c41d-…-9e2b
            </div>
          </div>
        </div>
        <span className="live-pill">
          <span className="pulse" />
          LIVE
        </span>
      </div>
      <div className="dash-body">
        <div className="dash-side">
          <div className="dash-stat">
            <div className="lab">Checked in</div>
            <div className="val">
              {here}
              <small> / {total}</small>
            </div>
          </div>
          <div className="dash-stat">
            <div className="lab">Attendance</div>
            <div className="val">
              {pct}
              <small>%</small>
            </div>
          </div>
          <div className="dash-stat">
            <div className="lab">Avg match time</div>
            <div className="val" style={{ color: "var(--green)" }}>
              0.8<small>ms</small>
            </div>
          </div>
        </div>
        <div className="dash-main">
          <div className="dash-tablehead">
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--text-faint)",
                letterSpacing: "0.05em",
              }}
            >
              LIVE ARRIVALS
            </div>
            <span className="live-pill">
              <span className="pulse" />
              auto-updating
            </span>
          </div>
          <div className="att-table">
            {arrived.map((a, k) => (
              <div
                className={"att-row" + (a.justin ? " justin" : "")}
                key={a.name + k}
              >
                <div className="avatar-ph">{a.tag}</div>
                <div className="att-name">
                  {a.name}
                  <small>{a.role.toUpperCase()}</small>
                </div>
                <div className="att-time">{a.time}</div>
                <div className="status-tag arrived">ARRIVED</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
