from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from catalog_service.models import TrackRequest, TrackOut, TrackTable
from catalog_service.database import get_db

router = APIRouter()

@router.get("/tracks", response_model=list[TrackOut])
async def list_tracks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TrackTable))
    return result.scalars().all()

@router.post("/tracks", response_model=TrackOut)
async def create_track(track: TrackRequest, db: AsyncSession = Depends(get_db)):
    new_track = TrackTable(**track.dict())
    db.add(new_track)
    await db.commit()
    await db.refresh(new_track)
    return new_track