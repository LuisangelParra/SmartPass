import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0D1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M4 14 L4 6 Q4 4 6 4 L14 4" stroke="#00E5C8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M30 4 L38 4 Q40 4 40 6 L40 14" stroke="#00E5C8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M4 30 L4 38 Q4 40 6 40 L14 40" stroke="#00E5C8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M30 40 L38 40 Q40 40 40 38 L40 30" stroke="#00E5C8" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="22" cy="22" r="4" fill="#00E5C8" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
