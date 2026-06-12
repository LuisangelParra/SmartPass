"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Icon } from "@/components/landing/icons";
import type { Attendant } from "@/types";

type Status = "idle" | "scanning" | "matching" | "welcome" | "denied";

interface ApiError extends Error {
  status: number;
}

function fmtTime(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ReceptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<
    | { ok: true; name: string; at: string | null }
    | { ok: false; msg: string }
    | null
  >(null);
  const [count, setCount] = useState(0);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState<"denied" | "unavailable" | null>(
    null
  );

  const webcamRef = useRef<Webcam>(null);
  const busyRef = useRef(false);
  const cooldownRef = useRef(false);

  const { data: event, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => api.getEvent(id),
    retry: false,
  });

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(async () => {
      if (busyRef.current || cooldownRef.current || !camReady) return;
      const frame = webcamRef.current?.getScreenshot({
        width: 480,
        height: 360,
      });
      if (!frame) return;
      busyRef.current = true;
      setStatus((s) => (s === "welcome" || s === "denied" ? s : "matching"));
      try {
        const a: Attendant = await api.checkIn(id, frame);
        setResult({ ok: true, name: a.name, at: a.attended_at });
        setStatus("welcome");
        setCount((c) => c + 1);
        cooldownRef.current = true;
        setTimeout(() => {
          cooldownRef.current = false;
          setStatus("scanning");
          setResult(null);
        }, 3200);
      } catch (err) {
        const e = err as ApiError;
        if (e.status === 401) {
          setResult({ ok: false, msg: "Not on the guest list" });
          setStatus("denied");
          cooldownRef.current = true;
          setTimeout(() => {
            cooldownRef.current = false;
            setStatus("scanning");
            setResult(null);
          }, 2600);
        } else if (e.status === 400) {
          setStatus((s) =>
            s === "welcome" || s === "denied" ? s : "scanning"
          );
        } else if (e.status === 404) {
          setResult({
            ok: false,
            msg: e.message || "No pending guests remain",
          });
          setStatus("denied");
          cooldownRef.current = true;
          setTimeout(() => {
            cooldownRef.current = false;
            setStatus("scanning");
            setResult(null);
          }, 2600);
        } else {
          toast.error(e.message || "Check-in failed");
          setStatus("scanning");
        }
      } finally {
        busyRef.current = false;
      }
    }, 1400);
    return () => clearInterval(iv);
  }, [running, id, camReady]);

  function start() {
    setRunning(true);
    setStatus("scanning");
  }
  function stop() {
    setRunning(false);
    setStatus("idle");
    setResult(null);
  }
  function flip() {
    setFacing((f) => (f === "user" ? "environment" : "user"));
  }

  if (isError) {
    return (
      <div className="cam-page" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 360, padding: 24 }}>
          <div
            className="result-icon"
            style={{
              margin: "0 auto 20px",
              background: "var(--red-dim)",
              color: "var(--red)",
            }}
          >
            <Icon name="x" size={36} stroke={2.4} />
          </div>
          <h2 style={{ fontSize: 22 }}>Reception unavailable</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 10 }}>
            Event not found or backend unreachable.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 22 }}
            onClick={() => router.push("/dashboard")}
          >
            <Icon name="arrow" size={17} /> Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const reticleClass =
    status === "welcome" ? "ok" : status === "denied" ? "bad" : "";

  const statusInfo: Record<Status, [string, string]> = {
    idle: ["TERMINAL READY", "var(--text-faint)"],
    scanning: ["SEARCHING FOR FACE", "var(--cyan)"],
    matching: ["MATCHING AGAINST POOL", "var(--amber)"],
    welcome: ["MATCH FOUND", "var(--green)"],
    denied: ["NO MATCH", "var(--red)"],
  };
  const [statusText, statusColor] = statusInfo[status];

  return (
    <div className="cam-page">
      <div className="cam-topbar">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => router.push(`/events/${id}`)}
        >
          <Icon name="arrow" size={16} /> Exit
        </button>
        <div className="spacer" />
        <div style={{ textAlign: "center", lineHeight: 1.25 }}>
          <div className="ttl">{event ? event.event_name : "Reception"}</div>
          <div
            className="mono"
            style={{ fontSize: 11, color: "var(--text-faint)" }}
          >
            entrance check-in
          </div>
        </div>
        <div className="spacer" />
        <button
          className="btn btn-ghost btn-sm"
          onClick={flip}
          title="Flip camera"
        >
          <Icon name="scan" size={16} />
        </button>
      </div>

      <div className="cam-stage">
        {camError ? (
          <div className="cam-placeholder">
            <div style={{ textAlign: "center", maxWidth: 340, padding: 24 }}>
              <span style={{ color: "var(--amber)" }}>
                <Icon name="face" size={32} />
              </span>
              <div style={{ fontWeight: 600, marginTop: 12 }}>
                {camError === "denied"
                  ? "Camera permission denied"
                  : "No camera available"}
              </div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--text-muted)",
                  marginTop: 8,
                }}
              >
                {camError === "denied"
                  ? "Allow camera access in your browser, then reload to use live check-in."
                  : "Connect a webcam, or use this on a device with a camera."}
              </p>
            </div>
          </div>
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: facing,
            }}
            className="cam-video"
            mirrored
            onUserMedia={() => {
              setCamReady(true);
              setCamError(null);
            }}
            onUserMediaError={(e) => {
              const name =
                typeof e === "object" && e && "name" in e ? (e as { name: string }).name : "";
              setCamError(name === "NotAllowedError" ? "denied" : "unavailable");
            }}
          />
        )}

        {running && !result && (
          <>
            <div className={"recticle-lg " + reticleClass}>
              <i className="tl" />
              <i className="tr" />
              <i className="bl" />
              <i className="br" />
            </div>
            <div className="cam-sweep" />
          </>
        )}

        <div className="cam-status-bar">
          <span
            className="d"
            style={{
              background: statusColor,
              boxShadow: `0 0 10px ${statusColor}`,
            }}
          />
          {statusText}
        </div>

        {running && (
          <div className="count-badge">
            <span className="n">{count}</span>
            <span className="lab">CHECKED IN THIS SESSION</span>
          </div>
        )}

        {result && result.ok && (
          <div className="result-overlay ok">
            <div
              className="result-icon"
              style={{
                background: "var(--green)",
                color: "oklch(0.16 0.02 150)",
              }}
            >
              <Icon name="check" size={52} stroke={2.6} />
            </div>
            <div className="result-name">
              Welcome, {result.name.split(" ")[0]}!
            </div>
            <div className="result-sub" style={{ color: "var(--green)" }}>
              {result.name}
            </div>
            <div className="chip result-chip">
              checked in · {fmtTime(result.at)}
            </div>
          </div>
        )}
        {result && !result.ok && (
          <div className="result-overlay bad">
            <div
              className="result-icon"
              style={{ background: "var(--red)", color: "white" }}
            >
              <Icon name="x" size={52} stroke={2.8} />
            </div>
            <div className="result-name" style={{ color: "white" }}>
              Access Denied
            </div>
            <div className="result-sub" style={{ color: "var(--red)" }}>
              {result.msg}
            </div>
          </div>
        )}

        {!running && !camError && (
          <div
            className="result-overlay"
            style={{ background: "oklch(0.1 0.012 256 / 0.5)" }}
          >
            <div
              className="result-icon"
              style={{
                background: "var(--ink-800)",
                border: "1px solid var(--line)",
                color: "var(--green)",
              }}
            >
              <Icon name="scan" size={46} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 600 }}>
              Ready to check guests in
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                marginTop: 10,
                maxWidth: 380,
              }}
            >
              Position the camera at the entrance and press start. Faces are
              matched the instant they appear.
            </p>
          </div>
        )}
      </div>

      <div className="cam-controls">
        {!running ? (
          <button
            className="btn btn-primary btn-lg"
            disabled={!!camError}
            onClick={start}
          >
            <Icon name="scan" size={19} /> Start check-in
          </button>
        ) : (
          <button className="btn btn-ghost btn-lg" onClick={stop}>
            <Icon name="x" size={18} /> Stop
          </button>
        )}
      </div>
    </div>
  );
}
