"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Icon } from "@/components/landing/icons";
import { AttendantTable } from "@/components/event/AttendantTable";
import { RegisterForm } from "@/components/event/RegisterForm";
import { BulkUploadForm } from "@/components/event/BulkUploadForm";
import { QRCheckIn } from "@/components/event/QRCheckIn";

function shortId(id: string) {
  return id ? id.slice(0, 8) : "";
}

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [notFound, setNotFound] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => api.getEvent(id),
    retry: false,
  });

  const { data: attendants = [] } = useQuery({
    queryKey: ["attendants", id],
    queryFn: () => api.getAttendants(id),
    enabled: !!event,
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (!isLoading && !event) setNotFound(true);
  }, [isLoading, event]);

  useEffect(() => {
    if (notFound) router.push("/dashboard");
  }, [notFound, router]);

  if (isLoading || notFound || !event) {
    return (
      <>
        <AppBar />
        <div className="dash-page">
          <div className="wrap">
            <div
              style={{
                height: 28,
                width: 240,
                borderRadius: 8,
                background: "var(--ink-800)",
                marginBottom: 16,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <div
              style={{
                height: 16,
                width: 400,
                borderRadius: 8,
                background: "var(--ink-800)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </>
    );
  }

  const total = attendants.length;
  const arrived = attendants.filter((a) => a.attended).length;
  const pending = total - arrived;
  const pct = total ? Math.round((arrived / total) * 100) : 0;

  return (
    <>
      <AppBar
        event={event}
        right={
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setQrOpen(true)}
            >
              <Icon name="layers" size={16} /> Reception QR
            </button>
            <Link
              className="btn btn-primary btn-sm"
              href={`/events/${id}/checkin`}
            >
              <Icon name="scan" size={16} /> Open reception
            </Link>
          </div>
        }
      />

      <div className="dash-page">
        <div className="wrap dash-layout">
          <div className="side-col">
            <RegisterForm eventId={id} />
            <BulkUploadForm eventId={id} />
          </div>

          <div className="main-col">
            <div className="stat-row">
              <div className="stat-tile">
                <div className="l">Total guests</div>
                <div className="v">{total}</div>
              </div>
              <div className="stat-tile accent">
                <div className="l">Checked in</div>
                <div className="v">{arrived}</div>
              </div>
              <div className="stat-tile">
                <div className="l">Pending</div>
                <div className="v">{pending}</div>
              </div>
              <div className="stat-tile">
                <div className="l">Attendance</div>
                <div className="v">
                  {pct}
                  <small>%</small>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span className="conn-pill live">
                <span className="d" />
                LIVE
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bar">
                  <i style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span
                className="mono"
                style={{
                  fontSize: 12,
                  color: "var(--text-faint)",
                  whiteSpace: "nowrap",
                }}
              >
                auto-refresh · 3s
              </span>
            </div>

            <AttendantTable eventId={id} />
          </div>
        </div>
      </div>

      <QRCheckIn
        eventId={id}
        eventName={event.event_name}
        open={qrOpen}
        onClose={() => setQrOpen(false)}
      />
    </>
  );
}

function AppBar({
  event,
  right,
}: {
  event?: { id: string; event_name: string };
  right?: React.ReactNode;
}) {
  return (
    <div className="appbar">
      <div className="wrap appbar-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Icon name="fingerprint" size={17} stroke={1.8} />
          </span>
          SmartPass
        </Link>
        {event && (
          <div
            style={{
              borderLeft: "1px solid var(--line)",
              paddingLeft: 18,
              lineHeight: 1.25,
            }}
          >
            <div className="ev-name">{event.event_name}</div>
            <div className="ev-id">event/{shortId(event.id)}</div>
          </div>
        )}
        <div className="spacer" />
        {right}
        <Link href="/dashboard" className="btn btn-ghost btn-sm">
          <Icon name="arrow" size={15} /> All events
        </Link>
      </div>
    </div>
  );
}
