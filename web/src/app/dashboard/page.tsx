"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getStoredEventIds } from "@/lib/storage";
import { CreateEventDialog } from "@/components/dashboard/CreateEventDialog";
import { EventCard } from "@/components/dashboard/EventCard";
import type { StoredEvent } from "@/types";

export default function DashboardPage() {
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getStoredEventIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    Promise.allSettled(ids.map((id) => api.getEvent(id))).then((results) => {
      const hydrated: StoredEvent[] = results
        .map((r, i) => (r.status === "fulfilled" ? r.value : null))
        .filter((e): e is StoredEvent => e !== null);
      setEvents(hydrated);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 pt-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Your Events</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateEventDialog />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-[var(--border)] bg-[var(--surface)] animate-pulse"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-medium text-[var(--text)]">No events yet</p>
          <p className="text-sm mt-1">Create your first event to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDeleted={(id) => setEvents((e) => e.filter((ev) => ev.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
