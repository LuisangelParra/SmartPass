"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onCapture: (base64: string) => void;
  isProcessing: boolean;
}

export function WebcamCapture({ onCapture, isProcessing }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [camReady, setCamReady] = useState(false);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) onCapture(screenshot);
  }, [onCapture]);

  // Space key shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        capture();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [capture]);

  // Auto-capture
  useEffect(() => {
    if (!autoMode) return;
    const id = setInterval(capture, 2000);
    return () => clearInterval(id);
  }, [autoMode, capture]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-xl overflow-hidden bg-black border border-[var(--border)]">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
          className="w-full"
          onUserMedia={() => setCamReady(true)}
        />
        {/* Scan overlay */}
        {camReady && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: "2px solid rgba(79,138,255,0.3)",
              borderRadius: "inherit",
            }}
          />
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={capture}
          disabled={!camReady || isProcessing}
          className="flex-1"
          size="lg"
        >
          <Camera className="h-5 w-5" />
          {isProcessing ? "Processing…" : "Capture & Verify"}
        </Button>
        <Button
          variant={autoMode ? "destructive" : "outline"}
          size="lg"
          onClick={() => setAutoMode((m) => !m)}
          disabled={!camReady}
        >
          <Zap className="h-4 w-4" />
          {autoMode ? "Stop Auto" : "Auto"}
        </Button>
      </div>

      <p className="text-xs text-[var(--text-muted)] text-center">
        Press <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] text-xs font-mono">Space</kbd> to capture
      </p>
    </div>
  );
}
