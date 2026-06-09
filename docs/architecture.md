# Architecture

## Overview

SmartPass is a stateless REST API. All state lives in PostgreSQL. The API layer handles HTTP concerns, the services layer owns ML processing, and the database layer owns persistence and vector search.

```
Client (webcam / admin UI)
        │
        ▼
  FastAPI (Uvicorn)
        │
   ┌────┴────┐
   │ API v1  │  /api/v1/events, /attendants, /check-in
   └────┬────┘
        │
   ┌────┴────────┐
   │  Services   │  core_ia.py — embedding extraction
   └────┬────────┘
        │
   ┌────┴────────────────────────────┐
   │  PostgreSQL 17 + pgvector       │
   │  tables: events, attendants     │
   │  column: embedding_face Vector  │
   └─────────────────────────────────┘
```

---

## Request Flow: Attendant Registration

```
POST /events/{id}/attendants
        │
        ▼
Validate content-type (image/*)
        │
        ▼
extract_embedding(image_bytes)
  → PIL open + convert RGB
  → numpy array
  → face_recognition.face_encodings()
  → assert exactly 1 face
  → return list[float] (128 dims)
        │
        ▼
INSERT INTO attendants
  (id, event_id, name, embedding_face, attended)
        │
        ▼
Return Attendant schema (embedding excluded)
```

Raw image bytes exist only in memory during the request. They are never written to disk or stored in the database.

---

## Request Flow: Check-In

```
POST /events/{id}/check-in  { image_base64: "..." }
        │
        ▼
decode_base64_frame()
  → strip data URI prefix if present
  → base64.b64decode()
  → cv2.imdecode() → BGR numpy array
        │
        ▼
extract_frame_embedding_for_checkin()
  → convert BGR → RGB
  → face_recognition.face_encodings()
  → return [] if no face (caller raises 400)
        │
        ▼
pgvector L2 distance query:
  SELECT attendants.*,
         embedding_face <-> :live_vector AS distance
  FROM attendants
  WHERE event_id = :event_id
    AND attended = false
  ORDER BY distance
  LIMIT 1
        │
        ▼
distance ≤ 0.6 ?
  Yes → UPDATE attended=true, attended_at=now()
        return Attendant
  No  → 401 "Face not recognized"
```

The entire matching operation is a single SQL query. pgvector computes L2 distances inside PostgreSQL using its native vector operators.

---

## Data Model

```
events
──────
id            UUID  PK
event_name    VARCHAR(255)
created_at    TIMESTAMPTZ  server_default=now()

attendants
──────────
id             UUID  PK
event_id       UUID  FK → events.id  ON DELETE CASCADE
name           VARCHAR(255)
embedding_face VECTOR(128)           ← pgvector column
attended       BOOLEAN  default=false
attended_at    TIMESTAMPTZ  nullable
```

Cascade delete on `event_id` means deleting an event removes all its attendants and their embeddings atomically.

---

## Embedding Pipeline

SmartPass uses the `face_recognition` library (built on dlib's ResNet model) to produce 128-dimensional face embeddings.

- **Registration path:** image file → RGB array → `face_recognition.face_encodings()` → `list[float]` stored as `VECTOR(128)`
- **Check-in path:** base64 frame → BGR array → RGB → `face_recognition.face_encodings()` → live vector for SQL query

The recognition threshold is `0.6` L2 distance (Euclidean). Lower distance = closer match. This value is hardcoded in `SmartPass/api/v1/attendants.py:159`.

| L2 distance | Interpretation |
|---|---|
| 0.0 | Identical vectors |
| < 0.4 | Very high confidence match |
| 0.4 – 0.6 | Acceptable match |
| > 0.6 | Rejected (different person) |

---

## Key Design Decisions

**No image storage.** Images are processed in memory and immediately discarded. Only the mathematical embedding persists, which cannot be reversed to reconstruct the original face.

**Database-native vector search.** Matching uses `pgvector`'s `<->` L2 distance operator inside SQL. This avoids loading all embeddings into Python memory and scales naturally with PostgreSQL indexing (IVFFlat / HNSW indexes can be added for large datasets).

**Bulk upload via in-memory ZIP.** The entire ZIP is read into memory with `io.BytesIO` and processed with `zipfile.ZipFile`. No temp files on disk. Tradeoff: memory usage scales with ZIP size.

**Synchronous database driver.** Uses `psycopg2` (sync) with async FastAPI. Acceptable for moderate load; for high concurrency, replace with `asyncpg` + SQLAlchemy async session.

**Schema auto-creation.** `Base.metadata.create_all()` runs on startup via the lifespan event. No migration tool (Alembic) is currently used — schema changes require manual intervention or a drop-and-recreate.

---

## Directory Map

| Path | Responsibility |
|---|---|
| `SmartPass/main.py` | App factory, lifespan (DB init) |
| `SmartPass/database.py` | Engine, `LocalSession`, `get_db` dependency |
| `SmartPass/database_models/` | SQLAlchemy ORM models |
| `SmartPass/schemas/` | Pydantic request/response models |
| `SmartPass/api/v1/` | Route handlers (thin: validate, call service, return) |
| `SmartPass/services/core_ia.py` | All ML logic isolated here |
| `docker-compose.yml` | Local PostgreSQL + pgvector + Adminer |
