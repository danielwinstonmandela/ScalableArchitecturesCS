from fastapi import FastAPI
from catalog_service.routes import router
import os
import redis

app = FastAPI()
app.include_router(router)

# Set up Redis connection using Docker environment variables
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0)

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