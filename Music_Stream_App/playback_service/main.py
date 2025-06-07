from fastapi import FastAPI
from playback_service.routes import router
import os
import redis

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from playback_service.models import Base  # Make sure this path is correct

app = FastAPI(title="Playback Service")
app.include_router(router)

# Set up Redis connection using Docker environment variables
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0)

# Database setup
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost/playbackdb"
)
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Dependency for getting DB session (if you need it in your routes)
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Create tables at startup
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Playback DB tables created/verified.")

@app.get("/")
async def root():
    return {"message": "Playback Service is running!"}

@app.get("/cache/{key}")
async def read_cache(key: str):
    value = redis_client.get(key)
    if value:
        return {"key": key, "value": value.decode()}
    return {"key": key, "value": None}

@app.post("/cache/{key}")
async def write_cache(key: str, value: str):
    redis_client.set(key, value)
    return {"message": "Value set"}