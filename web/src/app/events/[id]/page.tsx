"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Video } from "lucide-react";
import { api } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AttendantTable } from "@/components/event/AttendantTable";
import { RegisterForm } from "@/components/event/RegisterForm";
import { BulkUploadForm } from "@/components/event/BulkUploadForm";
import { QRCheckIn } from "@/components/event/QRCheckIn";

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [notFound, setNotFound] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => api.getEvent(id),
    retry: false,
  });

  const { data: attendants = [] } = useQuery({
    queryKey: ["attendants", id],
    queryFn: () => api.getAttendants(id),
    enabled: !!event,
  });

  useEffect(() => {
    if (!isLoading && !event) setNotFound(true);
  }, [isLoading, event]);

  useEffect(() => {
    if (notFound) router.push("/dashboard");
  }, [notFound, router]);

  if (isLoading || notFound) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 pt-24">
        <div className="h-8 w-48 rounded bg-[var(--surface-2)] animate-pulse mb-4" />
        <div className="h-4 w-96 rounded bg-[var(--surface-2)] animate-pulse" />
      </div>
    );
  }

  if (!event) return null;

  const attended = attendants.filter((a) => a.attended).length;
  const pending = attendants.length - attended;

  const createdDate = new Date(event.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 pt-24">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Left: event meta + stats */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text)]">{event.event_name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-mono text-[var(--text-dim)] bg-[var(--surface-2)] px-2 py-1 rounded">
                    {event.id}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{createdDate}</span>
                </div>
              </div>
              <Button asChild>
                <Link href={`/events/${id}/checkin`}>
                  <Video className="h-4 w-4" />
                  Start Check-In
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-6">
              {[
                { label: "Total", value: attendants.length },
                { label: "Attended", value: attended, color: "var(--green)" },
                { label: "Pending", value: pending, color: "var(--text-muted)" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-bold" style={{ color: s.color || "var(--text)" }}>
                    {s.value}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: QR card */}
          <QRCheckIn eventId={id} eventName={event.event_name} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attendants">
        <TabsList>
          <TabsTrigger value="attendants">Attendants</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="attendants">
          <AttendantTable eventId={id} />
        </TabsContent>

        <TabsContent value="register">
          <div className="grid md:grid-cols-2 gap-4">
            <RegisterForm eventId={id} />
            <BulkUploadForm eventId={id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
