"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { WebcamCapture } from "@/components/checkin/WebcamCapture";
import { MatchResult } from "@/components/checkin/MatchResult";
import type { Attendant } from "@/types";

type Result =
  | { type: "scanning" }
  | { type: "verified"; attendant: Attendant }
  | { type: "denied" }
  | { type: "no_face" };

interface ApiError extends Error {
  status: number;
}

export default function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [result, setResult] = useState<Result>({ type: "scanning" });
  const [history, setHistory] = useState<Attendant[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: event } = useQuery({
    queryKey: ["event", id],
    queryFn: () => api.getEvent(id),
  });

  async function handleCapture(base64: string) {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const attendant = await api.checkIn(id, base64);
      setResult({ type: "verified", attendant });
      setHistory((h) => [attendant, ...h].slice(0, 5));
    } catch (err) {
      const e = err as ApiError;
      if (e.status === 401) {
        setResult({ type: "denied" });
      } else if (e.status === 400) {
        setResult({ type: "no_face" });
      } else if (e.status === 404) {
        setResult({ type: "denied" });
      }
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen pt-16 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/events/${id}`}
            className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            {event?.event_name ?? "Check-In"} — Live Check-In
          </h1>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          <WebcamCapture onCapture={handleCapture} isProcessing={isProcessing} />

          <div className="flex flex-col gap-6">
            <MatchResult result={result} />

            {/* Recent check-ins */}
            {history.length > 0 && (
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">
                  Recent Check-Ins
                </h3>
                <ul className="space-y-2">
                  {history.map((a, i) => (
                    <li key={`${a.id}-${i}`} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text)] font-medium">{a.name}</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {a.attended_at
                          ? new Date(a.attended_at).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
