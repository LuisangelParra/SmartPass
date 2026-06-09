# SmartPass

SmartPass is a **biometric access control API** for events. It eliminates physical tickets, QR codes, and RFID cards by using real-time facial recognition to verify attendees at check-in.

Organizers create an event, upload attendee photos (individually or in bulk via ZIP), then point a webcam at the door. The API matches faces against registered embeddings stored in PostgreSQL using `pgvector` L2 distance — no raw images ever persist.

---

## Features

- **Event management** — create, fetch, and delete events with UUID-based identifiers
- **Attendee registration** — single upload or bulk ZIP ingestion (filename → attendee name)
- **Privacy by design** — photos are converted to 128-dimensional vectors on arrival and discarded
- **Database-native search** — face matching runs as a SQL query using pgvector, not a Python loop
- **Real-time check-in** — accepts base64 webcam frames, silently skips empty frames, logs entry timestamp on match

---

## Tech Stack

| Layer | Technology |
|---|---|
| API framework | FastAPI |
| Database | PostgreSQL 17 + pgvector |
| ORM | SQLAlchemy 2.0 (`Mapped` / `mapped_column`) |
| Validation | Pydantic V2 |
| Face recognition | `face_recognition` (dlib), OpenCV, Pillow |
| Server | Uvicorn |
| Local infra | Docker Compose |

---

## Project Structure

```
SmartPass/
├── SmartPass/
│   ├── main.py                    # FastAPI app, lifespan events
│   ├── database.py                # Engine, session factory, get_db dependency
│   ├── database_models/
│   │   ├── base.py                # Declarative base
│   │   ├── event.py               # events table
│   │   └── attendant.py           # attendants table (pgvector column)
│   ├── schemas/
│   │   ├── event.py               # EventCreate, Event
│   │   ├── attendant.py           # Attendant (embedding excluded)
│   │   └── checkin.py             # CheckInRequest
│   ├── api/
│   │   ├── router.py              # Unified /api/v1 router
│   │   └── v1/
│   │       ├── events.py          # Event CRUD endpoints
│   │       └── attendants.py      # Attendant + check-in endpoints
│   └── services/
│       └── core_ia.py             # Embedding extraction, base64 decode
├── docker-compose.yml             # PostgreSQL/pgvector + Adminer
├── requirements.txt
└── docs/
    ├── api.md                     # Full API reference
    └── architecture.md            # Architecture overview
```

---

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.10+
- CMake and C++ build tools (required to compile dlib)

**macOS:**
```bash
brew install cmake
```

**Ubuntu/Debian:**
```bash
sudo apt-get install cmake build-essential
```

### 1. Clone and enter the repo

```bash
git clone <repo-url>
cd SmartPass
```

### 2. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 17 with the pgvector extension on port `5432`, and Adminer (DB UI) on port `8080`.

### 3. Create a virtual environment and install dependencies

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Start the API server

```bash
uvicorn SmartPass.main:app --reload
```

The API runs at `http://127.0.0.1:8000`.  
Interactive docs (Swagger UI): `http://127.0.0.1:8000/docs`  
Adminer (DB browser): `http://localhost:8080`

> The app auto-creates the `vector` extension and all tables on first boot via the FastAPI lifespan event. No manual migrations needed.

---

## Database Connection

The database URL is currently hardcoded in `SmartPass/database.py`:

```
postgresql+psycopg2://postgres:password@localhost:5432/example_db
```

These credentials match the defaults in `docker-compose.yml`. To use a different database, update that file directly.

---

## API Overview

Full reference: [`docs/api.md`](docs/api.md)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/events/` | Create event |
| `GET` | `/api/v1/events/{event_id}` | Get event |
| `DELETE` | `/api/v1/events/{event_id}` | Delete event (cascades attendants) |
| `POST` | `/api/v1/events/{event_id}/attendants` | Register single attendant |
| `POST` | `/api/v1/events/{event_id}/attendants/bulk` | Bulk register via ZIP |
| `GET` | `/api/v1/events/{event_id}/attendants` | List attendants |
| `POST` | `/api/v1/events/{event_id}/check-in` | Biometric check-in |
| `DELETE` | `/api/v1/events/{event_id}/attendants/{attendant_id}` | Remove attendant |

---

## Documentation

- [API Reference](docs/api.md) — all endpoints, request/response schemas, error codes
- [Architecture](docs/architecture.md) — system design, data flow, embedding pipeline

---

## License

MIT — see [LICENSE](LICENSE).
