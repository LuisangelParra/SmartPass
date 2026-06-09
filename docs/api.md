# API Reference

Base URL: `http://127.0.0.1:8000/api/v1`  
Interactive docs: `http://127.0.0.1:8000/docs`

All IDs are UUIDs. All timestamps are UTC ISO 8601.

---

## Events

### Create Event

```
POST /events/
```

**Request body** (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `event_name` | string | Yes | Display name for the event |

**Example:**
```json
{ "event_name": "Tech Conference 2026" }
```

**Response** `200 OK`:
```json
{
  "id": "a1b2c3d4-...",
  "event_name": "Tech Conference 2026",
  "created_at": "2026-06-09T14:00:00Z"
}
```

---

### Get Event

```
GET /events/{event_id}
```

**Path params:**

| Param | Type | Description |
|---|---|---|
| `event_id` | UUID | Event identifier |

**Response** `200 OK`:
```json
{
  "id": "a1b2c3d4-...",
  "event_name": "Tech Conference 2026",
  "created_at": "2026-06-09T14:00:00Z"
}
```

**Errors:**
- `404` — event not found

---

### Delete Event

```
DELETE /events/{event_id}
```

Deletes the event and all associated attendants (cascade).

**Response** `200 OK` — returns the deleted event object.

**Errors:**
- `404` — event not found

---

## Attendants

### Register Single Attendant

```
POST /events/{event_id}/attendants
```

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string (form) | Yes | Attendant's full name |
| `image` | file | Yes | Photo of the attendant (JPEG, PNG) |

The uploaded image must contain **exactly one face**. The API extracts a 128-dimensional embedding and stores it — the raw image is discarded.

**Response** `200 OK`:
```json
{
  "id": "e5f6a7b8-...",
  "event_id": "a1b2c3d4-...",
  "name": "Jane Doe",
  "attended": false,
  "attended_at": null
}
```

**Errors:**
- `400` — invalid file type (not an image)
- `400` — no face detected in the image
- `400` — multiple faces detected in the image
- `404` — event not found
- `500` — unexpected image processing error

---

### Bulk Register via ZIP

```
POST /events/{event_id}/attendants/bulk
```

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `zip_file` | file | Yes | ZIP archive of attendant photos |

**ZIP file conventions:**
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Attendant name is derived from the filename: `john_doe.jpg` → `"john doe"`, `jane-smith.png` → `"jane smith"`
- Files in subdirectories are supported; only the filename (not path) is used for the name
- Dotfiles, `__MACOSX/` directories, and non-image files are silently skipped
- Each image must contain exactly one face; images with zero or multiple faces are reported in `errors` and skipped

**Response** `200 OK`:
```json
{
  "message": "Processed 42 attendants with 2 errors.",
  "errors": [
    { "file": "group_photo.jpg", "error": "Multiple faces detected. Please upload an individual photo containing only one person." },
    { "file": "blurry.png", "error": "No face detected in the image. Please upload a clear photo of a single person." }
  ]
}
```

**Errors:**
- `400` — uploaded file is not a ZIP
- `404` — event not found

---

### List Attendants

```
GET /events/{event_id}/attendants
```

Returns all attendants for an event including their check-in status.

**Response** `200 OK`:
```json
[
  {
    "id": "e5f6a7b8-...",
    "event_id": "a1b2c3d4-...",
    "name": "Jane Doe",
    "attended": true,
    "attended_at": "2026-06-09T15:30:00Z"
  },
  {
    "id": "c9d0e1f2-...",
    "event_id": "a1b2c3d4-...",
    "name": "John Smith",
    "attended": false,
    "attended_at": null
  }
]
```

**Errors:**
- `404` — event not found

---

### Biometric Check-In

```
POST /events/{event_id}/check-in
```

Verifies a live webcam frame against registered attendants and marks the best match as attended.

**Request body** (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `image_base64` | string | Yes | Base64-encoded image frame from webcam |

The `image_base64` value may optionally include a data URI prefix:
```
data:image/jpeg;base64,/9j/4AAQSkZJRg...
```
The prefix is stripped automatically if present.

**Matching logic:**
1. Extract 128-dim face embedding from the frame
2. Run pgvector L2 distance query against all unattended (`attended = false`) attendants for the event
3. Return the closest match if its L2 distance is ≤ `0.6` (the recognition threshold)
4. Mark the matched attendant as `attended = true`, set `attended_at` to current UTC time

**Response** `200 OK` — returns the matched and updated attendant:
```json
{
  "id": "e5f6a7b8-...",
  "event_id": "a1b2c3d4-...",
  "name": "Jane Doe",
  "attended": true,
  "attended_at": "2026-06-09T15:30:00Z"
}
```

**Errors:**
- `400` — could not decode base64 string into a valid image
- `400` — no face detected in the frame (safe to retry on next frame)
- `401` — face detected but L2 distance exceeds threshold (not recognized)
- `404` — event not found
- `404` — no pending (unattended) attendants remain for this event

---

### Remove Attendant

```
DELETE /events/{event_id}/attendants/{attendant_id}
```

**Path params:**

| Param | Type | Description |
|---|---|---|
| `event_id` | UUID | Event identifier |
| `attendant_id` | UUID | Attendant identifier |

**Response** `200 OK` — returns the deleted attendant object.

**Errors:**
- `404` — attendant not found in this event

---

## Data Models

### Event

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Auto-generated primary key |
| `event_name` | string (max 255) | Event display name |
| `created_at` | datetime (UTC) | Server-set creation timestamp |

### Attendant

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Auto-generated primary key |
| `event_id` | UUID | Parent event (FK, cascade delete) |
| `name` | string (max 255) | Attendant display name |
| `attended` | boolean | Whether check-in was completed (default: `false`) |
| `attended_at` | datetime (UTC) \| null | Timestamp of successful check-in |

> The `embedding_face` column (128-dim pgvector `Vector`) is never returned in API responses.

---

## Error Format

All errors follow FastAPI's default format:

```json
{
  "detail": "Human-readable error message"
}
```
