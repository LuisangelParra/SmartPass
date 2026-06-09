"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  eventId: string;
}

export function AttendantTable({ eventId }: Props) {
  const qc = useQueryClient();
  const { data: attendants = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["attendants", eventId],
    queryFn: () => api.getAttendants(eventId),
  });

  const { mutate: del } = useMutation({
    mutationFn: (id: string) => api.deleteAttendant(eventId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendants", eventId] });
      toast.success("Attendant removed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-[var(--surface-2)] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-muted)]">
          {attendants.length} attendant{attendants.length !== 1 ? "s" : ""}
        </span>
        <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {attendants.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <p>No attendants registered yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <th className="text-left px-4 py-3 text-[var(--text-muted)] font-medium">Name</th>
                <th className="text-left px-4 py-3 text-[var(--text-muted)] font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[var(--text-muted)] font-medium">Check-in Time</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {attendants.map((a, i) => (
                <tr
                  key={a.id}
                  className="border-b border-[var(--border)] last:border-0 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[var(--text)]">{a.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={a.attended ? "success" : "pending"}>
                      {a.attended ? "Attended ✓" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {a.attended_at
                      ? new Date(a.attended_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => del(a.id)}
                      aria-label="Remove attendant"
                    >
                      <Trash2 className="h-4 w-4 text-[var(--text-muted)]" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
