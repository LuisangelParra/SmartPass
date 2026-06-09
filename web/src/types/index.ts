export interface Event {
  id: string;
  event_name: string;
  created_at: string;
}

export interface Attendant {
  id: string;
  event_id: string;
  name: string;
  attended: boolean;
  attended_at: string | null;
}

export interface BulkResult {
  message: string;
  errors: Array<{ file: string; error: string }>;
}

export interface StoredEvent extends Event {
  attendant_count?: number;
}
