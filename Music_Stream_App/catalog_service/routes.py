from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from catalog_service.models import Song  
from catalog_service.database import get_db
from catalog_service.schemas import SongRequest, SongOut  

router = APIRouter()

@router.get("/songs", response_model=list[SongOut])
async def list_songs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Song))
    return result.scalars().all()

@router.post("/songs", response_model=SongOut)
async def create_song(song: SongRequest, db: AsyncSession = Depends(get_db)):
    new_song = Song(**song.dict())
    db.add(new_song)
    await db.commit()
    await db.refresh(new_song)
    return new_song