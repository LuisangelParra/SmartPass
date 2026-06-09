import type { Event, Attendant, BulkResult } from "@/types";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

interface ApiError extends Error {
  status: number;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const err = new Error(body.detail ?? "Request failed") as ApiError;
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  createEvent: (name: string) =>
    req<Event>("/events/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: name }),
    }),

  getEvent: (id: string) => req<Event>(`/events/${id}`),

  deleteEvent: (id: string) =>
    req<Event>(`/events/${id}`, { method: "DELETE" }),

  addAttendant: (eventId: string, form: FormData) =>
    req<Attendant>(`/events/${eventId}/attendants`, {
      method: "POST",
      body: form,
    }),

  bulkUpload: (eventId: string, form: FormData) =>
    req<BulkResult>(`/events/${eventId}/attendants/bulk`, {
      method: "POST",
      body: form,
    }),

  getAttendants: (eventId: string) =>
    req<Attendant[]>(`/events/${eventId}/attendants`),

  deleteAttendant: (eventId: string, attendantId: string) =>
    req<Attendant>(`/events/${eventId}/attendants/${attendantId}`, {
      method: "DELETE",
    }),

  checkIn: (eventId: string, image_base64: string) =>
    req<Attendant>(`/events/${eventId}/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64 }),
    }),
};
