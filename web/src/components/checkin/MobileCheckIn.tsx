"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { RotateCw, Check, X, AlertCircle, Camera } from "lucide-react";
import { api } from "@/lib/api";
import { SmartPassLogo } from "@/components/layout/Navbar";
import type { Attendant } from "@/types";

type State =
  | { kind: "idle" }
  | { kind: "capturing" }
  | { kind: "verified"; attendant: Attendant }
  | { kind: "denied" }
  | { kind: "no_face" }
  | { kind: "error"; message: string };

interface ApiError extends Error {
  status: number;
}

interface Props {
  eventId: string;
}

export function MobileCheckIn({ eventId }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [camReady, setCamReady] = useState(false);
  const [insecure, setInsecure] = useState(false);

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => api.getEvent(eventId),
    retry: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    setInsecure(!ok);
  }, []);

  // Auto-reset after result
  useEffect(() => {
    if (state.kind === "verified" || state.kind === "denied" || state.kind === "no_face") {
      const t = setTimeout(() => setState({ kind: "idle" }), 2800);
      return () => clearTimeout(t);
    }
  }, [state]);

  const capture = useCallback(async () => {
    if (!camReady || state.kind === "capturing") return;
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) {
      setState({ kind: "error", message: "Camera not ready" });
      return;
    }
    setState({ kind: "capturing" });
    try {
      const attendant = await api.checkIn(eventId, shot);
      setState({ kind: "verified", attendant });
      navigator.vibrate?.(60);
    } catch (err) {
      const e = err as ApiError;
      if (e.status === 401) setState({ kind: "denied" });
      else if (e.status === 400) setState({ kind: "no_face" });
      else setState({ kind: "error", message: e.message ?? "Request failed" });
      navigator.vibrate?.([40, 30, 40]);
    }
  }, [camReady, eventId, state.kind]);

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4">
        <AlertCircle className="h-10 w-10 text-[var(--text-muted)]" />
        <h1 className="text-xl font-bold text-[var(--text)]">Event not found</h1>
        <p className="text-sm text-[var(--text-muted)]">
          This check-in link is invalid or the event was deleted.
        </p>
        <Link
          href="/"
          className="mt-2 px-5 py-2.5 rounded-md text-sm font-semibold"
          style={{ background: "var(--accent)", color: "#080B0F" }}
        >
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", minHeight: "100dvh" }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3 gap-3">
        <Link href="/" aria-label="SmartPass" className="flex items-center">
          <SmartPassLogo height={22} />
        </Link>
        <div className="flex-1 min-w-0 text-right">
          <div className="text-[10px] uppercase tracking-widest font-mono text-[var(--text-muted)]">
            Event
          </div>
          <div className="text-[13px] font-semibold text-[var(--text)] truncate">
            {isLoading ? "—" : event?.event_name}
          </div>
        </div>
      </header>

      {/* Insecure warning */}
      {insecure && (
        <div className="mx-5 mb-2 px-3.5 py-2.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <span>
            Camera requires HTTPS. Use a Vercel preview or tunnel (cloudflared / ngrok) to test on a phone.
          </span>
        </div>
      )}

      {/* Camera area */}
      <main className="flex-1 flex flex-col px-5 gap-4 pb-5">
        <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-[var(--border)] bg-black">
          <Webcam
            key={facing}
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.85}
            videoConstraints={{
              facingMode: facing,
              width: { ideal: 720 },
              height: { ideal: 720 },
            }}
            onUserMedia={() => setCamReady(true)}
            onUserMediaError={() => {
              setState({ kind: "error", message: "Camera access denied" });
              setCamReady(false);
            }}
            mirrored={facing === "user"}
            className="w-full h-full object-cover"
          />

          {/* Bracket reticle overlay */}
          <BracketsOverlay />

          {/* Scan line */}
          {camReady && state.kind === "idle" && (
            <div
              className="absolute left-[8%] right-[8%] h-[3px] pointer-events-none rounded-full"
              style={{
                top: "10%",
                background: "linear-gradient(to right, transparent, rgba(0,229,200,0.95), transparent)",
                boxShadow: "0 0 14px rgba(0,229,200,0.7)",
                animation: "scanMove 2.4s ease-in-out infinite",
              }}
            />
          )}

          {/* Camera flip */}
          <button
            onClick={() => {
              setCamReady(false);
              setFacing((f) => (f === "user" ? "environment" : "user"));
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/55 backdrop-blur border border-white/15 flex items-center justify-center text-white active:scale-95 transition-transform"
            aria-label="Flip camera"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          {/* Tap-to-capture catcher */}
          <button
            onClick={capture}
            disabled={!camReady || state.kind === "capturing"}
            aria-label="Capture"
            className="absolute inset-0 cursor-pointer disabled:cursor-not-allowed"
            style={{ background: "transparent" }}
          />

          {/* Result overlay */}
          {state.kind !== "idle" && <ResultOverlay state={state} />}
        </div>

        {/* Status row */}
        <StatusRow state={state} camReady={camReady} />

        {/* Big check-in button */}
        <button
          onClick={capture}
          disabled={!camReady || state.kind === "capturing"}
          className="w-full h-16 rounded-2xl text-base font-bold transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: state.kind === "capturing" ? "var(--surface-2)" : "var(--accent)",
            color: state.kind === "capturing" ? "var(--text-muted)" : "#080B0F",
            boxShadow: state.kind === "capturing" ? "none" : "0 0 24px rgba(0,229,200,0.35)",
          }}
        >
          <Camera className="h-5 w-5" />
          {state.kind === "capturing" ? "Matching..." : "CHECK IN"}
        </button>
      </main>
    </div>
  );
}

