"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, ArrowRight, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { removeStoredEvent } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import type { StoredEvent } from "@/types";

interface Props {
  event: StoredEvent;
  onDeleted: (id: string) => void;
}

export function EventCard({ event, onDeleted }: Props) {
  const { mutate: del, isPending } = useMutation({
    mutationFn: () => api.deleteEvent(event.id),
    onSuccess: () => {
      removeStoredEvent(event.id);
      onDeleted(event.id);
      toast.success(`Event "${event.event_name}" deleted`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const created = new Date(event.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors group">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="font-semibold text-[var(--text)] truncate">{event.event_name}</span>
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Calendar className="h-3 w-3" />
          {created}
        </span>
        <span className="text-xs text-[var(--text-dim)] font-mono">{event.id}</span>
      </div>
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => del()}
          disabled={isPending}
          aria-label="Delete event"
        >
          <Trash2 className="h-4 w-4 text-[var(--text-muted)] hover:text-red-400" />
        </Button>
        <Button asChild size="sm">
          <Link href={`/events/${event.id}`}>
            Manage
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
