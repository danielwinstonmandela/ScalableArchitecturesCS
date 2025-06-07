from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from playback_service.database import get_db
from playback_service.models import PlaybackLog  
from sqlalchemy.future import select

router = APIRouter()

@router.post("/play")
async def log_play(user_id: str, song_id: str, action: str, db: AsyncSession = Depends(get_db)):
    playback = PlaybackLog(user_id=user_id, song_id=song_id, action=action)
    db.add(playback)
    await db.commit()
    return {"message": "Playback action logged"}

@router.get("/history/{user_id}")
async def get_history(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PlaybackLog).where(PlaybackLog.user_id == user_id))
    history = result.scalars().all()
    return history