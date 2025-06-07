from fastapi import FastAPI
from user_service.routes import router

app = FastAPI()
app.include_router(router)

@app.get("/")
def root():
    return {"message": "User Service is running"}