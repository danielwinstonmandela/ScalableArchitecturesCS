# 🎵 Scalable Music Streaming Service

## 🧑‍💻 Team Members
- Daniel Winston Mandela Tulung — 23/516260/PA/22080  
- Rindra Adriansyah — 23/511559/PA/21820

---

## 📌 Overview

This project is a simplified, scalable **music streaming platform** designed using a microservices architecture. It consists of **three independently deployable services**, each focused on a specific business function:

1. **User Authentication Service** – handles user sign-up and login.  
2. **Music Catalogue Service** – stores and serves music metadata (title, artist, album, etc.).  
3. **Playback Service** – handles play, pause, and stop functionality.

Each service exposes a REST API and communicates in a loosely coupled manner, allowing for modular development and easier scaling.

---

## 🧩 1. Microservices Architecture

| Service                | Description                                         |
|------------------------|-----------------------------------------------------|
| **User Authentication**| Manages user registration and login using JWT       |
| **Music Catalogue**    | Stores and retrieves music metadata for browsing    |
| **Playback**           | Controls playback: play, pause, stop functionality  |

---

## ⚙️ 2. Microservices Evaluation

- **Why Microservices?**  
  We use microservices to ensure each component is scalable and independently deployable, especially useful in high-traffic environments like streaming platforms.

- **Communication:**  
  RESTful HTTP APIs between services.

- **Design Considerations:**  
  Stateless services, clear separation of responsibilities, and lightweight communication for simplicity.

---

### 🧱 3. Data Models

- **User Authentication Service**
  - `users` table:
    - `id`: UUID, primary key
    - `email`: string, unique
    - `password_hash`: string
    - `created_at`: timestamp

- **Music Catalogue Service**
  - `songs` table:
    - `id`: UUID, primary key
    - `title`: string
    - `artist`: string
    - `album`: string
    - `genre`: string
    - `duration`: integer (in seconds)
    - `release_year`: integer

- **Playback Service**
  - `playback_logs` table:
    - `id`: UUID, primary key
    - `user_id`: UUID, foreign key to users
    - `song_id`: UUID, foreign key to songs
    - `action`: enum (`play`, `pause`, `stop`)
    - `timestamp`: timestamp

---

## 📂 Week 8 Deliverables

### 🗂️ Database Schemas
Each service has its own database schema file:

- `schemas/user_auth.sql` – defines tables for user authentication.
- `schemas/music_catalogue.sql` – defines tables for song metadata.
- `schemas/playback.sql` – defines tables for playback logs.

### 📃 API Definitions (Swagger/OpenAPI)
Each service exposes a REST API defined using Swagger/OpenAPI:

- `docs/user_auth.yaml` – login and registration endpoints.
- `docs/music_catalogue.yaml` – endpoints for accessing song data.
- `docs/playback.yaml` – endpoints for play, pause, and stop actions.

### 🔁 Event Definitions

Although we use REST for now, we anticipate possible future event-based communication. Below are sample event structures:

event: playback.started
payload:
  user_id: UUID
  song_id: UUID
  timestamp: ISO8601

  Other potential events:

- `user.registered`
- `playback.paused`
- `playback.stopped`

---

### 🧠 Implementation Decisions

- **Language/Framework:** Python with FastAPI and Uvicorn  
- **Authentication:** JSON Web Tokens (JWT) using `python-jose[cryptography]`  
- **Database:** PostgreSQL with async support via `asyncpg` and `SQLAlchemy`  
- **Password Security:** `passlib[bcrypt]` for hashing and verifying passwords  
- **Data Validation:** `pydantic[email]` for request/response models  
- **Service Communication:** RESTful APIs over HTTP using FastAPI routes  

---

## 🛠️ Week 9: Service Implementation

During this week, we focus on building out the three core services identified in our architecture. Each service is developed as a standalone FastAPI app with its own database and API endpoints.

### ✅ Services Overview

| Service               | Description                          | Status |
|-----------------------|--------------------------------------|--------|
| **User Authentication** | Handles user registration and login | DONE 🔥 |
| **Music Catalogue**     | Stores and serves song metadata     | DONE 🙏|
| **Playback**            | Handles play, pause, stop actions   | DONE 🕊️|

Each service is placed in its own directory with the following structure:
```
/<service_name>/
├── auth.py
├── init.py
├── database.py
├── dockerfile
├── init_db.py
├── main.py
├── models.py
├── requirements.txt
├── routes.py

```

---

## ⚡ Week 10: Redis Caching Integration

To enhance performance and scalability, we integrate **Redis caching** into our services where applicable.

### 🔃 What We Cached

| Service               | Cached Data                            | Reason |
|-----------------------|-----------------------------------------|--------|
| **Music Catalogue**   | Frequently accessed songs or metadata   | Reduce DB queries for popular songs |
| **Playback**          | Current playback state per user         | Faster response when resuming/pausing |
| **User Auth**         | JWT session data (optional)             | Quick validation (experimental) |

