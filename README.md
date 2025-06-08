# 🎵 Sp0t1fy - Scalable Music Streaming Service

## 🧑‍💻 Team Members
- Daniel Winston Mandela Tulung — 23/516260/PA/22080  
- Rindra Adriansyah — 23/511559/PA/21820

---

## 📌 Overview

**Sp0t1fy** is a fully functional music streaming platform built with microservices architecture. Unlike typical prototype projects, this application handles **real MP3 file uploads and playback**, storing actual audio data in the database and streaming it through a modern web interface.

The platform consists of **three independently deployable services**:

1. **User Service** (`localhost:8001`) – JWT-based authentication and user management
2. **Catalog Service** (`localhost:8002`) – Music metadata and **real MP3 file storage/streaming**
3. **Playback Service** (`localhost:8003`) – Play/pause/stop action logging and analytics

---

## 🎯 Key Features

✅ **Real Audio File Support** - Upload and stream actual MP3 files  
✅ **Modern React Frontend** - Spotify-inspired UI with drag & drop upload  
✅ **Full Audio Player** - Play, pause, stop, seek, volume control  
✅ **Search & Filter** - Real-time song search across title, artist, album  
✅ **Microservices Architecture** - Independent services with separate databases  
✅ **Docker Deployment** - Complete containerization with docker-compose  
✅ **Redis Caching** - Performance optimization for all services  

---

## 🏗️ Architecture Overview

```
Frontend (React)           Backend Services              Databases
     │                          │                          │
     ├─ localhost:3000          ├─ User Service            ├─ userdb (5433)
     │                          │  (localhost:8001)        │
     ├─ Upload Songs ──────────►├─ Catalog Service ────────├─ catalogdb (5434)
     │                          │  (localhost:8002)        │
     └─ Stream Music ──────────►├─ Playback Service ───────├─ playbackdb (5435)
                                │  (localhost:8003)        │
                                │                          │
                                └─ Redis Cache ────────────└─ redis (6379)
```

---

## 🗂️ Project Structure

```
ScalableArchitecturesCS/
├── docker-compose.yml              # Multi-service orchestration
├── dualitycover.mp3                # Sample audio file for testing
├── README.md
└── Music_Stream_App/
    ├── user_service/               # JWT auth & user management
    │   ├── models.py              # User SQLAlchemy model
    │   ├── routes.py              # /register, /login, /me endpoints
    │   ├── auth.py                # JWT token creation/validation
    │   └── Dockerfile
    ├── catalog_service/            # Music storage & streaming
    │   ├── models.py              # Song model with LargeBinary audio_blob
    │   ├── routes.py              # /songs (GET/POST), /songs/{id}/audio
    │   ├── main.py                # CORS setup for frontend
    │   └── Dockerfile
    ├── playback_service/           # Analytics & logging
    │   ├── models.py              # PlaybackLog model
    │   ├── routes.py              # /play, /history endpoints
    │   └── Dockerfile
    ├── music-stream-frontend/      # React SPA
    │   ├── src/
    │   │   ├── App.js             # Main app with Spotify-style design
    │   │   ├── components/
    │   │   │   ├── SongList.js    # Audio player with seek/volume
    │   │   │   └── AddSongForm.js # Drag & drop file upload
    │   │   └── api/
    │   │       ├── catalogApi.js  # Catalog service integration
    │   │       └── playbackApi.js # Playback service integration
    │   └── package.json
    ├── shared/                     # Common utilities
    └── events/                     # Event definitions (future use)
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, HTML5 Audio API, Spotify-inspired CSS |
| **Backend** | Python 3.12, FastAPI, Uvicorn |
| **Database** | PostgreSQL 16 (3 separate databases) |
| **Caching** | Redis 7 |
| **Authentication** | JWT with `python-jose[cryptography]` |
| **File Handling** | Python `python-multipart`, SQLAlchemy `LargeBinary` |
| **Deployment** | Docker, Docker Compose |

---

## 🚀 Quick Start

### 1. Start All Services
```bash
cd ScalableArchitecturesCS
docker-compose up --build
```

This starts:
- ✅ User Service → `http://localhost:8001`
- ✅ Catalog Service → `http://localhost:8002` 
- ✅ Playback Service → `http://localhost:8003`
- ✅ 3 PostgreSQL databases (ports 5433, 5434, 5435)
- ✅ Redis cache → `localhost:6379`

### 2. Start React Frontend
```bash
cd Music_Stream_App/music-stream-frontend
npm install
npm start
```

Frontend available at: `http://localhost:3000`

