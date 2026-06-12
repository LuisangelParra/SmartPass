"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { Icon } from "@/components/landing/icons";

interface Props {
  eventId: string;
  eventName: string;
  open: boolean;
  onClose: () => void;
}

export function QRCheckIn({ eventId, eventName, open, onClose }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const hiddenCanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setUrl(`${window.location.origin}/c/${eventId}`);
  }, [eventId, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function copy() {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const canvas = hiddenCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const safe = eventName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "event";
    link.download = `smartpass-${safe}-qr.png`;
    link.href = dataUrl;
    link.click();
    toast.success("QR downloaded");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "oklch(0.1 0.012 256 / 0.7)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          border: "1px solid var(--line)",
          borderRadius: "var(--r-xl)",
          background: "var(--ink-850)",
          boxShadow: "var(--shadow-panel)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 22px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <h3 style={{ fontSize: 17 }}>Open reception on another device</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div style={{ padding: 22 }}>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--text-muted)",
              marginBottom: 18,
              lineHeight: 1.55,
            }}
          >
            Scan this with a tablet or phone at the entrance to launch the live
            check-in terminal for <b>{eventName}</b>.
          </p>
          <div className="qr-box">
            {url ? (
              <QRCodeSVG
                value={url}
                size={216}
                bgColor="#ffffff"
                fgColor="#0b0c0f"
                level="M"
                marginSize={0}
              />
            ) : (
              <div style={{ width: 216, height: 216 }} />
            )}
          </div>
          <div ref={hiddenCanvasRef} style={{ position: "absolute", left: -9999, top: -9999 }}>
            {url && (
              <QRCodeCanvas
                value={url}
                size={1024}
                bgColor="#ffffff"
                fgColor="#0b0c0f"
                level="M"
                marginSize={2}
              />
            )}
          </div>
          <div className="qr-url">
            <span>{url || "Loading…"}</span>
            <button
              className="icon-btn"
              style={{ width: 30, height: 30 }}
              onClick={copy}
            >
              <Icon name={copied ? "check" : "layers"} size={15} />
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn btn-ghost btn-block" onClick={download}>
              <Icon name="upload" size={17} /> Download PNG
            </button>
            <button
              className="btn btn-primary btn-block"
              onClick={() => router.push(`/events/${eventId}/checkin`)}
            >
              <Icon name="scan" size={17} /> Open here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
