import type { Event } from "@/types";

const KEY = "smartpass_events";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveEvent(event: Event): void {
  const ids = read().filter((id) => id !== event.id);
  localStorage.setItem(KEY, JSON.stringify([event.id, ...ids]));
}

export function getStoredEventIds(): string[] {
  return read();
}

export function removeStoredEvent(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(read().filter((i) => i !== id)));
}
