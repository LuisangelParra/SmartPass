"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

interface Props {
  eventId: string;
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

export function MobileCheckIn({ eventId }: Props) {
  const webcamRef = useRef<Webcam>(null);
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
  const [insecure, setInsecure] = useState(false);

  const busyRef = useRef(false);
  const cooldownRef = useRef(false);

  const { data: event, isError } = useQuery({
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
        const a: Attendant = await api.checkIn(eventId, frame);
        setResult({ ok: true, name: a.name, at: a.attended_at });
        setStatus("welcome");
        setCount((c) => c + 1);
        navigator.vibrate?.(60);
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
          navigator.vibrate?.([40, 30, 40]);
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
  }, [running, eventId, camReady]);

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
    setCamReady(false);
    setFacing((f) => (f === "user" ? "environment" : "user"));
  }

  if (isError) {
    return (
      <div className="cam-page" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 320, padding: 24 }}>
          <div
            className="result-icon"
            style={{
              margin: "0 auto 20px",
              background: "var(--red-dim)",
              color: "var(--red)",
            }}
          >
            <Icon name="x" size={32} stroke={2.4} />
          </div>
          <h2 style={{ fontSize: 22 }}>Event not found</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 10 }}>
            This check-in link is invalid or the event was deleted.
          </p>
          <Link
            href="/"
            className="btn btn-primary"
            style={{ marginTop: 22, display: "inline-flex" }}
          >
            <Icon name="arrow" size={17} /> Go home
          </Link>
        </div>
      </div>
    );
  }

  const reticleClass =
    status === "welcome" ? "ok" : status === "denied" ? "bad" : "";

  const statusInfo: Record<Status, [string, string]> = {
    idle: ["TAP START", "var(--text-faint)"],
    scanning: ["SEARCHING FOR FACE", "var(--cyan)"],
    matching: ["MATCHING", "var(--amber)"],
    welcome: ["MATCH FOUND", "var(--green)"],
    denied: ["NO MATCH", "var(--red)"],
  };
  const [statusText, statusColor] = statusInfo[status];

  return (
    <div className="cam-page" style={{ minHeight: "100dvh" }}>
      <div className="cam-topbar">
        <Link className="btn btn-ghost btn-sm" href="/">
          <Icon name="arrow" size={16} />
        </Link>
        <div className="spacer" />
        <div style={{ textAlign: "center", lineHeight: 1.25 }}>
          <div className="ttl">{event ? event.event_name : "Reception"}</div>
          <div
            className="mono"
            style={{ fontSize: 11, color: "var(--text-faint)" }}
          >
            mobile check-in
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

      {insecure && (
        <div
          style={{
            margin: "0 16px 8px",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid oklch(0.82 0.15 75 / 0.35)",
            background: "oklch(0.82 0.15 75 / 0.08)",
            color: "var(--amber)",
            fontSize: 12.5,
            display: "flex",
            gap: 9,
          }}
        >
          <Icon name="lock" size={14} />
          <span>
            Camera requires HTTPS. Use a Vercel preview or tunnel to test on a
            phone.
          </span>
        </div>
      )}

      <div className="cam-stage">
        {camError ? (
          <div className="cam-placeholder">
            <div style={{ textAlign: "center", maxWidth: 300, padding: 24 }}>
              <span style={{ color: "var(--amber)" }}>
                <Icon name="face" size={28} />
              </span>
              <div style={{ fontWeight: 600, marginTop: 12 }}>
                {camError === "denied"
                  ? "Camera permission denied"
                  : "No camera available"}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginTop: 8,
                }}
              >
                Allow camera access in your browser, then reload.
              </p>
            </div>
          </div>
        ) : (
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
            mirrored={facing === "user"}
            onUserMedia={() => {
              setCamReady(true);
              setCamError(null);
            }}
            onUserMediaError={(e) => {
              const name =
                typeof e === "object" && e && "name" in e ? (e as { name: string }).name : "";
              setCamError(name === "NotAllowedError" ? "denied" : "unavailable");
            }}
            className={"cam-video" + (facing === "user" ? "" : " no-mirror")}
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
            <span className="lab">CHECKED IN</span>
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
              <Icon name="check" size={44} stroke={2.6} />
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
              <Icon name="x" size={44} stroke={2.8} />
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
              <Icon name="scan" size={40} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>
              Ready to check in
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                marginTop: 8,
                maxWidth: 280,
                fontSize: 14,
              }}
            >
              Point the camera at faces and start scanning.
            </p>
          </div>
        )}
      </div>

      <div className="cam-controls">
        {!running ? (
          <button
            className="btn btn-primary btn-lg btn-block"
            disabled={!!camError}
            onClick={start}
          >
            <Icon name="scan" size={19} /> Start scanning
          </button>
        ) : (
          <button className="btn btn-ghost btn-lg btn-block" onClick={stop}>
            <Icon name="x" size={18} /> Stop
          </button>
        )}
      </div>
    </div>
  );
}
