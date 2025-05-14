from fastapi import FastAPI
from .routes import router

app = FastAPI(title="Playback Service")
app.include_router(router)
