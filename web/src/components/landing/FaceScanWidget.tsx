"use client";

import { useEffect, useState } from "react";

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
          <defs>
            <radialGradient id="faceGlow" cx="50%" cy="45%" r="40%">
              <stop offset="0%" stopColor="rgba(0,229,200,0.12)" />
              <stop offset="100%" stopColor="rgba(0,229,200,0)" />
            </radialGradient>
          </defs>

          <rect width="320" height="320" fill="#080B0F" />
          <ellipse cx="160" cy="148" rx="90" ry="110" fill="url(#faceGlow)" />

          {/* scan grid lines */}
          <g stroke="rgba(0,229,200,0.07)" strokeWidth="0.8">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i} x1="28" y1={80 + i * 16} x2="292" y2={80 + i * 16} />
            ))}
          </g>

          {/* Corner brackets */}
          <g stroke="#00E5C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="corner">
            <path d="M28 72 L28 28 L72 28" />
            <path d="M248 28 L292 28 L292 72" />
            <path d="M28 248 L28 292 L72 292" />
            <path d="M248 292 L292 292 L292 248" />
          </g>

          {/* Left measurement scale */}
          <g stroke="rgba(0,229,200,0.3)" strokeWidth="0.8" fill="rgba(0,229,200,0.35)" fontFamily="'SF Mono','Consolas',monospace" fontSize="8">
            <line x1="22" y1="80" x2="28" y2="80" />
            <line x1="22" y1="112" x2="28" y2="112" />
            <line x1="22" y1="144" x2="28" y2="144" />
            <line x1="22" y1="176" x2="28" y2="176" />
            <line x1="22" y1="208" x2="28" y2="208" />
            <text x="19" y="83" textAnchor="end">0.2</text>
            <text x="19" y="115" textAnchor="end">0.4</text>
            <text x="19" y="147" textAnchor="end">0.6</text>
            <text x="19" y="179" textAnchor="end">0.8</text>
            <text x="19" y="211" textAnchor="end">1.0</text>
          </g>

          {/* Head outline */}
          <ellipse cx="160" cy="148" rx="66" ry="84" fill="none" stroke="rgba(0,229,200,0.28)" strokeWidth="1.4" />

          {/* Eyebrows */}
          <path d="M122 116 Q132 110 142 113" fill="none" stroke="rgba(0,229,200,0.35)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M178 113 Q188 110 198 116" fill="none" stroke="rgba(0,229,200,0.35)" strokeWidth="1.2" strokeLinecap="round" />

          {/* Eye sockets */}
          <ellipse cx="134" cy="127" rx="14" ry="9" fill="none" stroke="rgba(0,229,200,0.45)" strokeWidth="1.2" />
          <ellipse cx="186" cy="127" rx="14" ry="9" fill="none" stroke="rgba(0,229,200,0.45)" strokeWidth="1.2" />
          <circle cx="134" cy="127" r="4.5" fill="rgba(0,229,200,0.15)" stroke="rgba(0,229,200,0.8)" strokeWidth="1" />
          <circle cx="186" cy="127" r="4.5" fill="rgba(0,229,200,0.15)" stroke="rgba(0,229,200,0.8)" strokeWidth="1" />

          {/* Nose */}
          <line x1="160" y1="138" x2="160" y2="157" stroke="rgba(0,229,200,0.35)" strokeWidth="1" strokeLinecap="round" />
          <path d="M152 160 Q160 165 168 160" fill="none" stroke="rgba(0,229,200,0.35)" strokeWidth="1" strokeLinecap="round" />

          {/* Mouth */}
          <path d="M145 172 Q160 185 175 172" fill="none" stroke="rgba(0,229,200,0.55)" strokeWidth="1.3" strokeLinecap="round" />

          {/* Chin */}
          <path d="M 102 175 Q 106 215 160 228 Q 214 215 218 175" fill="none" stroke="rgba(0,229,200,0.2)" strokeWidth="1" />

          {/* Landmarks */}
          <g className="landmark">
            <circle cx="120" cy="127" r="2.2" fill="#00E5C8" opacity="0.7" />
            <circle cx="148" cy="127" r="2.2" fill="#00E5C8" opacity="0.7" />
            <circle cx="172" cy="127" r="2.2" fill="#00E5C8" opacity="0.7" />
            <circle cx="200" cy="127" r="2.2" fill="#00E5C8" opacity="0.7" />
            <circle cx="134" cy="127" r="1.6" fill="#00E5C8" opacity="0.9" />
            <circle cx="186" cy="127" r="1.6" fill="#00E5C8" opacity="0.9" />
            <circle cx="160" cy="159" r="1.8" fill="#00E5C8" opacity="0.65" />
            <circle cx="145" cy="172" r="1.8" fill="#00E5C8" opacity="0.65" />
            <circle cx="175" cy="172" r="1.8" fill="#00E5C8" opacity="0.65" />
            <circle cx="102" cy="175" r="1.6" fill="#00E5C8" opacity="0.5" />
            <circle cx="218" cy="175" r="1.6" fill="#00E5C8" opacity="0.5" />
            <circle cx="160" cy="228" r="1.6" fill="#00E5C8" opacity="0.45" />
          </g>

          {/* Face mesh */}
          <g stroke="rgba(0,229,200,0.1)" strokeWidth="0.6" fill="none">
            <line x1="120" y1="127" x2="134" y2="127" />
            <line x1="134" y1="127" x2="148" y2="127" />
            <line x1="172" y1="127" x2="186" y2="127" />
            <line x1="186" y1="127" x2="200" y2="127" />
            <line x1="134" y1="127" x2="160" y2="159" />
            <line x1="186" y1="127" x2="160" y2="159" />
            <line x1="160" y1="159" x2="145" y2="172" />
            <line x1="160" y1="159" x2="175" y2="172" />
            <line x1="145" y1="172" x2="175" y2="172" />
            <line x1="102" y1="175" x2="145" y2="172" />
            <line x1="218" y1="175" x2="175" y2="172" />
          </g>

          <text x="288" y="285" textAnchor="end" fontFamily="'SF Mono','Consolas',monospace" fontSize="8" fill="rgba(0,229,200,0.3)" letterSpacing="1">
            ID-128DIM
          </text>
          <text x="160" y="308" textAnchor="middle" fontFamily="'SF Mono','Consolas',monospace" fontSize="9" fill="rgba(0,229,200,0.4)" letterSpacing="3.5">
            BIOMETRIC SCAN
          </text>

          {verified && (
            <g style={{ animation: "verifiedReveal 0.45s ease forwards" }}>
              <rect x="74" y="140" width="172" height="40" rx="7" fill="rgba(0,229,200,0.08)" stroke="rgba(0,229,200,0.5)" strokeWidth="1" />
              <text x="160" y="165" textAnchor="middle" fontFamily="'SF Mono','Consolas',monospace" fontSize="11" fill="#00E5C8" letterSpacing="2.5" fontWeight="600">
                ✓ IDENTITY VERIFIED
              </text>
            </g>
          )}
        </svg>

        <div className="scan-line" aria-hidden="true" />
      </div>

      <div className={`scan-status ${verified ? "verified" : ""}`} aria-live="polite">
        <span className="pulse-dot" aria-hidden="true" />
        <span>{verified ? "IDENTITY VERIFIED" : "SCANNING..."}</span>
      </div>

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
