from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from playback_service.database import get_db
from playback_service.models import Playback
from sqlalchemy.future import select

router = APIRouter()

@router.post("/play")
async def log_play(user_id: str, track_id: str, db: AsyncSession = Depends(get_db)):
    playback = Playback(user_id=user_id, track_id=track_id)
    db.add(playback)
    await db.commit()
    return {"message": "Track played"}

@router.get("/history/{user_id}")
async def get_history(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Playback).where(Playback.user_id == user_id))
    history = result.scalars().all()
    return history
