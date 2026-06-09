import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SmartPass — Biometric Event Check-In";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Editorial brand cover. Sparse. Logo dominant.
   Left column: brand mark, name, tagline, credits.
   Right column: one large brand mark as art element + corner labels. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#080B0F",
          display: "flex",
          position: "relative",
          color: "#E6EDF3",
          overflow: "hidden",
        }}
      >
        {/* Subtle grain texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
            display: "flex",
          }}
        />

        {/* Vertical divider line at 60% */}
        <div
          style={{
            position: "absolute",
            top: 60,
            bottom: 60,
            left: 720,
            width: 1,
            background: "rgba(0,229,200,0.12)",
            display: "flex",
          }}
        />

        {/* Frame border */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: "1px solid rgba(0,229,200,0.10)",
            borderRadius: 8,
            display: "flex",
            pointerEvents: "none",
          }}
        />

        {/* Top-left corner label */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
            letterSpacing: 3,
            color: "rgba(0,229,200,0.7)",
            fontWeight: 600,
          }}
        >
          <div style={{ width: 24, height: 1, background: "rgba(0,229,200,0.7)", display: "flex" }} />
          SMARTPASS · BIOMETRIC ACCESS
        </div>

        {/* Top-right corner label */}
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
            letterSpacing: 3,
            color: "rgba(230,237,243,0.4)",
            fontWeight: 500,
          }}
        >
          v1.0 · 2026
          <div style={{ width: 24, height: 1, background: "rgba(230,237,243,0.4)", display: "flex" }} />
        </div>

        {/* Bottom-left corner label */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
            letterSpacing: 3,
            color: "rgba(230,237,243,0.4)",
            fontWeight: 500,
          }}
        >
          OPEN SOURCE · MIT
        </div>

        {/* Bottom-right corner label */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
            letterSpacing: 3,
            color: "rgba(0,229,200,0.7)",
            fontWeight: 600,
          }}
        >
          FASTAPI · PGVECTOR · NEXT.JS
          <div style={{ width: 24, height: 1, background: "rgba(0,229,200,0.7)", display: "flex" }} />
        </div>

        {/* LEFT COLUMN — brand */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 88,
            paddingRight: 40,
            width: 720,
            zIndex: 2,
          }}
        >
          {/* Logo + wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 64 }}>
            <svg width="56" height="56" viewBox="0 0 44 44" fill="none">
              <path d="M4 14 L4 6 Q4 4 6 4 L14 4" stroke="#00E5C8" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M30 4 L38 4 Q40 4 40 6 L40 14" stroke="#00E5C8" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M4 30 L4 38 Q4 40 6 40 L14 40" stroke="#00E5C8" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M30 40 L38 40 Q40 40 40 38 L40 30" stroke="#00E5C8" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="22" cy="22" r="4" fill="#00E5C8" />
            </svg>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>
              <span style={{ color: "#E6EDF3" }}>Smart</span>
              <span style={{ color: "#00E5C8" }}>Pass</span>
            </div>
          </div>

          {/* Big tagline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 86,
              fontWeight: 800,
              letterSpacing: -3.5,
              lineHeight: 0.96,
              marginBottom: 36,
            }}
          >
            <span>Biometric</span>
            <span style={{ color: "#00E5C8" }}>check-in.</span>
          </div>

          {/* Sub */}
          <div
            style={{
              fontSize: 22,
              color: "#8B949E",
              lineHeight: 1.55,
              maxWidth: 520,
              display: "flex",
            }}
          >
            Open-source facial recognition for events. No tickets. No QR codes. Privacy-first by design.
          </div>
        </div>

        {/* RIGHT COLUMN — large brand mark as art */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 480,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {/* Backdrop glow */}
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: 9999,
              background:
                "radial-gradient(circle, rgba(0,229,200,0.18) 0%, transparent 60%)",
              display: "flex",
            }}
          />

          {/* Centered logo mark — oversized */}
          <svg width="340" height="340" viewBox="0 0 44 44" fill="none" style={{ zIndex: 2 }}>
            {/* Outer dim frame for depth */}
            <rect
              x="1.5"
              y="1.5"
              width="41"
              height="41"
              rx="6"
              stroke="rgba(0,229,200,0.06)"
              strokeWidth="0.4"
              fill="none"
            />
            {/* Brackets */}
            <path d="M4 14 L4 6 Q4 4 6 4 L14 4" stroke="#00E5C8" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M30 4 L38 4 Q40 4 40 6 L40 14" stroke="#00E5C8" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4 30 L4 38 Q4 40 6 40 L14 40" stroke="#00E5C8" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M30 40 L38 40 Q40 40 40 38 L40 30" stroke="#00E5C8" strokeWidth="1.6" strokeLinecap="round" />
            {/* Center dot */}
            <circle cx="22" cy="22" r="2.4" fill="#00E5C8" />
            {/* Outer dot halo */}
            <circle cx="22" cy="22" r="5" stroke="#00E5C8" strokeWidth="0.4" opacity="0.4" fill="none" />
            <circle cx="22" cy="22" r="8" stroke="#00E5C8" strokeWidth="0.3" opacity="0.2" fill="none" />
          </svg>

          {/* Side label — vertical */}
          <div
            style={{
              position: "absolute",
              right: 28,
              top: "50%",
              fontSize: 10,
              letterSpacing: 4,
              color: "rgba(0,229,200,0.5)",
              transform: "rotate(90deg) translateX(-50%)",
              transformOrigin: "right top",
              display: "flex",
              fontWeight: 600,
            }}
          >
            BRACKET RETICLE · IDENTITY ACQUIRED
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
