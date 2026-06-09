import type { Attendant } from "@/types";

type ResultState =
  | { type: "scanning" }
  | { type: "verified"; attendant: Attendant }
  | { type: "denied" }
  | { type: "no_face" };

interface Props {
  result: ResultState;
}

export function MatchResult({ result }: Props) {
  if (result.type === "scanning") {
    return (
      <div className="flex flex-col items-center gap-4 p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]"
              style={{ animation: `pulseDot 1.5s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-[var(--text-muted)]">Ready to scan</p>
      </div>
    );
  }

  if (result.type === "no_face") {
    return (
      <div className="flex flex-col items-center gap-3 p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <p className="text-sm text-[var(--text-muted)]">No face detected in frame</p>
      </div>
    );
  }

  if (result.type === "denied") {
    return (
      <div
        className="flex flex-col items-center gap-3 p-8 rounded-xl border"
        style={{
          background: "rgba(239,68,68,0.08)",
          borderColor: "rgba(239,68,68,0.3)",
          animation: "verifiedReveal 0.3s ease",
        }}
      >
        <span className="text-4xl">✗</span>
        <p className="text-lg font-semibold text-red-400">Access Denied</p>
        <p className="text-sm text-[var(--text-muted)]">Face not recognized</p>
      </div>
    );
  }

  const time = result.attendant.attended_at
    ? new Date(result.attendant.attended_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  return (
    <div
      className="flex flex-col items-center gap-3 p-8 rounded-xl border"
      style={{
        background: "rgba(34,197,94,0.08)",
        borderColor: "rgba(34,197,94,0.3)",
        animation: "verifiedReveal 0.3s ease",
      }}
    >
      <span className="text-4xl">✓</span>
      <p className="text-lg font-semibold text-green-400">Verified</p>
      <p className="font-medium text-[var(--text)]">{result.attendant.name}</p>
      {time && <p className="text-xs text-[var(--text-muted)]">{time}</p>}
    </div>
  );
}
