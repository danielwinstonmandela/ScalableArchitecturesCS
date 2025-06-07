from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from catalog_service.models import Song
from catalog_service.database import get_db
from catalog_service.schemas import SongOut
import uuid
from fastapi.responses import StreamingResponse
from fastapi import HTTPException

router = APIRouter()

@router.get("/songs", response_model=list[SongOut])
async def list_songs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Song))
    return result.scalars().all()

@router.post("/songs", response_model=SongOut)
async def create_song(
    title: str = Form(...),
    artist: str = Form(...),
    album: str = Form(None),
    genre: str = Form(...),
    duration: int = Form(...),
    release_year: int = Form(...),
    audio_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    audio_data = await audio_file.read()
    new_song = Song(
        id=uuid.uuid4(),
        title=title,
        artist=artist,
        album=album,
        genre=genre,
        duration=duration,
        release_year=release_year,
        audio_blob=audio_data
    )
    db.add(new_song)
    await db.commit()
    await db.refresh(new_song)
    return new_song

@router.get("/songs/{song_id}/audio")
async def get_song_audio(song_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Song).where(Song.id == song_id))
    song = result.scalar_one_or_none()
    if song is None or not song.audio_blob:
        raise HTTPException(status_code=404, detail="Song not found")
    # Replace audio/mpeg with the correct type if you store other formats
    return StreamingResponse(
        iter([song.audio_blob]),
        media_type="audio/mpeg"
    )