### 🧰 Tools Used

- **Redis** as an in-memory store  
- **`aioredis`** or **`redis-py`** for integration with FastAPI  
- TTL (Time To Live) applied for automatic expiration of cached items

### ⚙️ Sample Redis Usage Pattern (Pseudocode)

```python
# Check cache first
song_data = redis.get(song_id)
if not song_data:
    # If not in cache, fetch from DB



    song_data = db.get_song(song_id)
    redis.set(song_id, song_data, ex=3600)  # cache for 1 hour
return song_data
```
Redis helps reduce response time and offload pressure from the database for read-heavy operations. As the services scale, this pattern becomes essential for performance.

---

## 🐳 Week 11: Docker Deployment

In the final week, we containerized each service using Docker for consistent, reproducible deployment across environments.

### 📦 Docker Setup Per Service

Each service includes a `Dockerfile` with the following basic structure:

```Dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
### Project Structure (Simplified View)

```
/project-root/
├── user_auth/
│   ├── Dockerfile
│   └── ...
├── music_catalogue/
│   ├── Dockerfile
│   └── ...
├── playback/
│   ├── Dockerfile
│   └── ...
└── docker-compose.yml
```

### ⚙️ docker-compose Setup
We use docker-compose to orchestrate the services and their dependencies (e.g., PostgreSQL, Redis):
```
version: '3.8'

services:
  user_auth:
    build: ./user_auth
    ports:
      - "8001:8000"
    depends_on:
      - auth_db

  music_catalogue:
    build: ./music_catalogue
    ports:
      - "8002:8000"
    depends_on:
      - music_db
      - redis

  playback:
    build: ./playback
    ports:
      - "8003:8000"
    depends_on:
      - playback_db
      - redis

  auth_db:
    image: postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: auth_db

  music_db:
    image: postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: music_db

  playback_db:
    image: postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: playback_db

  redis:
    image: redis:alpine
```

### Running the Project
``` docker-compose up --build```

All services will be accessible via different ports:

- User Auth → localhost:8001
- Music Catalogue → localhost:8002
- Playback → localhost:8003

## 🛠️ Setting Up the Frontend and Catalog Service

While Daniel was building the frontend to demonstrate that our backend services were working properly, he ran into a persistent issue: adding songs to the catalog service kept failing.

After a bit of digging, we realized the problem was that the databases for our services hadn’t been initialized — the necessary tables hadn’t been created yet. So essentially, we were trying to insert data into thin air... yeah, not ideal 😂

Once we set up the database tables correctly in each service, things started working as expected. The frontend successfully connected to the backend, and adding a song through our `AddSongForm` component would properly send it to the catalog service running on `localhost:8002`.

---

## 🎵 Uploading Real Audio Files (MP3 Support)

We wanted to go one step further and support real song uploads — actual `.mp3` files, not just song metadata.

Initially, we thought this might require using third-party cloud storage like **Google Cloud Storage**, **AWS S3**, or **Azure Blob Storage**. But we wanted to keep the stack lightweight and fully local, so we decided to store the audio files directly in our database using a `LargeBinary` (BLOB) field.

This approach came with its own challenges (and a bit of chaos 😅), but we eventually got it working. Users can now upload `.mp3` files via the frontend, and they will be saved and streamed from our backend — no external services required!

---

✅ Final result: You can now add songs with audio files through the frontend and they’ll be listed and playable directly from our local catalog service.

---

## 📝 Project Wrap-Up & Reflections

This project gave us a solid hands-on experience building a scalable microservices architecture from scratch. We designed, implemented, and deployed three core services—User Authentication, Music Catalogue, and Playback—using FastAPI, PostgreSQL, Redis, and Docker.

### What We Learned

- How to break down a complex platform into focused, independently deployable microservices.  
- Using REST APIs and JWT for secure, stateless communication between services.  
- Implementing Redis caching to boost performance and reduce database load.  
- Containerizing applications with Docker for consistent development and deployment.

### Challenges & Real Talk

- We’ll be honest—there were moments where we felt completely stuck for hours (it made us cry like literally 😭). Figuring out async database calls, proper API design, and integrating Redis took a lot of trial and error.  
- Managing multiple services and their dependencies was trickier than expected, especially when debugging inter-service communication.  
- Writing clean, maintainable code while rushing to meet deadlines was tough, but we grew a lot through it.

### What’s Next?

- Improve service resilience and add automated tests.  
- Explore event-driven architecture and message queues for better scalability.  
- Add more features like playlists, recommendations, and offline support.

Thanks for checking out our project — we’re proud of how far we’ve come, even if we fumbled along the way! 🚀

