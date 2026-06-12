"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Icon } from "@/components/landing/icons";
import type { Attendant } from "@/types";

interface Props {
  eventId: string;
}

type Filter = "all" | "arrived" | "pending";

function initials(name: string) {
  return (
    (name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase() || "?"
  );
}

function shortId(id: string) {
  return id ? id.slice(0, 8) : "";
}

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function AttendantTable({ eventId }: Props) {
  const qc = useQueryClient();
  const { data: attendants = [], isLoading } = useQuery({
    queryKey: ["attendants", eventId],
    queryFn: () => api.getAttendants(eventId),
    refetchInterval: 3000,
  });

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [flashId, setFlashId] = useState<string | null>(null);
  const prevArrived = useRef<Set<string>>(new Set());

  useEffect(() => {
    const nowArrived = new Set(
      attendants.filter((a) => a.attended).map((a) => a.id)
    );
    let fresh: string | null = null;
    nowArrived.forEach((id) => {
      if (!prevArrived.current.has(id)) fresh = id;
    });
    if (fresh && prevArrived.current.size > 0) {
      setFlashId(fresh);
      const t = setTimeout(() => setFlashId(null), 1700);
      prevArrived.current = nowArrived;
      return () => clearTimeout(t);
    }
    prevArrived.current = nowArrived;
  }, [attendants]);

  const { mutate: del } = useMutation({
    mutationFn: (id: string) => api.deleteAttendant(eventId, id),
    onSuccess: (a) => {
      qc.invalidateQueries({ queryKey: ["attendants", eventId] });
      toast.success(`${a.name} removed`);
    },
    onError: (err: Error) => toast.error(err.message || "Remove failed"),
  });

  const rows = useMemo(() => {
    let r = attendants;
    if (filter === "arrived") r = r.filter((a) => a.attended);
    if (filter === "pending") r = r.filter((a) => !a.attended);
    if (q.trim())
      r = r.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));
    return [...r].sort((a: Attendant, b: Attendant) => {
      if (a.attended && b.attended)
        return (b.attended_at || "").localeCompare(a.attended_at || "");
      if (a.attended !== b.attended) return a.attended ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [attendants, q, filter]);

  return (
    <div>
      <div className="tbl-head">
        <h3>Guest list</h3>
        <span className="conn-pill off" style={{ borderColor: "var(--line)" }}>
          {attendants.length} total
        </span>
        <div className="spacer" />
        <div className="filter-seg">
          {(["all", "arrived", "pending"] as Filter[]).map((f) => (
            <button
              key={f}
              className={filter === f ? "on" : ""}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="search">
          <Icon name="scan" size={15} />
          <input
            placeholder="Search names"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="roster">
        <div className="r-row head">
          <span />
          <span>Name</span>
          <span className="r-time">Checked in</span>
          <span>Status</span>
          <span />
        </div>
        {isLoading ? (
          <div className="empty-state">
            <span className="spin" /> Loading guest list…
          </div>
        ) : rows.length === 0 ? (
          <div className="empty-state">
            <Icon name="face" size={30} />
            <div>
              {attendants.length === 0
                ? "No attendants yet — enroll someone to get started."
                : "No matches for this filter."}
            </div>
          </div>
        ) : (
          rows.map((a) => (
            <div
              className={"r-row" + (flashId === a.id ? " flash" : "")}
              key={a.id}
            >
              <span className="avatar-ph">{initials(a.name)}</span>
              <span className="r-name">
                {a.name}
                <small>{shortId(a.id)}</small>
              </span>
              <span className="r-time">
                {a.attended ? fmtTime(a.attended_at) : "—"}
              </span>
              <span
                className={
                  "status-tag " + (a.attended ? "arrived" : "pending")
                }
              >
                {a.attended ? "ARRIVED" : "PENDING"}
              </span>
              <button
                className="r-del"
                title="Remove"
                onClick={() => del(a.id)}
              >
                <Icon name="x" size={15} stroke={2} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
