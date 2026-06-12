"use client";

import { useState } from "react";
import { DashboardDemo } from "./DashboardDemo";
import { ReceptionDemo } from "./ReceptionDemo";

export function Views() {
  const [tab, setTab] = useState<"dash" | "reception">("dash");
  return (
    <section className="section" id="views">
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            Two screens, one system
          </span>
          <h2 className="h-section">
            Built for the organizer and the front door.
          </h2>
          <p className="lede">
            A control room for whoever runs the event, and a calm, full-screen
            welcome for whoever&apos;s standing at the entrance.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="views-tabs reveal">
            <button
              className={tab === "dash" ? "active" : ""}
              onClick={() => setTab("dash")}
            >
              Organizer Dashboard
            </button>
            <button
              className={tab === "reception" ? "active" : ""}
              onClick={() => setTab("reception")}
            >
              Reception Check-In
            </button>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          {tab === "dash" ? <DashboardDemo /> : <ReceptionDemo />}
        </div>
      </div>
    </section>
  );
}
