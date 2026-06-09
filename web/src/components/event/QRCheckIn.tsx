"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Copy, Download, Check, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  eventId: string;
  eventName: string;
}

export function QRCheckIn({ eventId, eventName }: Props) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const hiddenCanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(`${window.location.origin}/c/${eventId}`);
  }, [eventId]);

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
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
    <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
          <QrCode className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[var(--text)]">Mobile Check-In</h3>
          <p className="text-xs text-[var(--text-muted)]">Scan with any phone to start</p>
        </div>
      </div>

      {/* QR */}
      <div className="flex items-center justify-center p-4 rounded-[10px] bg-[var(--bg)] border border-[var(--border)]">
        {url ? (
          <QRCodeSVG
            value={url}
            size={196}
            bgColor="transparent"
            fgColor="#00E5C8"
            level="M"
            marginSize={0}
          />
        ) : (
          <div className="w-[196px] h-[196px] animate-pulse bg-[var(--surface-2)] rounded" />
        )}
      </div>

      {/* Hidden canvas used for PNG export */}
      <div ref={hiddenCanvasRef} style={{ position: "absolute", left: -9999, top: -9999 }}>
        {url && (
          <QRCodeCanvas
            value={url}
            size={1024}
            bgColor="#0D1117"
            fgColor="#00E5C8"
            level="M"
            marginSize={2}
          />
        )}
      </div>

      {/* URL display */}
      <div className="flex items-center gap-1.5">
        <code className="flex-1 px-3 py-2 rounded-md bg-[var(--bg)] border border-[var(--border)] font-mono text-[11px] text-[var(--text-muted)] truncate">
          {url || "Loading..."}
        </code>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={copy} disabled={!url}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button variant="outline" size="sm" onClick={download} disabled={!url}>
          <Download className="h-3.5 w-3.5" />
          Download PNG
        </Button>
      </div>

      <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">
        Camera access requires HTTPS. Deploy to Vercel or use a tunnel for testing on a phone over LAN.
      </p>
    </div>
  );
}
