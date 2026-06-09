# SmartPass

SmartPass is a high-performance, open-source **Biometric Access Control System** designed for events, coworking spaces, and conferences. It eliminates the need for physical tickets, QR codes, or RFID cards by leveraging real-time facial recognition.

Built with a modern Python stack and a cloud-ready architecture, SmartPass allows organizers to create free-access events, upload attendee lists seamlessly, and manage live check-ins using any standard webcam stream.

---

## 🚀 Core Features

* **Instant Event Creation:** Zero-friction event setup without mandatory global admin registration. Each event generates a secure, unique identifier (UUID).
* **Smart Attendee Management:** Supports both individual attendee registration and high-speed bulk uploads via ZIP archives containing labeled images—processed entirely in memory.
* **Database-Driven AI Search:** Powered by PostgreSQL and the `pgvector` extension. Facial embeddings are compared directly inside the SQL engine using optimized L2 distance queries rather than looping in Python.
* **Privacy by Design:** SmartPass never stores raw images. Pictures are processed into 128-dimensional mathematical vectors upon arrival and immediately discarded from memory.
* **Real-Time Webcam Check-in:** Accepts base64 video frames from frontend webcam loops, filtering out empty frames silently and executing rapid identity verification.

---

## 🛠️ Tech Stack & Architecture

SmartPass is engineered using industry-standard tools focused on speed, type safety, and clean separation of concerns:

* **Backend:** FastAPI (Asynchronous Python framework)
* **Database Engine:** PostgreSQL
* **Vector Database Extension:** `pgvector` (Enables native vector similarity searches)
* **ORM:** SQLAlchemy 2.0 (Utilizing modern `Mapped` and `mapped_column` syntax)
* **Data Validation:** Pydantic V2 (Enforces strict data schemas and input validation)
* **Computer Vision / ML:** `face_recognition` (dlib-based), OpenCV, and Pillow

---

## 📁 Repository Structure

The project strictly follows the **Single Responsibility Principle (SRP)**, separating database infrastructure, request/response validation, API routes, and machine learning services:

```text
smartpass-backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entrypoint & lifespan events
│   ├── database.py             # SQLAlchemy infrastructure (Engine, SessionLocal, get_db)
│   │
│   ├── database_models/        # SQLAlchemy database schemas (Data Persistence Layer)
│   │   ├── __init__.py
│   │   ├── base.py             # Isolated declarative base class
│   │   ├── event.py           # Events table definition
│   │   └── attendant.py       # Attendants table definition with pgvector columns
│   │
│   ├── schemas/                # Pydantic models (Data Validation & Serialization Layer)
│   │   ├── __init__.py
│   │   ├── event.py           # Inbound and outbound event models
│   │   ├── attendant.py       # Outbound attendant models (filters biometric vectors)
│   │   └── checkin.py         # Webcam payload validation models
│   │
│   ├── api/                    # REST API Routes
│   │   ├── router.py          # Unified API router
│   │   └── v1/
│   │       ├── endpoint_events.py
│   │       └── endpoint_attendants.py
│   │
│   └── services/               # Isolated Machine Learning & Business Logic
│       └── core_ia.py          # Facial detection, base64 decoding, & embedding extraction
│
├── Dockerfile
├── requirements.txt
└── README.md

```

---

## 🔌 API Endpoints Reference

### 🆕 Event & Attendee Management

* `POST /api/v1/events/` - Creates a new event. Generates a unique UUID and server-side creation timestamp.
* `GET /api/v1/events/{event_id}` - Validates and fetches single event details.
* `POST /api/v1/events/{event_id}/attendants/` - Registers a single attendee using a `multipart/form-data` name and image file. Validates that exactly one face is present.
* `POST /api/v1/events/{event_id}/attendants/bulk` - Extracts, cleans, and registers hundreds of attendees simultaneously from an uploaded ZIP file using in-memory streams.
* `GET /api/v1/events/{event_id}/attendants` - Retrieves the full list of attendees for an event, tracking their live attendance status (`attended` / `attended_at`).

### 📸 Live Biometric Verification

* `POST /api/v1/events/{event_id}/check-in` - Receives base64 webcam frames. Extracts the live face vector, searches PostgreSQL using `pgvector` for unmatched attendees, evaluates mathematical confidence thresholds ($Tolerance \le 0.6$), and logs entry.

### 🗑️ Data Lifecycle & Deletion

* `DELETE /api/v1/events/{event_id}` - Deletes an event. Leverages PostgreSQL foreign key constraints (`ON DELETE CASCADE`) to instantly erase all associated attendee records and biometric signatures.
* `DELETE /api/v1/events/{event_id}/attendants/{attendant_id}` - Safely deletes an individual attendee profile.

---

## ⚡ Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/smartpass-backend.git
cd smartpass-backend

```

### 2. Run PostgreSQL with pgvector using Docker

```bash
docker compose up -d

```

### 3. Setup Virtual Environment & Dependencies

> *Note: Ensure you have CMake and C++ build tools installed on your operating system prior to compiling dlib dependencies.*

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

```

### 4. Configure Environment Variables

Create a `.env` file in the root directory (or let the app default to localhost):

```env
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/example_db

```

### 5. Start the Application

```bash
uvicorn app.main:app --reload

```

Once started, the interactive API documentation and testing sandbox will be available natively via Swagger UI at **`http://127.0.0.1:8000/docs`**.