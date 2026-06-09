"use client";

import { useEffect, useState } from "react";

/* Calm hero visual.
   Oversized version of the brand mark — bracket reticle.
   Scan line sweep. Pulse halo. Identity acquired moment.
   No face. No dense mesh. No cartoon. */

export function FaceScanWidget() {
  const [verified, setVerified] = useState(false);
  const [metrics, setMetrics] = useState({ dist: 0, conf: 0, lat: 0 });

  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    let raf = 0;
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setMetrics({
        dist: +(ease * 0.34).toFixed(2),
        conf: +(ease * 94.2).toFixed(1),
        lat: Math.round(ease * 12),
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 800);
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const first = setTimeout(() => setVerified(true), 2900);
    const id = setInterval(() => setVerified((v) => !v), 4400);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3.5 w-full">
      <div className="scan-widget">
        <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          {/* Backdrop */}
          <rect width="320" height="320" fill="#080B0F" />

          {/* Subtle grid */}
          <g stroke="rgba(0,229,200,0.05)" strokeWidth="0.6">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1="32" y1={56 + i * 26} x2="288" y2={56 + i * 26} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={32 + i * 32} y1="56" x2={32 + i * 32} y2="264" />
            ))}
          </g>

          {/* Radial glow behind center */}
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="35%">
              <stop offset="0%" stopColor="rgba(0,229,200,0.22)" />
              <stop offset="100%" stopColor="rgba(0,229,200,0)" />
            </radialGradient>
          </defs>
          <rect width="320" height="320" fill="url(#centerGlow)" />

          {/* Outer reticle brackets — large */}
          <g
            stroke="#00E5C8"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="corner"
          >
            <path d="M40 92 L40 56 Q40 40 56 40 L92 40" />
            <path d="M228 40 L264 40 Q280 40 280 56 L280 92" />
            <path d="M40 228 L40 264 Q40 280 56 280 L92 280" />
            <path d="M228 280 L264 280 Q280 280 280 264 L280 228" />
          </g>

          {/* Inner reticle brackets — smaller, tighter */}
          <g
            stroke="rgba(0,229,200,0.55)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M104 132 L104 116 Q104 108 112 108 L128 108" />
            <path d="M192 108 L208 108 Q216 108 216 116 L216 132" />
            <path d="M104 188 L104 204 Q104 212 112 212 L128 212" />
            <path d="M192 212 L208 212 Q216 212 216 204 L216 188" />
          </g>

          {/* Concentric halos around center dot */}
          <circle cx="160" cy="160" r="48" stroke="rgba(0,229,200,0.18)" strokeWidth="0.8" fill="none" />
          <circle cx="160" cy="160" r="28" stroke="rgba(0,229,200,0.30)" strokeWidth="0.8" fill="none" />
          <circle cx="160" cy="160" r="14" stroke="rgba(0,229,200,0.55)" strokeWidth="1" fill="none" />

          {/* Center dot — identity acquired */}
          <circle cx="160" cy="160" r="6" fill="#00E5C8" />
          <circle
            cx="160"
            cy="160"
            r="6"
            fill="#00E5C8"
            opacity="0.4"
            style={{ animation: "pulseDot 1.8s ease-in-out infinite", transformOrigin: "160px 160px" }}
          />

          {/* Crosshair tick marks at midpoints */}
          <line x1="160" y1="40" x2="160" y2="56" stroke="rgba(0,229,200,0.4)" strokeWidth="1" strokeLinecap="round" />
          <line x1="160" y1="264" x2="160" y2="280" stroke="rgba(0,229,200,0.4)" strokeWidth="1" strokeLinecap="round" />
          <line x1="40" y1="160" x2="56" y2="160" stroke="rgba(0,229,200,0.4)" strokeWidth="1" strokeLinecap="round" />
          <line x1="264" y1="160" x2="280" y2="160" stroke="rgba(0,229,200,0.4)" strokeWidth="1" strokeLinecap="round" />

          {/* Telemetry corner labels */}
          <text
            x="56"
            y="52"
            fontFamily="'SF Mono','Consolas',monospace"
            fontSize="8"
            fill="rgba(0,229,200,0.5)"
            letterSpacing="1.5"
          >
            ROI
          </text>
          <text
            x="264"
            y="52"
            textAnchor="end"
            fontFamily="'SF Mono','Consolas',monospace"
            fontSize="8"
            fill="rgba(0,229,200,0.5)"
            letterSpacing="1.5"
          >
            240×240
          </text>
          <text
            x="56"
            y="276"
            fontFamily="'SF Mono','Consolas',monospace"
            fontSize="8"
            fill="rgba(0,229,200,0.5)"
            letterSpacing="1.5"
          >
            ID-128DIM
          </text>
          <text
            x="264"
            y="276"
            textAnchor="end"
            fontFamily="'SF Mono','Consolas',monospace"
            fontSize="8"
            fill="rgba(0,229,200,0.5)"
            letterSpacing="1.5"
          >
            L2 ≤ 0.6
          </text>
          <text
            x="160"
            y="308"
            textAnchor="middle"
            fontFamily="'SF Mono','Consolas',monospace"
            fontSize="9"
            fill="rgba(0,229,200,0.55)"
            letterSpacing="4"
          >
            BRACKET RETICLE
          </text>

          {/* Verified pill overlay */}
          {verified && (
            <g style={{ animation: "verifiedReveal 0.45s ease forwards" }}>
              <rect
                x="80"
                y="234"
                width="160"
                height="32"
                rx="6"
                fill="rgba(0,229,200,0.10)"
                stroke="rgba(0,229,200,0.55)"
                strokeWidth="1"
              />
              <text
                x="160"
                y="254"
                textAnchor="middle"
                fontFamily="'SF Mono','Consolas',monospace"
                fontSize="10"
                fill="#00E5C8"
                letterSpacing="2.5"
                fontWeight="600"
              >
                ✓ IDENTITY VERIFIED
              </text>
            </g>
          )}
        </svg>

        {/* Scan sweep line */}
        <div className="scan-line" aria-hidden="true" />
      </div>

      {/* Status bar */}
      <div className={`scan-status ${verified ? "verified" : ""}`} aria-live="polite">
        <span className="pulse-dot" aria-hidden="true" />
        <span>{verified ? "IDENTITY VERIFIED" : "SCANNING..."}</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[380px]">
        <div className="data-card">
          <span className="data-label">L2 Dist</span>
          <span className="data-value">{metrics.dist.toFixed(2)}</span>
        </div>
        <div className="data-card">
          <span className="data-label">Confidence</span>
          <span className="data-value hi">{metrics.conf.toFixed(1)}%</span>
        </div>
        <div className="data-card">
          <span className="data-label">Latency</span>
          <span className="data-value">{metrics.lat}ms</span>
        </div>
      </div>
    </div>
  );
}