### 3. Upload & Play Music
1. Open `http://localhost:3000`
2. Click **"Upload Music"** tab
3. Drag & drop an MP3 file (or use [`dualitycover.mp3`](ScalableArchitecturesCS/dualitycover.mp3))
4. Fill in song details (title auto-populates from filename)
5. Click **"Upload Song"**
6. Switch to **"Your Library"** tab
7. Click **▷ Play** button to stream audio!

---

## 🎵 Real Audio File Implementation

### Backend: Binary Storage
**[`catalog_service/models.py`](ScalableArchitecturesCS/Music_Stream_App/catalog_service/models.py)**
```python
class Song(Base):
    __tablename__ = "songs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    audio_blob = Column(LargeBinary, nullable=False)  # 🎵 Real MP3 storage!
```

### API: File Upload & Streaming
**[`catalog_service/routes.py`](ScalableArchitecturesCS/Music_Stream_App/catalog_service/routes.py)**
```python
@router.post("/songs")
async def create_song(
    audio_file: UploadFile = File(...),  # 📁 Accept MP3 files
    # ... other form fields
):
    audio_data = await audio_file.read()  # Read binary data
    new_song = Song(audio_blob=audio_data)  # Store in database

@router.get("/songs/{song_id}/audio")
async def get_song_audio(song_id: str):
    return StreamingResponse(
        iter([song.audio_blob]),
        media_type="audio/mpeg"  # 🎧 Stream as MP3
    )
```

### Frontend: HTML5 Audio Player
**[`components/SongList.js`](ScalableArchitecturesCS/Music_Stream_App/music-stream-frontend/src/components/SongList.js)**
```javascript
// Dynamic audio source from our backend
audio.src = `http://localhost:8002/songs/${currentSong.id}/audio`;

// Professional controls
<input type="range" value={progress} onChange={onSeek} />  // Seek bar
<input type="range" value={volume} onChange={onVolumeChange} />  // Volume
```

---

## 🔑 API Endpoints

### User Service (`localhost:8001`)
```
POST /register  - Create new user account
POST /login     - Authenticate & get JWT token  
GET  /me        - Get current user info
POST /logout    - Logout (client-side token removal)
```

### Catalog Service (`localhost:8002`)
```
GET  /songs                 - List all songs with metadata
POST /songs                 - Upload song with MP3 file (multipart/form-data)
GET  /songs/{id}/audio      - Stream MP3 audio file
```

### Playback Service (`localhost:8003`)
```
POST /play              - Log play/pause/stop action
GET  /history/{user_id} - Get user's playback history
```

---

## 📊 Database Schemas

### User Service Database
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Catalog Service Database  
```sql
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    artist VARCHAR NOT NULL,
    album VARCHAR,
    genre VARCHAR,
    duration INTEGER,
    release_year INTEGER,
    audio_blob BYTEA NOT NULL  -- 🎵 Binary MP3 data stored here!
);
```

### Playback Service Database
```sql
CREATE TABLE playback_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    song_id UUID NOT NULL,  
    action VARCHAR CHECK (action IN ('play', 'pause', 'stop')),
    timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 Frontend Features

### Modern UI/UX
- **Spotify-inspired design** with `#1DB954` green theme
- **Responsive layout** that works on desktop and mobile
- **Smooth animations** and hover effects
- **Professional typography** and consistent spacing

### Audio Player
- **Full playback controls**: Play ▷, Pause ||, Stop ■
- **Seek bar**: Click or drag to jump to any position
- **Volume control**: Adjustable audio level
- **Time display**: Current time / Total duration
- **Now playing**: Prominent display of current song

### File Upload
- **Drag & drop interface** for MP3 files
- **Auto-fill song title** from filename
- **File validation** and size display
- **Upload progress** with loading states
- **Genre dropdown** with predefined options

### Search & Browse
- **Real-time search** across song title, artist, album
- **Results counter** showing filtered songs
- **Song cards** with metadata and genre tags
- **Empty states** with helpful messaging

---

## 🐳 Docker Deployment

### Services Configuration
**[`docker-compose.yml`](ScalableArchitecturesCS/docker-compose.yml)**

```yaml
version: "2.4"
services:
  # Three PostgreSQL databases (one per service)
  user_db:
    image: postgres:16
    ports: ["5433:5432"]
    environment:
      POSTGRES_DB: userdb
      
  catalog_db:
    image: postgres:16  
    ports: ["5434:5432"]
    environment:
      POSTGRES_DB: catalogdb
      
  playback_db:
    image: postgres:16
    ports: ["5435:5432"] 
    environment:
      POSTGRES_DB: playbackdb

  # Microservices
  user_service:
    build: ./Music_Stream_App/user_service
    ports: ["8001:8001"]
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:postgres@user_db:5432/userdb
      
  catalog_service:
    build: ./Music_Stream_App/catalog_service  
    ports: ["8002:8001"]
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:postgres@catalog_db:5432/catalogdb
      
  playback_service:
    build: ./Music_Stream_App/playback_service
    ports: ["8003:8001"] 
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:postgres@playback_db:5432/playbackdb

  # Redis for caching
  redis:
    image: redis:7
    ports: ["6379:6379"]
```

