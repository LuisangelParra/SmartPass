"use client";

import { useState } from "react";

type TabKey = "create" | "register" | "checkin";

const TABS: { key: TabKey; label: string; endpoint: string }[] = [
  { key: "create", label: "Create Event", endpoint: "POST /events/" },
  { key: "register", label: "Register Attendee", endpoint: "POST /events/{id}/attendants" },
  { key: "checkin", label: "Check In", endpoint: "POST /events/{id}/check-in" },
];

const SNIPPETS: Record<TabKey, { request: string; response: string }> = {
  create: {
    request: `curl -X POST http://localhost:8000/api/v1/events/ \\
  -H "Content-Type: application/json" \\
  -d '{"event_name": "Tech Conference 2026"}'`,
    response: `{
  "id": "a1b2c3d4-...",
  "event_name": "Tech Conference 2026",
  "created_at": "2026-06-09T14:00:00Z"
}`,
  },
  register: {
    request: `curl -X POST http://localhost:8000/api/v1/events/{id}/attendants \\
  -F "name=Jane Doe" \\
  -F "image=@jane.jpg"`,
    response: `{
  "id": "e5f6a7b8-...",
  "event_id": "a1b2c3d4-...",
  "name": "Jane Doe",
  "attended": false,
  "attended_at": null
}`,
  },
  checkin: {
    request: `curl -X POST http://localhost:8000/api/v1/events/{id}/check-in \\
  -H "Content-Type: application/json" \\
  -d '{"image_base64": "data:image/jpeg;base64,/9j/4AAQ..."}'`,
    response: `{
  "id": "e5f6a7b8-...",
  "name": "Jane Doe",
  "attended": true,
  "attended_at": "2026-06-09T15:30:00Z"
}`,
  },
};

export function CodeExample() {
  const [tab, setTab] = useState<TabKey>("create");
  const data = SNIPPETS[tab];
  const endpoint = TABS.find((t) => t.key === tab)!.endpoint;

  return (
    <section className="py-24 px-7" style={{ background: "var(--surface)" }}>
      <div className="max-w-[1160px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left text */}
          <div>
            <span className="section-label reveal">Developer-First API</span>
            <h2 className="reveal text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-6" data-d="1">
              REST endpoints.
              <br />
              <span className="text-[var(--accent)]">No SDK lock-in.</span>
            </h2>
            <p className="reveal text-[var(--text-muted)] text-[15px] leading-[1.72] mb-6" data-d="2">
              SmartPass is a plain JSON + multipart REST API. Call it from any language —
              cURL, Python, Node, mobile apps, kiosks. No proprietary client needed.
            </p>

            <ul className="space-y-3 reveal" data-d="3">
              {[
                "8 endpoints across events, attendees, and check-in",
                "OpenAPI / Swagger docs auto-generated at /docs",
                "Multipart upload for images and ZIP archives",
                "UUID-scoped — no global auth required for prototyping",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[var(--text-muted)] text-sm">
                  <span className="text-[var(--accent)] mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right code block */}
          <div className="reveal" data-d="2">
            <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-2xl">
              {/* Tab bar */}
              <div className="flex border-b border-[var(--border)] bg-[var(--surface-2)]">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 px-3 py-3 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                      tab === t.key
                        ? "text-[var(--accent)] bg-[var(--accent-dim)] border-b-2 border-[var(--accent)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text)] border-b-2 border-transparent"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Endpoint header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
                <code className="font-mono text-xs text-[var(--accent)]">{endpoint}</code>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                  <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                </div>
              </div>

              {/* Request */}
              <div className="p-5 border-b border-[var(--border)]">
                <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-dim)] mb-2">
                  Request
                </div>
                <pre className="font-mono text-[12px] leading-[1.6] text-[var(--text)] overflow-x-auto whitespace-pre">
                  {data.request}
                </pre>
              </div>

              {/* Response */}
              <div className="p-5 bg-[var(--surface-2)]/40">
                <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-dim)] mb-2">
                  Response · 200 OK
                </div>
                <pre className="font-mono text-[12px] leading-[1.6] text-[var(--accent)] overflow-x-auto whitespace-pre">
                  {data.response}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
