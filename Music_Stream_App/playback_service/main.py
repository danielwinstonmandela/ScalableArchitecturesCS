from fastapi import FastAPI
from playback_service.routes import router

app = FastAPI(title="Playback Service")
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Playback Service is running!"}