/* Bracket reticle SVG — matches the brand mark, overlaid on the camera */
function BracketsOverlay() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ animation: "fadeIn 0.7s ease" }}
    >
      <path d="M6 16 L6 8 Q6 6 8 6 L16 6" stroke="#00E5C8" strokeWidth="0.6" strokeLinecap="round" fill="none" />
      <path d="M84 6 L92 6 Q94 6 94 8 L94 16" stroke="#00E5C8" strokeWidth="0.6" strokeLinecap="round" fill="none" />
      <path d="M6 84 L6 92 Q6 94 8 94 L16 94" stroke="#00E5C8" strokeWidth="0.6" strokeLinecap="round" fill="none" />
      <path d="M84 94 L92 94 Q94 94 94 92 L94 84" stroke="#00E5C8" strokeWidth="0.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function StatusRow({ state, camReady }: { state: State; camReady: boolean }) {
  const label = (() => {
    if (!camReady) return "Allow camera access";
    switch (state.kind) {
      case "idle":
        return "Tap CHECK IN when ready";
      case "capturing":
        return "Matching face...";
      case "verified":
        return `✓ ${state.attendant.name}`;
      case "denied":
        return "Face not recognized";
      case "no_face":
        return "No face detected";
      case "error":
        return state.message;
    }
  })();

  const color = (() => {
    switch (state.kind) {
      case "verified":
        return "#22C55E";
      case "denied":
      case "error":
        return "#EF4444";
      case "no_face":
        return "#F59E0B";
      default:
        return "var(--accent)";
    }
  })();

  return (
    <div
      className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border bg-[var(--surface)]"
      style={{ borderColor: "var(--border)" }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: color,
          animation: state.kind === "capturing" ? "pulseDot 1.2s ease-in-out infinite" : undefined,
        }}
      />
      <span
        className="text-[13px] font-medium tracking-tight"
        style={{ color: state.kind === "idle" || state.kind === "capturing" ? "var(--text)" : color }}
      >
        {label}
      </span>
    </div>
  );
}

function ResultOverlay({ state }: { state: State }) {
  const isOk = state.kind === "verified";
  const isFail = state.kind === "denied" || state.kind === "error";
  const isWarn = state.kind === "no_face";

  if (!isOk && !isFail && !isWarn) return null;

  const bg = isOk ? "rgba(34,197,94,0.15)" : isFail ? "rgba(239,68,68,0.18)" : "rgba(245,158,11,0.15)";
  const border = isOk ? "rgba(34,197,94,0.55)" : isFail ? "rgba(239,68,68,0.55)" : "rgba(245,158,11,0.55)";

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-6 backdrop-blur-md pointer-events-none"
      style={{
        background: bg,
        animation: "verifiedReveal 0.35s ease",
      }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2"
        style={{ borderColor: border, background: "rgba(0,0,0,0.3)" }}
      >
        {isOk && <Check className="h-10 w-10" style={{ color: "#22C55E" }} />}
        {isFail && <X className="h-10 w-10" style={{ color: "#EF4444" }} />}
        {isWarn && <AlertCircle className="h-10 w-10" style={{ color: "#F59E0B" }} />}
      </div>
      {state.kind === "verified" && (
        <>
          <div className="text-xl font-bold text-white mb-1 text-center">{state.attendant.name}</div>
          <div className="text-xs uppercase tracking-widest font-mono text-white/80">Checked in</div>
        </>
      )}
      {state.kind === "denied" && (
        <>
          <div className="text-xl font-bold text-white mb-1">Access Denied</div>
          <div className="text-xs uppercase tracking-widest font-mono text-white/80">Face not recognized</div>
        </>
      )}
      {state.kind === "no_face" && (
        <>
          <div className="text-xl font-bold text-white mb-1">No Face Detected</div>
          <div className="text-xs uppercase tracking-widest font-mono text-white/80">Try again</div>
        </>
      )}
      {state.kind === "error" && (
        <>
          <div className="text-xl font-bold text-white mb-1">Error</div>
          <div className="text-xs text-white/80 text-center max-w-xs">{state.message}</div>
        </>
      )}
    </div>
  );
}
