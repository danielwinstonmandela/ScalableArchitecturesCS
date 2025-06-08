from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- import CORS middleware
from catalog_service.routes import router
import os
import redis
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from catalog_service.models import Base

# FastAPI app setup
app = FastAPI()
app.include_router(router)


# Add this CORS middleware setup:
origins = [
    "http://localhost:3000",  # your React frontend URL (change if different)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allow your frontend to access backend
    allow_credentials=True,
    allow_methods=["*"],          # allow all HTTP methods
    allow_headers=["*"],          # allow all headers
)

app.include_router(router)

# Redis setup
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0)

# Database setup
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost/catalogdb"
)
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Dependency for getting DB session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Create tables at startup
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Catalog DB tables created/verified.")

@app.get("/")
def root():
    return {"message": "Catalog Service is running"}

@app.get("/cache/{key}")
def read_cache(key: str):
    value = redis_client.get(key)
    if value:
        return {"key": key, "value": value.decode()}
    return {"key": key, "value": None}

@app.post("/cache/{key}")
def write_cache(key: str, value: str):
    redis_client.set(key, value)
    return {"message": "Value set"}