---

## 🔧 Development Challenges & Solutions

### Challenge 1: Database Initialization
**Problem**: Services failed to start because database tables didn't exist.  
**Solution**: Added automatic table creation in each service's startup event:

```python
@app.on_event("startup") 
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
```

### Challenge 2: Frontend-Backend Integration
**Problem**: CORS errors when React tried to call FastAPI services.  
**Solution**: Added CORS middleware in [`catalog_service/main.py`](ScalableArchitecturesCS/Music_Stream_App/catalog_service/main.py):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Challenge 3: File Upload vs JSON API
**Problem**: Frontend was sending JSON, but file upload requires `multipart/form-data`.  
**Solution**: Updated [`catalogApi.js`](ScalableArchitecturesCS/Music_Stream_App/music-stream-frontend/src/api/catalogApi.js) to use `FormData`:

```javascript
const formData = new FormData();
formData.append("title", songData.title);
formData.append("audio_file", audioFile);  // The actual MP3 file

const response = await fetch("http://localhost:8002/songs", {
    method: "POST",
    body: formData,  // No Content-Type header needed
});
```

### Challenge 4: Audio Streaming
**Problem**: How to serve binary MP3 data from database as streamable audio.  
**Solution**: Used FastAPI's `StreamingResponse` with proper MIME type:

```python
return StreamingResponse(
    iter([song.audio_blob]),  # Stream binary data
    media_type="audio/mpeg"   # Browser treats as MP3
)
```

---

## 🚦 Testing the Application

### 1. Service Health Checks
```bash
# Check all services are running
curl http://localhost:8001/  # User service
curl http://localhost:8002/  # Catalog service  
curl http://localhost:8003/  # Playback service
```

### 2. API Testing
```bash
# List songs (should be empty initially)
curl http://localhost:8002/songs

# Upload a song (requires multipart form)
curl -X POST http://localhost:8002/songs \
  -F "title=Test Song" \
  -F "artist=Test Artist" \
  -F "genre=Rock" \
  -F "duration=180" \
  -F "release_year=2024" \
  -F "audio_file=@dualitycover.mp3"

# Stream audio (replace with actual song ID)
curl http://localhost:8002/songs/{SONG_ID}/audio > test.mp3
```

### 3. Frontend Testing
1. Upload multiple songs with different genres
2. Test search functionality 
3. Verify audio playback with seek and volume controls
4. Check responsive design on different screen sizes

---

## 🎯 Production Readiness

### What's Already Implemented
✅ **Async Database Operations** - All services use `AsyncSession`  
✅ **Environment Configuration** - Docker environment variables  
✅ **Health Checks** - Database connection verification  
✅ **Error Handling** - Proper HTTP status codes and error messages  
✅ **Input Validation** - Pydantic models for request/response  
✅ **Security** - JWT authentication, password hashing with bcrypt  
✅ **Performance** - Redis caching integration  
✅ **Scalability** - Independent service deployment  

### Future Enhancements
- Load balancing with multiple service instances
- Database connection pooling optimization  
- CDN integration for audio streaming
- User playlists and recommendations
- Real-time collaboration features
- Mobile app development

---

## 💻 Development Experience

### What We Learned
- **Microservices Complexity**: Managing inter-service communication and dependencies
- **Async Programming**: FastAPI's async/await patterns and database operations  
- **File Handling**: Binary data storage and streaming in web applications
- **Modern Frontend**: React hooks, HTML5 Audio API, responsive design
- **DevOps**: Docker containerization, multi-service orchestration

### Real Challenges We Faced
- **Service Debugging**: Tracing errors across multiple containers and logs
- **Database Connections**: Async SQLAlchemy configuration and connection management
- **File Upload Integration**: Coordinating frontend FormData with backend file processing
- **Audio Player State**: Managing complex audio playback state in React
- **CORS Configuration**: Enabling secure cross-origin requests

---

## 📞 Contact

**Daniel Winston Mandela Tulung** - 23/516260/PA/22080  
**Rindra Adriansyah** - 23/511559/PA/21820

---

**Built with ♥ using Microservices Architecture**  
*© 2025 Sp0t1fy. All rights reserved.*

